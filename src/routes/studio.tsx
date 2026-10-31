import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import {
  Clapperboard,
  Coins,
  Flame,
  LayoutDashboard,
  Library,
  Radio,
  X,
} from 'lucide-react'
import { useEffect } from 'react'
import { Logo, Youtube } from '../components/Logo'
import { StudioProvider, useStudio } from '../lib/studio-store'

export const Route = createFileRoute('/studio')({ component: StudioLayout })

const nav = [
  { to: '/studio', label: 'Command deck', short: 'Deck', icon: LayoutDashboard, exact: true },
  { to: '/studio/trends', label: 'Trending feed', short: 'Trends', icon: Flame },
  { to: '/studio/create', label: 'AI studio', short: 'Create', icon: Clapperboard },
  { to: '/studio/library', label: 'Video library', short: 'Library', icon: Library },
  { to: '/studio/channel', label: 'Channel & autopilot', short: 'Channel', icon: Radio },
  { to: '/studio/earnings', label: 'Earnings', short: 'Earn', icon: Coins },
] as const

function StudioLayout() {
  return (
    <StudioProvider>
      <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <main className="min-w-0 px-4 pb-28 pt-6 sm:px-8 lg:pb-12 lg:pt-8">
          <Outlet />
        </main>
        <MobileNav />
        <Toasts />
      </div>
    </StudioProvider>
  )
}

function Sidebar() {
  const { channel, autopilot } = useStudio()
  return (
    <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-ink-2/60 p-5 lg:flex">
      <Logo />
      <p className="mt-1 pl-[42px] font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
        Viral content engine
      </p>
      <nav className="mt-10 space-y-1">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: 'exact' in n }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-bone data-[status=active]:bg-signal/10 data-[status=active]:text-bone"
          >
            {({ isActive }) => (
              <>
                <n.icon className={`size-4 ${isActive ? 'text-signal' : ''}`} />
                {n.label}
              </>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <Link
          to="/studio/channel"
          className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-xs"
        >
          <span
            className={`size-2 rounded-full ${autopilot.enabled ? 'pulse-dot bg-live' : 'bg-dim'}`}
          />
          Autopilot{' '}
          <span className="ml-auto font-mono uppercase text-muted">
            {autopilot.enabled ? 'running' : 'paused'}
          </span>
        </Link>
        <div className="flex items-center gap-3 rounded-xl bg-ink p-3">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-signal to-amber font-display text-sm font-bold text-ink">
            {channel.avatarInitials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{channel.handle}</p>
            <p className="flex items-center gap-1 text-xs text-dim">
              <Youtube className="size-3 text-signal" />
              {channel.connected ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-line bg-ink/90 backdrop-blur-xl lg:hidden">
      {nav.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          activeOptions={{ exact: 'exact' in n }}
          className="flex flex-col items-center gap-1 py-2.5 text-[10px] text-dim data-[status=active]:text-signal"
        >
          <n.icon className="size-5" />
          {n.short}
        </Link>
      ))}
    </nav>
  )
}

function Toasts() {
  const { toasts, dismiss } = useStudio()
  const latest = toasts.at(-1)
  useEffect(() => {
    if (!latest) return
    const t = setTimeout(() => dismiss(latest.id), 3200)
    return () => clearTimeout(t)
  }, [latest, dismiss])
  return (
    <div
      aria-live="polite"
      className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 lg:bottom-6"
    >
      {toasts.slice(-3).map((t) => (
        <div
          key={t.id}
          className="rise flex items-center gap-3 rounded-xl border border-line-2 bg-ink-3 py-2.5 pl-4 pr-2 text-sm shadow-2xl shadow-black/50"
        >
          <span className="size-1.5 rounded-full bg-live" />
          {t.text}
          <button
            onClick={() => dismiss(t.id)}
            className="btn-quiet p-1"
            aria-label="Dismiss"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
