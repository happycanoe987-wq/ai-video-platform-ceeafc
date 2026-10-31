import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Clapperboard,
  Coins,
  Flame,
  Radar,
  ShieldCheck,
  Upload,
  Zap,
} from 'lucide-react'
import { Logo, Youtube } from '../components/Logo'
import { YPP, channel, img, trends } from '../lib/fixtures'
import { compact } from '../lib/format'

export const Route = createFileRoute('/')({ component: Landing })

const steps = [
  {
    icon: Radar,
    title: 'Scan',
    body: 'Every hour TrendReel reads world news, search spikes and YouTube trending to find what people want to watch right now.',
  },
  {
    icon: Clapperboard,
    title: 'Create',
    body: 'It writes an original script with its own angle, voices it, renders scenes and cuts Shorts and long-form versions.',
  },
  {
    icon: Youtube,
    title: 'Publish',
    body: 'Titles, descriptions, tags, chapters and thumbnails go up to your channel on a steady daily schedule.',
  },
  {
    icon: Coins,
    title: 'Earn',
    body: 'It tracks views, subscribers and revenue, learns what works on your channel and makes more of it.',
  },
]

const features = [
  {
    icon: Flame,
    title: 'Trend remixer',
    body: 'Turns the day’s biggest stories into explainers, countdowns and recaps. It adds its own commentary, so you get new videos, not copies of other people’s.',
    tone: 'text-signal',
  },
  {
    icon: Clapperboard,
    title: 'AI movie studio',
    body: 'Write a one-line idea and get a multi-scene short film with consistent characters, a score and a cliffhanger for Part 2.',
    tone: 'text-amber',
  },
  {
    icon: Upload,
    title: 'Your own footage',
    body: 'Drop in your own clips. TrendReel trims them, captions them, writes the metadata and fits them into the schedule.',
    tone: 'text-sky',
  },
  {
    icon: Zap,
    title: 'Daily autopilot',
    body: 'Pick how many uploads a day and when. Approve each video yourself, or let the AI run the channel inside rules you set.',
    tone: 'text-live',
  },
]

function Landing() {
  const ticker = [...trends, ...trends]
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#how" className="hover:text-bone">
              How it works
            </a>
            <a href="#features" className="hover:text-bone">
              Features
            </a>
            <a href="#growth" className="hover:text-bone">
              Monetization
            </a>
          </nav>
          <Link to="/studio" className="btn-primary">
            Open studio <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate min-h-[100svh] pt-16">
        <img
          src={img('hero.png', 1800)}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />
        <div className="scanlines absolute inset-0 -z-10" />

        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-[14vh] lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <div>
            <p className="rise chip border-signal/50 text-signal">
              <span className="pulse-dot size-1.5 rounded-full bg-signal" />
              On air · autonomous channel studio
            </p>
            <h1
              className="rise mt-6 font-display text-[clamp(3rem,8.5vw,7.5rem)] font-extrabold leading-[0.88] tracking-[-0.04em]"
              style={{ animationDelay: '80ms' }}
            >
              Today’s news.
              <br />
              <span className="text-signal">Tonight’s</span> upload.
            </h1>
            <p
              className="rise mt-7 max-w-xl text-lg leading-relaxed text-bone/80"
              style={{ animationDelay: '160ms' }}
            >
              TrendReel watches what the world is talking about, makes original
              AI videos and short films about it, and posts them to your YouTube
              channel every day. You watch the subscribers and revenue come in.
            </p>
            <div
              className="rise mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: '240ms' }}
            >
              <Link to="/studio" className="btn-primary px-6 py-3 text-base">
                Launch command deck <ArrowRight className="size-4" />
              </Link>
              <Link to="/studio/channel" className="btn-ghost px-6 py-3 text-base">
                <Youtube className="size-4" /> Connect YouTube
              </Link>
            </div>
          </div>

          {/* Live monitor card */}
          <div
            className="rise panel relative overflow-hidden bg-ink-2/80 p-5 backdrop-blur"
            style={{ animationDelay: '320ms' }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Channel monitor
              </span>
              <span className="chip border-live/40 text-live">
                <span className="pulse-dot size-1.5 rounded-full bg-live" /> live
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ['Subscribers', compact(channel.subscribers)],
                ['Views', compact(channel.totalViews)],
                ['Uploads', String(channel.videos)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-ink p-3">
                  <div className="font-display text-2xl font-bold">{v}</div>
                  <div className="mt-0.5 text-xs text-dim">{k}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {trends.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl border border-line p-2.5"
                >
                  <img
                    src={img(t.thumb, 160)}
                    alt=""
                    className="h-10 w-16 rounded-md object-cover"
                    loading="lazy"
                  />
                  <p className="line-clamp-1 flex-1 text-sm">{t.headline}</p>
                  <span className="font-mono text-xs text-signal">{t.heat}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="border-y border-line bg-ink-2/80 py-3 backdrop-blur">
          <div className="flex w-max ticker gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-wider text-muted">
            {ticker.map((t, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-signal">▲ {t.velocity}%</span>
                {t.headline}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="mx-auto max-w-7xl px-5 py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl">
            One loop.
            <br />
            <span className="text-muted">Running every day.</span>
          </h2>
          <p className="max-w-sm text-muted">
            Each step runs without you. Step in whenever you want, from approving
            a title to taking over the whole schedule.
          </p>
        </div>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="group bg-ink-2 p-7 transition-colors hover:bg-ink-3">
              <div className="flex items-center justify-between">
                <s.icon className="size-6 text-signal transition-transform group-hover:-translate-y-0.5" />
                <span className="font-mono text-xs text-dim">0{i + 1}</span>
              </div>
              <h3 className="mt-10 font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-line bg-ink-2/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-28 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="chip">Studio</p>
            <h2 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight">
              Three ways in.
              <br />
              One channel out.
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {['thumb-space.png', 'thumb-train.png'].map((f) => (
                <img
                  key={f}
                  src={img(f, 520)}
                  alt=""
                  loading="lazy"
                  className="aspect-video w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <article key={f.title} className="panel p-7 transition-colors hover:border-line-2">
                <f.icon className={`size-7 ${f.tone}`} />
                <h3 className="mt-6 font-display text-2xl font-bold">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* GROWTH */}
      <section id="growth" className="mx-auto max-w-7xl px-5 py-28">
        <div className="panel grid overflow-hidden lg:grid-cols-2">
          <div className="p-10">
            <p className="chip border-live/40 text-live">Road to monetization</p>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight">
              It keeps going until YouTube starts paying you.
            </h2>
            <p className="mt-4 text-muted">
              YouTube pays creators once a channel is accepted into the Partner
              Program. TrendReel tracks your progress toward each requirement,
              plans uploads around the gap and keeps the channel within YouTube’s
              rules on AI disclosure and original content. Views and income
              aren’t guaranteed, but steady, original uploads give you the best
              chance.
            </p>
          </div>
          <div className="space-y-6 border-t border-line bg-ink p-10 lg:border-l lg:border-t-0">
            {[
              ['Subscribers', channel.subscribers, YPP.subscribers],
              ['Watch hours (12 mo)', channel.watchHours, YPP.watchHours],
              ['Shorts views (90 days)', channel.shortsViews90d, YPP.shortsViews90d],
            ].map(([k, v, goal]) => {
              const pct = Math.min(100, ((v as number) / (goal as number)) * 100)
              return (
                <div key={k as string}>
                  <div className="flex justify-between text-sm">
                    <span>{k}</span>
                    <span className="font-mono text-muted">
                      {compact(v as number)} / {compact(goal as number)}
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
            })}
            <p className="flex items-center gap-2 text-xs text-dim">
              <ShieldCheck className="size-4 text-live" /> Example channel. Your
              own numbers appear once you connect.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-5 py-24 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-5xl font-extrabold leading-[0.9] tracking-tight md:text-7xl">
            Your channel,
            <br />
            <span className="text-signal">always on.</span>
          </h2>
          <Link to="/studio" className="btn-primary px-7 py-4 text-base">
            Enter the studio <ArrowRight className="size-5" />
          </Link>
        </div>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-xs text-dim">
            <Logo small />
            <span>
              Not affiliated with YouTube. YouTube is a trademark of Google LLC.
            </span>
          </div>
        </footer>
      </section>
    </div>
  )
}
