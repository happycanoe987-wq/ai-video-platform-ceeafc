import type { ReactNode } from 'react'
import {
  CalendarClock,
  CircleAlert,
  CircleCheck,
  Loader,
  Send,
} from 'lucide-react'
import { img, type Video, type VideoStatus } from '../lib/fixtures'
import { duration } from '../lib/format'

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="rise mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </header>
  )
}

const statusMeta: Record<
  VideoStatus,
  { label: string; className: string; icon: typeof Loader }
> = {
  generating: { label: 'Generating', className: 'text-amber border-amber/40', icon: Loader },
  ready: { label: 'Ready', className: 'text-sky border-sky/40', icon: CircleCheck },
  scheduled: { label: 'Scheduled', className: 'text-bone border-line-2', icon: CalendarClock },
  published: { label: 'Published', className: 'text-live border-live/40', icon: Send },
  failed: { label: 'Failed', className: 'text-signal border-signal/50', icon: CircleAlert },
}

export function StatusBadge({ status }: { status: VideoStatus }) {
  const m = statusMeta[status]
  return (
    <span className={`chip ${m.className}`}>
      <m.icon className={`size-3 ${status === 'generating' ? 'animate-spin' : ''}`} />
      {m.label}
    </span>
  )
}

export const sourceLabel = {
  trend: 'Trend remix',
  movie: 'AI movie',
  upload: 'Upload',
} as const

export function Thumb({
  video,
  className = '',
  width = 480,
}: {
  video: Video
  className?: string
  width?: number
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-ink-3 ${className}`}>
      <img
        src={img(video.thumb, width)}
        alt=""
        loading="lazy"
        className={`h-full w-full object-cover ${video.status === 'generating' ? 'opacity-40 blur-[2px]' : ''} ${video.status === 'failed' ? 'opacity-40 grayscale' : ''}`}
      />
      <span className="absolute bottom-1.5 right-1.5 rounded bg-ink/80 px-1.5 py-0.5 font-mono text-[10px]">
        {video.aspect} · {duration(video.durationSec)}
      </span>
      {video.status === 'generating' && (
        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2">
          <div className="h-1 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-amber transition-[width] duration-700"
              style={{ width: `${video.progress ?? 0}%` }}
            />
          </div>
          <p className="mt-1.5 text-center font-mono text-[10px] text-amber">
            {video.progress ?? 0}%
          </p>
        </div>
      )}
    </div>
  )
}

export function Stat({
  label,
  value,
  hint,
  accent = 'text-bone',
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  accent?: string
}) {
  return (
    <div className="panel p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className={`mt-3 font-display text-3xl font-bold tabular-nums ${accent}`}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-dim">{hint}</p>}
    </div>
  )
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-2 p-10 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
    </div>
  )
}

export function Toggle({
  on,
  onChange,
  label,
  disabled,
}: {
  on: boolean
  onChange: (on: boolean) => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:opacity-40 ${on ? 'bg-live' : 'bg-line-2'}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-ink transition-transform ${on ? 'translate-x-5' : ''}`}
      />
    </button>
  )
}
