import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  Clapperboard,
  Upload,
} from 'lucide-react'
import {
  PageHeader,
  StatusBadge,
  Thumb,
  Toggle,
  sourceLabel,
} from '../../components/studio-ui'
import { activity, earnings, img, trends } from '../../lib/fixtures'
import { compact, dateTime } from '../../lib/format'
import { useStudio } from '../../lib/studio-store'

export const Route = createFileRoute('/studio/')({ component: CommandDeck })

const stages = [
  { key: 'generating', label: 'Generating', hint: 'Script → render' },
  { key: 'ready', label: 'Ready', hint: 'Awaiting approval' },
  { key: 'scheduled', label: 'Scheduled', hint: 'Queued for a slot' },
  { key: 'published', label: 'Published', hint: 'Live on channel' },
] as const

function CommandDeck() {
  const { channel, videos, autopilot, setAutopilot, toast, approve } = useStudio()
  const by = (s: string) => videos.filter((v) => v.status === s)
  const failed = by('failed')
  const scheduled = by('scheduled').sort((a, b) =>
    (a.scheduledFor ?? '').localeCompare(b.scheduledFor ?? ''),
  )
  const next = scheduled[0]
  const ready = by('ready')
  const queue = videos.filter((v) => v.status !== 'published').slice(0, 5)
  const maxViews = Math.max(...earnings.map((e) => e.views))

  return (
    <>
      <PageHeader
        eyebrow={`Command deck · ${channel.handle}`}
        title={
          <>
            Welcome back, <span className="text-signal">Daniel.</span>
          </>
        }
      >
        <Link to="/studio/create" className="btn-primary">
          <Clapperboard className="size-4" /> New AI video
        </Link>
        <Link to="/studio/create" search={{ mode: 'upload' }} className="btn-ghost">
          <Upload className="size-4" /> Upload
        </Link>
      </PageHeader>

      {/* Pipeline */}
      <section className="rise panel overflow-hidden" style={{ animationDelay: '60ms' }}>
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="font-display text-lg font-semibold">Pipeline</h2>
          <span className="font-mono text-xs text-muted">{videos.length} videos total</span>
        </div>
        <div className="grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
          {stages.map((s, i) => (
            <Link
              key={s.key}
              to="/studio/library"
              search={{ status: s.key }}
              className="group relative p-5 transition-colors hover:bg-white/[0.03]"
            >
              <span className="font-mono text-xs text-dim">0{i + 1}</span>
              <p className="mt-6 font-display text-5xl font-bold tabular-nums">
                {by(s.key).length}
              </p>
              <p className="mt-2 text-sm font-medium">{s.label}</p>
              <p className="text-xs text-dim">{s.hint}</p>
              <ArrowUpRight className="absolute right-4 top-4 size-4 text-dim opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
        {failed.length > 0 && (
          <Link
            to="/studio/library"
            search={{ status: 'failed' }}
            className="flex items-center gap-2 border-t border-signal/30 bg-signal/10 px-5 py-3 text-sm text-signal"
          >
            <CircleAlert className="size-4" />
            {failed.length} generation{failed.length > 1 ? 's' : ''} failed. Open
            the library to retry.
            <ArrowRight className="ml-auto size-4" />
          </Link>
        )}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* Next upload + autopilot */}
          <section className="rise grid gap-6 md:grid-cols-2" style={{ animationDelay: '120ms' }}>
            <div className="panel relative overflow-hidden p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Next upload
              </p>
              {next ? (
                <div className="mt-4 flex gap-4">
                  <Thumb video={next} className="aspect-video w-32 shrink-0" width={260} />
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-medium">{next.title}</p>
                    <p className="mt-1 font-mono text-xs text-amber">
                      {dateTime(next.scheduledFor!)} ET
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">
                  Nothing scheduled. Approve a ready video or turn on autopilot.
                </p>
              )}
              {ready[0] && (
                <button
                  className="btn-ghost mt-4 w-full"
                  onClick={() =>
                    approve(
                      ready[0],
                      autopilot.slots,
                      scheduled.map((v) => v.scheduledFor!),
                    )
                  }
                >
                  Approve “{ready[0].title.slice(0, 28)}…”
                </button>
              )}
            </div>

            <div
              className={`panel relative overflow-hidden p-5 ${autopilot.enabled ? 'border-live/40' : ''}`}
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  Autopilot
                </p>
                <Toggle
                  on={autopilot.enabled}
                  disabled={!channel.connected}
                  onChange={(on) => {
                    setAutopilot({ enabled: on })
                    toast(on ? 'Autopilot is running' : 'Autopilot paused')
                  }}
                  label="Autopilot"
                />
              </div>
              <p
                className={`mt-4 font-display text-3xl font-bold ${autopilot.enabled ? 'text-live' : 'text-dim'}`}
              >
                {autopilot.enabled ? 'Running' : 'Paused'}
              </p>
              <p className="mt-1 text-sm text-muted">
                {autopilot.uploadsPerDay} uploads/day at {autopilot.slots.join(', ')} ·{' '}
                {autopilot.requireApproval ? 'you approve each one' : 'fully hands-off'}
              </p>
              <Link to="/studio/channel" className="btn-quiet -ml-3 mt-3">
                Configure <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </section>

          {/* Active queue */}
          <section className="rise panel" style={{ animationDelay: '180ms' }}>
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <h2 className="font-display text-lg font-semibold">Active queue</h2>
              <Link to="/studio/library" className="btn-quiet">
                Open library <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <ul className="divide-y divide-line">
              {queue.map((v) => (
                <li key={v.id} className="flex items-center gap-4 px-5 py-3">
                  <Thumb video={v} className="aspect-video w-28 shrink-0" width={240} />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-medium">{v.title}</p>
                    <p className="mt-1 font-mono text-[11px] text-dim">
                      {sourceLabel[v.source]} · {dateTime(v.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={v.status} />
                </li>
              ))}
            </ul>
          </section>

          {/* Growth mini chart */}
          <section className="rise panel p-5" style={{ animationDelay: '240ms' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Monthly views</h2>
              <Link to="/studio/earnings" className="btn-quiet">
                Earnings <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-6 flex h-36 items-end gap-3" role="img" aria-label="Monthly views, May to October">
              {earnings.map((e, i) => (
                <div key={e.label} className="flex flex-1 flex-col items-center gap-2">
                  <span className="font-mono text-[10px] text-muted">{compact(e.views)}</span>
                  <div
                    className={`w-full rounded-t-md ${i === earnings.length - 1 ? 'bg-signal' : 'bg-line-2'}`}
                    style={{ height: `${(e.views / maxViews) * 100}%` }}
                  />
                  <span className="font-mono text-[10px] text-dim">{e.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Hot right now */}
          <section className="rise panel" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <h2 className="font-display text-lg font-semibold">Hot right now</h2>
              <Link to="/studio/trends" className="btn-quiet">
                All trends <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <ol>
              {trends.slice(0, 6).map((t) => (
                <li key={t.id}>
                  <Link
                    to="/studio/create"
                    search={{ trend: t.id }}
                    className="group flex items-start gap-4 px-5 py-3 transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="mt-0.5 font-mono text-sm text-signal">
                      {String(t.rank).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-sm leading-snug">{t.headline}</span>
                    <img
                      src={img(t.thumb, 120)}
                      alt=""
                      loading="lazy"
                      className="h-9 w-14 rounded object-cover opacity-70 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          {/* Activity */}
          <section className="rise panel p-5" style={{ animationDelay: '210ms' }}>
            <h2 className="font-display text-lg font-semibold">AI activity log</h2>
            <ul className="mt-4 space-y-4 border-l border-line pl-4">
              {activity.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-line-2 ring-4 ring-ink-2" />
                  <p className="text-sm">{a.text}</p>
                  <p className="font-mono text-[11px] text-dim">{dateTime(a.at)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
