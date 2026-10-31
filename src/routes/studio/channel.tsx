import { createFileRoute } from '@tanstack/react-router'
import { Bot, Check, Minus, Plus, ShieldCheck, Unplug, X } from 'lucide-react'
import { useState } from 'react'
import { Youtube } from '../../components/Logo'
import { PageHeader, Toggle } from '../../components/studio-ui'
import type { AutopilotSettings, Trend } from '../../lib/fixtures'
import { compact, dateTime } from '../../lib/format'
import { useStudio } from '../../lib/studio-store'

export const Route = createFileRoute('/studio/channel')({ component: ChannelPage })

const allCategories: Trend['category'][] = ['Politics', 'World', 'Tech', 'Science', 'Sports', 'Culture']
const allSlots = ['06:00', '09:00', '12:00', '15:00', '17:00', '19:00', '21:00', '23:00']

const scopes = [
  'Upload videos and set thumbnails',
  'Manage titles, descriptions and playlists',
  'Read channel analytics and revenue reports',
  'Read and reply to comments',
]

function ChannelPage() {
  const { channel, autopilot, setAutopilot, setConnected, videos, toast } = useStudio()
  const [consent, setConsent] = useState(false)
  const upcoming = videos
    .filter((v) => v.status === 'scheduled' && v.scheduledFor)
    .sort((a, b) => a.scheduledFor!.localeCompare(b.scheduledFor!))

  const set = (patch: Partial<AutopilotSettings>) => setAutopilot(patch)
  const toggleSlot = (s: string) => {
    const slots = autopilot.slots.includes(s)
      ? autopilot.slots.filter((x) => x !== s)
      : [...autopilot.slots, s].sort()
    if (slots.length) set({ slots, uploadsPerDay: slots.length })
  }

  return (
    <>
      <PageHeader eyebrow="Channel & autopilot" title="Hand the channel to the AI" />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          {/* Connection */}
          <section className="rise panel relative overflow-hidden p-6">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-signal/15 blur-3xl" />
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-signal to-amber font-display text-xl font-bold text-ink">
                {channel.avatarInitials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl font-bold">{channel.name}</p>
                <p className="font-mono text-xs text-muted">{channel.handle}</p>
              </div>
              <span className={`chip ${channel.connected ? 'border-live/40 text-live' : ''}`}>
                <Youtube className="size-3" /> {channel.connected ? 'Linked' : 'Not linked'}
              </span>
            </div>
            {channel.connected ? (
              <>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    ['Subscribers', compact(channel.subscribers)],
                    ['Views', compact(channel.totalViews)],
                    ['Videos', String(channel.videos)],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-ink p-3">
                      <p className="font-display text-2xl font-bold">{v}</p>
                      <p className="text-xs text-dim">{k}</p>
                    </div>
                  ))}
                </div>
                <button className="btn-quiet -ml-3 mt-4" onClick={() => setConnected(false)}>
                  <Unplug className="size-4" /> Disconnect channel
                </button>
              </>
            ) : (
              <button className="btn-primary mt-6 w-full py-3" onClick={() => setConsent(true)}>
                <Youtube className="size-5" /> Connect YouTube channel
              </button>
            )}
          </section>

          {/* Upcoming */}
          <section className="rise panel p-6" style={{ animationDelay: '80ms' }}>
            <h2 className="font-display text-lg font-semibold">Upload schedule</h2>
            {upcoming.length ? (
              <ul className="mt-4 space-y-3">
                {upcoming.map((v) => (
                  <li key={v.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
                    <span className="w-28 shrink-0 font-mono text-xs text-amber">
                      {dateTime(v.scheduledFor!)}
                    </span>
                    <span className="line-clamp-1 text-sm">{v.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">Nothing queued yet.</p>
            )}
          </section>

          {/* Guardrails */}
          <section className="rise panel p-6" style={{ animationDelay: '140ms' }}>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <ShieldCheck className="size-5 text-live" /> Monetization guardrails
            </h2>
            <p className="mt-1 text-sm text-muted">
              YouTube won’t pay channels that post copied or mass-produced
              content. These settings keep you eligible.
            </p>
            <div className="mt-5 space-y-4">
              <Row
                title="Original commentary only"
                body="Each video adds its own script and analysis. It never re-uploads someone else’s footage."
                on={autopilot.originalCommentaryOnly}
                onChange={(v) => set({ originalCommentaryOnly: v })}
              />
              <Row
                title="Label AI-generated content"
                body="Turns on YouTube’s altered or synthetic content label."
                on={autopilot.addAiDisclosure}
                onChange={(v) => set({ addAiDisclosure: v })}
              />
            </div>
          </section>
        </div>

        {/* Autopilot */}
        <section
          className={`rise panel p-6 ${autopilot.enabled ? 'border-live/40' : ''}`}
          style={{ animationDelay: '60ms' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
                <Bot className={`size-6 ${autopilot.enabled ? 'text-live' : 'text-muted'}`} />
                Autopilot
              </h2>
              <p className="mt-1 text-sm text-muted">
                Every day the AI picks trends, makes videos, publishes them in
                your slots, replies to comments and adjusts based on how they do.
              </p>
            </div>
            <Toggle
              on={autopilot.enabled}
              disabled={!channel.connected}
              label="Autopilot"
              onChange={(on) => {
                set({ enabled: on })
                toast(on ? 'Autopilot is running' : 'Autopilot paused')
              }}
            />
          </div>
          {!channel.connected && (
            <p className="mt-4 rounded-xl border border-amber/40 bg-amber/10 px-4 py-2.5 text-sm text-amber">
              Connect a channel to turn on autopilot.
            </p>
          )}

          <div className="mt-8">
            <span className="label">Uploads per day</span>
            <div className="flex items-center gap-4">
              <button
                className="btn-ghost size-10 p-0"
                aria-label="Fewer"
                onClick={() => toggleSlot(autopilot.slots.at(-1)!)}
                disabled={autopilot.slots.length <= 1}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-display text-4xl font-bold tabular-nums">
                {autopilot.uploadsPerDay}
              </span>
              <button
                className="btn-ghost size-10 p-0"
                aria-label="More"
                onClick={() => {
                  const free = allSlots.find((s) => !autopilot.slots.includes(s))
                  if (free) toggleSlot(free)
                }}
                disabled={autopilot.slots.length >= allSlots.length}
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <span className="label">Publish slots · Eastern Time</span>
            <div className="grid grid-cols-4 gap-2">
              {allSlots.map((s) => {
                const on = autopilot.slots.includes(s)
                return (
                  <button
                    key={s}
                    aria-pressed={on}
                    onClick={() => toggleSlot(s)}
                    className={`rounded-xl border py-2.5 font-mono text-sm transition-colors ${on ? 'border-signal bg-signal/10 text-bone' : 'border-line text-dim hover:text-bone'}`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6">
            <span className="label">Formats</span>
            <div className="grid gap-2 sm:grid-cols-3">
              {(
                [
                  ['shorts', 'Shorts', 'Vertical, under 60s'],
                  ['longForm', 'Long-form', 'Explainers, 4 to 10 min'],
                  ['movies', 'AI movies', 'Serialized short films'],
                ] as const
              ).map(([key, t, d]) => {
                const on = autopilot.formats[key]
                return (
                  <button
                    key={key}
                    aria-pressed={on}
                    onClick={() => set({ formats: { ...autopilot.formats, [key]: !on } })}
                    className={`rounded-xl border p-3 text-left transition-colors ${on ? 'border-signal bg-signal/10' : 'border-line hover:border-line-2'}`}
                  >
                    <span className="flex items-center justify-between text-sm font-semibold">
                      {t} {on ? <Check className="size-4 text-signal" /> : <X className="size-4 text-dim" />}
                    </span>
                    <span className="mt-1 block text-xs text-dim">{d}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6">
            <span className="label">Topics to cover</span>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((c) => {
                const on = autopilot.categories.includes(c)
                return (
                  <button
                    key={c}
                    aria-pressed={on}
                    onClick={() =>
                      set({
                        categories: on
                          ? autopilot.categories.filter((x) => x !== c)
                          : [...autopilot.categories, c],
                      })
                    }
                    className={`btn px-3.5 py-1.5 ${on ? 'bg-bone text-ink' : 'border border-line text-muted hover:text-bone'}`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <Row
              title="Ask me before publishing"
              body="New videos wait as Ready until you approve them. Turn this off to let the AI publish on its own."
              on={autopilot.requireApproval}
              onChange={(v) => set({ requireApproval: v })}
            />
          </div>
        </section>
      </div>

      {consent && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
        >
          <div className="rise panel w-full max-w-md p-6">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              <Youtube className="size-4 text-signal" /> Google sign-in
            </p>
            <h2 id="consent-title" className="mt-3 font-display text-2xl font-bold">
              TrendReel wants access to your YouTube channel
            </h2>
            <ul className="mt-5 space-y-2.5">
              {scopes.map((s) => (
                <li key={s} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-live" /> {s}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-dim">
              You can revoke access at any time from your Google account.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button className="btn-quiet" onClick={() => setConsent(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setConnected(true)
                  setConsent(false)
                }}
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Row({
  title,
  body,
  on,
  onChange,
}: {
  title: string
  body: string
  on: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted">{body}</p>
      </div>
      <Toggle on={on} onChange={onChange} label={title} />
    </div>
  )
}
