import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Clapperboard, FilePlay, Flame, Sparkles, Upload } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/studio-ui'
import {
  img,
  movieGenres,
  trends,
  voices,
  type AspectRatio,
  type VideoSource,
} from '../../lib/fixtures'
import { useStudio } from '../../lib/studio-store'

type Mode = VideoSource

export const Route = createFileRoute('/studio/create')({
  validateSearch: (s: Record<string, unknown>): { mode?: Mode; trend?: string } => ({
    mode: s.mode === 'movie' || s.mode === 'upload' || s.mode === 'trend' ? s.mode : undefined,
    trend: typeof s.trend === 'string' ? s.trend : undefined,
  }),
  component: Create,
})

const modes = [
  { key: 'trend', label: 'From a trend', icon: Flame },
  { key: 'movie', label: 'AI movie', icon: Clapperboard },
  { key: 'upload', label: 'Upload footage', icon: Upload },
] as const

function Create() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const { createVideo } = useStudio()
  const mode: Mode = search.mode ?? 'trend'

  const [trendId, setTrendId] = useState(search.trend ?? trends[0].id)
  const trend = trends.find((t) => t.id === trendId) ?? trends[0]
  const [aspect, setAspect] = useState<AspectRatio>('9:16')
  const [length, setLength] = useState(60)
  const [voice, setVoice] = useState(voices[2])
  const [angle, setAngle] = useState('')

  const [logline, setLogline] = useState('')
  const [genre, setGenre] = useState<string>(movieGenres[0])
  const [parts, setParts] = useState(3)

  const [file, setFile] = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [error, setError] = useState('')

  const title = useMemo(() => {
    if (mode === 'trend') return trend.headline.split(/[:—]/)[0].trim() + ', explained'
    if (mode === 'movie')
      return logline ? `${logline.split(' ').slice(0, 4).join(' ').toUpperCase()} — an AI ${genre.toLowerCase()} (Part 1)` : ''
    return uploadTitle || file?.name.replace(/\.[^.]+$/, '') || ''
  }, [mode, trend, logline, genre, uploadTitle, file])

  const outline =
    mode === 'trend'
      ? [
          `Hook (0–3s): “${trend.headline.slice(0, 60)}…” over bold kinetic type`,
          `Context: what happened, sourced from ${trend.source}`,
          `Angle: ${angle || trend.angle}`,
          'Why it matters to you, in one line',
          'Call to action: subscribe for the next update',
        ]
      : mode === 'movie'
        ? [
            'Cold open — establish world & protagonist',
            'Inciting incident',
            'Rising stakes montage with score swell',
            `Cliffhanger → sets up Part 2 of ${parts}`,
          ]
        : [
            'Auto-trim silences & dead air',
            'Burned-in captions',
            'AI title, description, tags & chapters',
            'Thumbnail from the strongest frame',
          ]

  function submit() {
    setError('')
    if (mode === 'movie' && logline.trim().length < 12)
      return setError('Give the film a one-line idea of at least a few words.')
    if (mode === 'upload' && !file) return setError('Choose a video file to upload.')
    createVideo({
      title,
      description: mode === 'trend' ? trend.angle : mode === 'movie' ? logline : 'Uploaded footage',
      source: mode,
      aspect,
      durationSec: mode === 'movie' ? length * 4 : length,
      thumb: mode === 'trend' ? trend.thumb : mode === 'movie' ? 'thumb-space.png' : 'thumb-ocean.png',
      trendId: mode === 'trend' ? trend.id : undefined,
    })
    navigate({ to: '/studio/library' })
  }

  return (
    <>
      <PageHeader eyebrow="AI studio" title="Make something worth watching" />

      <div className="rise mb-6 inline-flex rounded-full border border-line p-1" role="tablist">
        {modes.map((m) => (
          <button
            key={m.key}
            role="tab"
            aria-selected={mode === m.key}
            onClick={() => {
              setError('')
              navigate({ to: '/studio/create', search: { mode: m.key }, replace: true })
            }}
            className={`btn px-4 py-2 ${mode === m.key ? 'bg-signal text-ink' : 'text-muted hover:text-bone'}`}
          >
            <m.icon className="size-4" /> {m.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <form
          className="rise panel space-y-6 p-6"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          {mode === 'trend' && (
            <>
              <div>
                <span className="label">Pick a trend</span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {trends.slice(0, 6).map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setTrendId(t.id)}
                      className={`flex items-center gap-3 rounded-xl border p-2 text-left text-sm transition-colors ${t.id === trendId ? 'border-signal bg-signal/10' : 'border-line hover:border-line-2'}`}
                    >
                      <img src={img(t.thumb, 120)} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
                      <span className="line-clamp-2">{t.headline}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label" htmlFor="angle">Your angle (optional)</label>
                <input
                  id="angle"
                  className="field"
                  placeholder={trend.angle}
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                />
              </div>
            </>
          )}

          {mode === 'movie' && (
            <>
              <div>
                <label className="label" htmlFor="logline">One-line idea</label>
                <textarea
                  id="logline"
                  rows={3}
                  className="field resize-none"
                  placeholder="A cargo pilot has 12 minutes to outrun a collapsing planetary ring…"
                  value={logline}
                  onChange={(e) => setLogline(e.target.value)}
                />
              </div>
              <div>
                <span className="label">Genre</span>
                <div className="flex flex-wrap gap-2">
                  {movieGenres.map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGenre(g)}
                      className={`btn px-3 py-1.5 ${genre === g ? 'bg-amber text-ink' : 'border border-line text-muted hover:text-bone'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label" htmlFor="parts">Series length · {parts} parts</label>
                <input
                  id="parts"
                  type="range"
                  min={1}
                  max={8}
                  value={parts}
                  onChange={(e) => setParts(Number(e.target.value))}
                  className="w-full accent-signal"
                />
              </div>
            </>
          )}

          {mode === 'upload' && (
            <>
              <label
                htmlFor="file"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const f = e.dataTransfer.files[0]
                  if (f?.type.startsWith('video/')) setFile(f)
                }}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line-2 px-6 py-12 text-center transition-colors hover:border-signal"
              >
                <FilePlay className="size-10 text-signal" />
                <p className="mt-4 font-display text-lg font-semibold">
                  {file ? file.name : 'Drop a video, or click to browse'}
                </p>
                <p className="mt-1 text-sm text-dim">
                  {file ? `${(file.size / 1_048_576).toFixed(1)} MB` : 'MP4, MOV or WebM'}
                </p>
                <input
                  id="file"
                  type="file"
                  accept="video/*"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <div>
                <label className="label" htmlFor="utitle">Title (AI writes one if blank)</label>
                <input
                  id="utitle"
                  className="field"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <span className="label">Format</span>
              <div className="flex gap-2">
                {(['9:16', '16:9'] as const).map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setAspect(a)}
                    className={`btn flex-1 px-2 ${aspect === a ? 'bg-bone text-ink' : 'border border-line text-muted'}`}
                  >
                    {a === '9:16' ? 'Short' : 'Long'}
                  </button>
                ))}
              </div>
            </div>
            {mode !== 'upload' && (
              <>
                <div>
                  <label className="label" htmlFor="len">Length</label>
                  <select id="len" className="field" value={length} onChange={(e) => setLength(Number(e.target.value))}>
                    {[30, 45, 60, 180, 480].map((s) => (
                      <option key={s} value={s}>
                        {s < 60 ? `${s}s` : `${s / 60} min`}
                        {mode === 'movie' ? ' / part' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="voice">Voice</label>
                  <select id="voice" className="field" value={voice} onChange={(e) => setVoice(e.target.value)}>
                    {voices.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-signal/40 bg-signal/10 px-4 py-2.5 text-sm text-signal">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full py-3 text-base">
            <Sparkles className="size-4" />
            {mode === 'upload' ? 'Add to library' : 'Generate video'}
          </button>
        </form>

        {/* Preview */}
        <aside className="rise space-y-4" style={{ animationDelay: '100ms' }}>
          <div className="panel overflow-hidden">
            <div className={`relative mx-auto bg-ink-3 ${aspect === '9:16' ? 'aspect-[9/16] max-h-[440px]' : 'aspect-video'}`}>
              <img
                src={img(mode === 'trend' ? trend.thumb : mode === 'movie' ? 'thumb-space.png' : 'thumb-ocean.png', 800)}
                alt=""
                className="h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink p-5">
                <p className="font-display text-xl font-bold leading-tight">
                  {title || 'Your title appears here'}
                </p>
              </div>
            </div>
          </div>
          <div className="panel p-5">
            <p className="label">AI plan</p>
            <ol className="mt-2 space-y-2.5">
              {outline.map((o, i) => (
                <li key={o} className="flex gap-3 text-sm">
                  <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-bone/90">{o}</span>
                </li>
              ))}
            </ol>
            {mode !== 'upload' && (
              <p className="mt-4 border-t border-line pt-3 text-xs text-dim">
                Will be marked as AI-generated content on YouTube, as YouTube
                requires for realistic synthetic media.
              </p>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}
