# TrendReel — agent guide

Autonomous YouTube studio: trends → AI videos/movies/uploads → scheduled YouTube publishing → earnings tracking.

**Continue from [PLAN.md](./PLAN.md).** Milestone 1 (the UI surface) is done. Start the next unchecked milestone.

## Architecture

- TanStack Start + React 19, file routes in `src/routes/`. `src/routeTree.gen.ts` is generated, so don't edit it.
- `src/routes/index.tsx`: marketing landing page.
- `src/routes/studio.tsx`: studio layout (sidebar, mobile bottom nav, toasts). It wraps every studio screen in `StudioProvider`.
- `src/routes/studio/*.tsx`: index (command deck), trends, create (AI studio, `?mode=trend|movie|upload&trend=<id>`), library (`?status=`), channel (connection and autopilot), earnings.
- `src/lib/fixtures.ts`: **all stub data and domain types** (Video, Trend, Channel, AutopilotSettings, EarningsMonth). Swap these for database/API data in later milestones and keep the types.
- `src/lib/studio-store.tsx`: client-side reducer and actions (createVideo, approve, publishNow, retry, setAutopilot, setConnected, toast). Each action is meant to become a server function call.
- `src/components/studio-ui.tsx`: shared UI (PageHeader, StatusBadge, Thumb, Stat, Toggle, Empty). `Logo.tsx` also exports a `Youtube` brand icon, because lucide v1 has no brand icons.
- `src/lib/format.ts`: number and date formatters. Dates use a fixed `America/New_York` timezone so SSR and client output match.

## Conventions

- Dark "broadcast control room" theme. Use the Tailwind tokens from `@theme` in `styles.css` (`ink`, `bone`, `signal`, `live`, `amber`, `sky`, `line`, `muted`, `dim`) and the component classes `.panel`, `.btn-primary`, `.btn-ghost`, `.btn-quiet`, `.chip`, `.field`, `.label`, `.rise`.
- Fonts: Bricolage Grotesque (display), Instrument Sans (body), JetBrains Mono (data/labels).
- Images live in `public/img/` (AI-generated PNGs) and are always loaded through `img(file, width)` from fixtures, which uses the Netlify Image CDN.
- Charts are plain SVG/divs. There's no chart library.

## Product decisions

- Content must stay monetizable. YouTube's Partner Program rejects reused or mass-produced content and requires disclosure of realistic AI media. The UI defaults to "original commentary only" and "label AI-generated content", and the copy never promises guaranteed views or income. Keep it that way.
- Autopilot needs a connected channel. By default it waits for user approval before publishing.
- Earnings show $0 paid until monetized, plus projected income at estimated RPM (`estimatedRpm` in fixtures).

## Persistence (future milestones)

Use Netlify Database (Drizzle, `db/schema.ts`) for records, Netlify Blobs for video files, Netlify Identity for accounts, and scheduled/background Netlify Functions for trend scans, renders and publishing.
