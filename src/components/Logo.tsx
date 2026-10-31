import { Link } from '@tanstack/react-router'

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-signal"
    >
      <span
        className={`relative grid place-items-center rounded-[10px] bg-signal text-ink ${small ? 'size-6' : 'size-8'}`}
      >
        <svg viewBox="0 0 24 24" className={small ? 'size-3' : 'size-4'} aria-hidden>
          <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border-2 border-ink bg-live" />
      </span>
      <span
        className={`font-display font-extrabold tracking-tight ${small ? 'text-sm' : 'text-lg'}`}
      >
        Trend<span className="text-signal">Reel</span>
      </span>
    </Link>
  )
}

export function Youtube({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15.1V8.9l5.8 3.1-5.8 3.1Z" />
    </svg>
  )
}
