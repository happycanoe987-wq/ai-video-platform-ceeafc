import { createFileRoute } from '@tanstack/react-router'
import { Info } from 'lucide-react'
import { useState } from 'react'
import { PageHeader, Stat } from '../../components/studio-ui'
import { YPP, earnings, estimatedRpm, img } from '../../lib/fixtures'
import { compact, count, usd } from '../../lib/format'
import { useStudio } from '../../lib/studio-store'

export const Route = createFileRoute('/studio/earnings')({ component: Earnings })

// Shorts vs long-form share of views, used for projected income.
const SHORTS_SHARE = 0.82

function projected(views: number) {
  return (
    (views * SHORTS_SHARE * estimatedRpm.shorts +
      views * (1 - SHORTS_SHARE) * estimatedRpm.longForm) /
    1000
  )
}

function Earnings() {
  const { channel, videos } = useStudio()
  const last = earnings.at(-1)!
  const prev = earnings.at(-2)!
  const earned = earnings.reduce((t, m) => t + m.revenue, 0)
  const growth = ((last.views - prev.views) / prev.views) * 100
  const top = videos
    .filter((v) => v.status === 'published')
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))

  return (
    <>
      <PageHeader eyebrow="Earnings" title="Follow the money" />

      <div className="rise grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Paid out to date"
          value={usd(earned)}
          hint={channel.monetized ? 'From YouTube AdSense' : 'Starts after Partner Program approval'}
        />
        <Stat
          label="Projected / month"
          value={usd(projected(last.views), 2)}
          accent="text-amber"
          hint={`At ~$${estimatedRpm.shorts} Shorts / $${estimatedRpm.longForm} long-form RPM`}
        />
        <Stat
          label={`Views · ${last.label}`}
          value={compact(last.views)}
          accent="text-signal"
          hint={`+${growth.toFixed(0)}% vs ${prev.label}`}
        />
        <Stat
          label="Subscribers"
          value={count(channel.subscribers)}
          accent="text-live"
          hint={`${count(YPP.subscribers - channel.subscribers)} to go for monetization`}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rise panel p-6" style={{ animationDelay: '80ms' }}>
          <h2 className="font-display text-lg font-semibold">Monthly views</h2>
          <p className="text-xs text-dim">May to Oct 2026 · hover for projected income</p>
          <AreaChart />
        </section>

        <section className="rise panel p-6" style={{ animationDelay: '140ms' }}>
          <h2 className="font-display text-lg font-semibold">Partner Program progress</h2>
          <p className="text-xs text-dim">You need subscribers plus one of the other two</p>
          <div className="mt-6 space-y-6">
            <Progress label="Subscribers" value={channel.subscribers} goal={YPP.subscribers} />
            <Progress label="Watch hours · 12 months" value={channel.watchHours} goal={YPP.watchHours} />
            <p className="text-center font-mono text-[11px] text-dim">— or —</p>
            <Progress label="Shorts views · 90 days" value={channel.shortsViews90d} goal={YPP.shortsViews90d} />
          </div>
          <p className="mt-6 flex gap-2 rounded-xl bg-ink p-3 text-xs text-muted">
            <Info className="size-4 shrink-0 text-sky" />
            At this month’s pace you’d reach 1,000 subscribers in under
            a month. Projections are estimates, and YouTube doesn’t guarantee
            approval or income.
          </p>
        </section>
      </div>

      <section className="rise panel mt-6" style={{ animationDelay: '200ms' }}>
        <div className="border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-semibold">Top performing uploads</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="font-mono text-[11px] uppercase tracking-wider text-dim">
            <tr>
              <th scope="col" className="px-6 py-3 text-left font-normal">Video</th>
              <th scope="col" className="px-6 py-3 text-right font-normal">Views</th>
              <th scope="col" className="hidden px-6 py-3 text-right font-normal sm:table-cell">Projected</th>
            </tr>
          </thead>
          <tbody>
            {top.map((v) => (
              <tr key={v.id} className="border-t border-line">
                <th scope="row" className="px-6 py-3 text-left font-normal">
                  <span className="flex items-center gap-3">
                    <img src={img(v.thumb, 120)} alt="" className="h-9 w-16 rounded object-cover" loading="lazy" />
                    <span className="line-clamp-1">{v.title}</span>
                  </span>
                </th>
                <td className="px-6 py-3 text-right font-mono tabular-nums">{count(v.views ?? 0)}</td>
                <td className="hidden px-6 py-3 text-right font-mono tabular-nums text-amber sm:table-cell">
                  {usd(projected(v.views ?? 0), 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

function Progress({ label, value, goal }: { label: string; value: number; goal: number }) {
  const pct = Math.min(100, (value / goal) * 100)
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-xs text-muted">
          {compact(value)} / {compact(goal)}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-gradient-to-r from-signal to-amber"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function AreaChart() {
  const [hover, setHover] = useState<number | null>(null)
  const W = 640
  const H = 240
  const pad = { l: 8, r: 8, t: 16, b: 28 }
  const max = Math.max(...earnings.map((e) => e.views)) * 1.1
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (earnings.length - 1)
  const y = (v: number) => H - pad.b - (v / max) * (H - pad.t - pad.b)
  const line = earnings.map((e, i) => `${i ? 'L' : 'M'}${x(i)},${y(e.views)}`).join(' ')
  const area = `${line} L${x(earnings.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`
  const h = hover ?? earnings.length - 1
  const e = earnings[h]

  return (
    <div className="relative mt-4">
      <div className="pointer-events-none absolute left-0 top-0 rounded-xl border border-line-2 bg-ink-3 px-3 py-2 text-xs">
        <p className="font-mono text-dim">{e.label} 2026</p>
        <p className="font-display text-lg font-bold">{count(e.views)} views</p>
        <p className="text-amber">≈ {usd(projected(e.views), 2)} if monetized</p>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-64 w-full overflow-visible"
        role="img"
        aria-label={`Monthly views: ${earnings.map((m) => `${m.label} ${m.views}`).join(', ')}`}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--color-signal)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--color-signal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={pad.l}
            x2={W - pad.r}
            y1={pad.t + f * (H - pad.t - pad.b)}
            y2={pad.t + f * (H - pad.t - pad.b)}
            stroke="var(--color-line)"
            strokeDasharray="2 4"
          />
        ))}
        <path d={area} fill="url(#fill)" />
        <path d={line} fill="none" stroke="var(--color-signal)" strokeWidth="2.5" strokeLinejoin="round" />
        <line x1={x(h)} x2={x(h)} y1={pad.t} y2={H - pad.b} stroke="var(--color-line-2)" />
        {earnings.map((m, i) => (
          <g key={m.label}>
            <circle
              cx={x(i)}
              cy={y(m.views)}
              r={i === h ? 5.5 : 3}
              fill={i === h ? 'var(--color-signal)' : 'var(--color-ink-2)'}
              stroke="var(--color-signal)"
              strokeWidth="2"
            />
            <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--color-dim)" fontFamily="var(--font-mono)">
              {m.label}
            </text>
            <rect
              x={x(i) - (W / earnings.length) / 2}
              y={0}
              width={W / earnings.length}
              height={H}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
