import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Flame, RotateCw, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../../components/studio-ui'
import { img, trends, type Trend } from '../../lib/fixtures'
import { useStudio } from '../../lib/studio-store'

export const Route = createFileRoute('/studio/trends')({ component: Trends })

const categories = ['All', 'Politics', 'World', 'Tech', 'Science', 'Sports', 'Culture'] as const

function Trends() {
  const { toast } = useStudio()
  const [cat, setCat] = useState<(typeof categories)[number]>('All')
  const list = trends.filter((t) => cat === 'All' || t.category === cat)
  const [lead, ...rest] = list

  return (
    <>
      <PageHeader
        eyebrow="Trending feed · AP · Reuters · BBC · Google Trends · YouTube"
        title="What the world is watching"
      >
        <button className="btn-ghost" onClick={() => toast('Feeds refreshed · 7 stories ranked')}>
          <RotateCw className="size-4" /> Refresh
        </button>
      </PageHeader>

      <div className="rise mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Category">
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`btn px-3.5 py-1.5 ${cat === c ? 'bg-bone text-ink' : 'border border-line text-muted hover:text-bone'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {!lead ? (
        <p className="text-muted">No trends in this category right now.</p>
      ) : (
        <>
          <Lead trend={lead} />
          <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {rest.map((t, i) => (
              <TrendCard key={t.id} trend={t} delay={i * 50} />
            ))}
          </div>
        </>
      )}
    </>
  )
}

function Lead({ trend }: { trend: Trend }) {
  return (
    <article className="rise panel relative grid overflow-hidden lg:grid-cols-[1.2fr_1fr]">
      <div className="relative min-h-64">
        <img
          src={img(trend.thumb, 1100)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-ink-2" />
        <span className="absolute left-5 top-5 chip border-signal bg-ink/70 text-signal">
          <Flame className="size-3" /> #1 right now
        </span>
      </div>
      <div className="relative p-7">
        <Meta trend={trend} />
        <h2 className="mt-4 font-display text-3xl font-bold leading-tight">{trend.headline}</h2>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          AI suggested angle
        </p>
        <p className="mt-1 text-bone/90">{trend.angle}</p>
        <Heat trend={trend} />
        <Link to="/studio/create" search={{ trend: trend.id }} className="btn-primary mt-6">
          Make this video <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  )
}

function TrendCard({ trend, delay }: { trend: Trend; delay: number }) {
  return (
    <article
      className="rise panel group flex flex-col overflow-hidden transition-colors hover:border-line-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[16/8] overflow-hidden">
        <img
          src={img(trend.thumb, 640)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-md bg-ink/80 px-2 py-0.5 font-mono text-xs text-signal">
          #{trend.rank}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Meta trend={trend} />
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{trend.headline}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{trend.angle}</p>
        <Heat trend={trend} />
        <Link
          to="/studio/create"
          search={{ trend: trend.id }}
          className="btn-ghost mt-5 self-start"
        >
          Make video <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  )
}

function Meta({ trend }: { trend: Trend }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="chip">{trend.category}</span>
      <span className="font-mono text-[11px] text-dim">
        {trend.source} · {trend.region} · {trend.searches} searches
      </span>
    </div>
  )
}

function Heat({ trend }: { trend: Trend }) {
  return (
    <div className="mt-auto pt-5">
      <div className="flex items-center justify-between font-mono text-[11px]">
        <span className="text-muted">Heat {trend.heat}</span>
        <span className="flex items-center gap-1 text-live">
          <TrendingUp className="size-3" /> +{trend.velocity}% / 4h
        </span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber to-signal"
          style={{ width: `${trend.heat}%` }}
        />
      </div>
    </div>
  )
}
