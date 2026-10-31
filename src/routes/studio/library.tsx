import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { CalendarClock, Eye, Plus, RotateCw, Send, Trash, Undo2 } from 'lucide-react'
import { Empty, PageHeader, StatusBadge, Thumb, sourceLabel } from '../../components/studio-ui'
import type { Video, VideoStatus } from '../../lib/fixtures'
import { compact, dateTime } from '../../lib/format'
import { useStudio } from '../../lib/studio-store'

const filters = ['all', 'generating', 'ready', 'scheduled', 'published', 'failed'] as const
type Filter = (typeof filters)[number]

export const Route = createFileRoute('/studio/library')({
  validateSearch: (s: Record<string, unknown>): { status?: Filter } => ({
    status: filters.includes(s.status as Filter) ? (s.status as Filter) : undefined,
  }),
  component: LibraryPage,
})

function LibraryPage() {
  const { status = 'all' } = Route.useSearch()
  const navigate = useNavigate()
  const { videos, autopilot, approve, publishNow, unschedule, retry, remove, channel } =
    useStudio()
  const list = videos.filter((v) => status === 'all' || v.status === status)
  const taken = videos.flatMap((v) => (v.scheduledFor ? [v.scheduledFor] : []))
  const countOf = (f: Filter) =>
    f === 'all' ? videos.length : videos.filter((v) => v.status === f).length

  return (
    <>
      <PageHeader eyebrow="Video library" title="Everything you’ve made">
        <Link to="/studio/create" className="btn-primary">
          <Plus className="size-4" /> New video
        </Link>
      </PageHeader>

      <div className="rise mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Status">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={status === f}
            onClick={() =>
              navigate({ to: '/studio/library', search: f === 'all' ? {} : { status: f }, replace: true })
            }
            className={`btn px-3.5 py-1.5 capitalize ${status === f ? 'bg-bone text-ink' : 'border border-line text-muted hover:text-bone'}`}
          >
            {f}
            <span className="font-mono text-[11px] opacity-60">{countOf(f)}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Empty title={`No ${status === 'all' ? '' : status + ' '}videos`}>
          <Link to="/studio/create" className="btn-ghost mt-4">
            Create one
          </Link>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {list.map((v, i) => (
            <article
              key={v.id}
              className="rise panel flex flex-col overflow-hidden"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <Thumb video={v} className="aspect-video rounded-none" width={640} />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={v.status} />
                  <span className="font-mono text-[11px] text-dim">{sourceLabel[v.source]}</span>
                </div>
                <h2 className="mt-3 line-clamp-2 font-display text-lg font-semibold leading-snug">
                  {v.title}
                </h2>
                <Detail status={v.status} video={v} />
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {v.status === 'ready' && (
                    <>
                      <button className="btn-primary" onClick={() => approve(v, autopilot.slots, taken)}>
                        <CalendarClock className="size-4" /> Approve & schedule
                      </button>
                      <button className="btn-ghost" disabled={!channel.connected} onClick={() => publishNow(v)}>
                        <Send className="size-4" /> Publish now
                      </button>
                    </>
                  )}
                  {v.status === 'scheduled' && (
                    <>
                      <button className="btn-ghost" disabled={!channel.connected} onClick={() => publishNow(v)}>
                        <Send className="size-4" /> Publish now
                      </button>
                      <button className="btn-quiet" onClick={() => unschedule(v)}>
                        <Undo2 className="size-4" /> Unschedule
                      </button>
                    </>
                  )}
                  {v.status === 'failed' && (
                    <button className="btn-primary" onClick={() => retry(v)}>
                      <RotateCw className="size-4" /> Retry render
                    </button>
                  )}
                  {v.status !== 'published' && v.status !== 'generating' && (
                    <button className="btn-quiet ml-auto" onClick={() => remove(v)} aria-label={`Delete ${v.title}`}>
                      <Trash className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}

function Detail({ status, video }: { status: VideoStatus; video: Video }) {
  const cls = 'mt-2 font-mono text-xs'
  if (status === 'generating')
    return <p className={`${cls} text-amber`}>Rendering scenes · {video.progress}%</p>
  if (status === 'failed') return <p className={`${cls} text-signal`}>{video.error ?? 'Render failed.'}</p>
  if (status === 'scheduled' && video.scheduledFor)
    return <p className={`${cls} text-bone`}>Goes live {dateTime(video.scheduledFor)} ET</p>
  if (status === 'published')
    return (
      <p className={`${cls} flex items-center gap-1.5 text-live`}>
        <Eye className="size-3.5" /> {compact(video.views ?? 0)} views · published{' '}
        {dateTime(video.publishedAt!)}
      </p>
    )
  return <p className={`${cls} text-sky`}>Ready for your review · created {dateTime(video.createdAt)}</p>
}
