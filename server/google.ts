import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { channels } from '../db/schema.js'

// Google OAuth + YouTube Data/Analytics API helpers. Credentials come from
// the GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET environment variables.

export const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
  'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
]

export const googleConfigured = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

const key = () =>
  createHash('sha256').update(`trendreel:${process.env.GOOGLE_CLIENT_SECRET ?? ''}`).digest()

export function encrypt(plain: string) {
  const iv = randomBytes(12)
  const c = createCipheriv('aes-256-gcm', key(), iv)
  const data = Buffer.concat([c.update(plain, 'utf8'), c.final()])
  return [iv, c.getAuthTag(), data].map((b) => b.toString('base64url')).join('.')
}

export function decrypt(token: string) {
  const [iv, tag, data] = token.split('.').map((s) => Buffer.from(s, 'base64url'))
  const d = createDecipheriv('aes-256-gcm', key(), iv)
  d.setAuthTag(tag)
  return Buffer.concat([d.update(data), d.final()]).toString('utf8')
}

// Session cookie: signed channel id, set after a successful Google sign-in.
const sign = (v: string) => createHmac('sha256', key()).update(v).digest('base64url')
export const sessionCookie = (channelId: string) =>
  `tr_session=${channelId}.${sign(channelId)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 90}`
export function sessionChannel(req: Request) {
  const raw = req.headers.get('cookie')?.match(/tr_session=([^;]+)/)?.[1]
  if (!raw) return null
  const i = raw.lastIndexOf('.')
  const id = raw.slice(0, i)
  const a = Buffer.from(sign(id))
  const b = Buffer.from(raw.slice(i + 1))
  return a.length === b.length && timingSafeEqual(a, b) ? id : null
}

export function authUrl(origin: string, state: string) {
  const p = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${origin}/api/auth/callback`,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${p}`
}

async function tokenRequest(body: Record<string, string>) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      ...body,
    }),
  })
  const json = (await res.json()) as { access_token?: string; refresh_token?: string; error_description?: string; error?: string }
  if (!res.ok || !json.access_token) throw new Error(`Google token error: ${json.error_description ?? json.error ?? res.status}`)
  return json
}

export const exchangeCode = (code: string, origin: string) =>
  tokenRequest({ code, grant_type: 'authorization_code', redirect_uri: `${origin}/api/auth/callback` })

export async function getChannel() {
  const [c] = await db.select().from(channels).limit(1)
  return c ?? null
}

let cached: { token: string; exp: number } | null = null
export async function accessToken() {
  if (cached && cached.exp > Date.now()) return cached.token
  const c = await getChannel()
  if (!c) throw new Error('No YouTube channel is linked')
  const t = await tokenRequest({ refresh_token: decrypt(c.refreshToken), grant_type: 'refresh_token' })
  cached = { token: t.access_token!, exp: Date.now() + 50 * 60_000 }
  return cached.token
}

export async function yt<T = any>(path: string, init: RequestInit & { token?: string; base?: string } = {}) {
  const token = init.token ?? (await accessToken())
  const res = await fetch(`${init.base ?? 'https://www.googleapis.com/youtube/v3'}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', ...(init.headers ?? {}) },
  })
  if (!res.ok) throw new Error(`YouTube API ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return (await res.json()) as T
}

export async function fetchMyChannel(token?: string) {
  const r = await yt<{ items?: any[] }>('/channels?part=snippet,statistics&mine=true', { token })
  const ch = r.items?.[0]
  if (!ch) throw new Error('This Google account has no YouTube channel')
  return {
    id: ch.id as string,
    handle: (ch.snippet.customUrl as string | undefined) ?? ch.snippet.title,
    name: ch.snippet.title as string,
    avatarUrl: ch.snippet.thumbnails?.default?.url as string | undefined,
    subscribers: Number(ch.statistics.subscriberCount ?? 0),
    totalViews: Number(ch.statistics.viewCount ?? 0),
    videos: Number(ch.statistics.videoCount ?? 0),
  }
}

export async function saveChannel(info: Awaited<ReturnType<typeof fetchMyChannel>>, refreshToken: string) {
  await db.delete(channels)
  cached = null
  await db.insert(channels).values({ ...info, refreshToken: encrypt(refreshToken), statsAt: new Date() })
}

export async function updateChannel(patch: Partial<typeof channels.$inferInsert>) {
  const c = await getChannel()
  if (c) await db.update(channels).set(patch).where(eq(channels.id, c.id))
}

export interface UploadMeta {
  title: string
  description: string
  tags: string[]
  aiDisclosure: boolean
  publishAt?: Date // schedule natively on YouTube; omit to publish now
}

function uploadBody(m: UploadMeta) {
  const future = m.publishAt && m.publishAt.getTime() > Date.now() + 60_000
  return {
    snippet: {
      title: m.title.slice(0, 100),
      description: m.description.slice(0, 4900),
      tags: m.tags.slice(0, 15),
      categoryId: '25', // News & Politics
    },
    status: {
      privacyStatus: future ? 'private' : 'public',
      ...(future ? { publishAt: m.publishAt!.toISOString() } : {}),
      selfDeclaredMadeForKids: false,
      containsSyntheticMedia: m.aiDisclosure,
    },
  }
}

// Starts a resumable upload session; returns the URL to PUT the bytes to.
export async function startUpload(m: UploadMeta, size: number, mime: string, origin?: string) {
  const token = await accessToken()
  const res = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json; charset=UTF-8',
        'x-upload-content-length': String(size),
        'x-upload-content-type': mime,
        ...(origin ? { origin } : {}),
      },
      body: JSON.stringify(uploadBody(m)),
    },
  )
  const url = res.headers.get('location')
  if (!res.ok || !url) throw new Error(`YouTube upload init ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return url
}

export async function uploadVideo(m: UploadMeta, bytes: Uint8Array) {
  const url = await startUpload(m, bytes.byteLength, 'video/mp4')
  const res = await fetch(url, { method: 'PUT', headers: { 'content-type': 'video/mp4' }, body: bytes })
  if (!res.ok) throw new Error(`YouTube upload ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return ((await res.json()) as { id: string }).id
}

export async function setThumbnail(videoId: string, png: Uint8Array) {
  const token = await accessToken()
  await fetch(`https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'image/png' },
    body: png,
  }).catch(() => undefined) // custom thumbnails need a verified channel; ignore if refused
}
