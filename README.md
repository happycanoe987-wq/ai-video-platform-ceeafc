# TrendReel

TrendReel is an autonomous YouTube studio. It watches world news and trending topics, makes original AI explainers and serialized AI short films, takes your own footage, publishes everything to your linked YouTube channel on a daily schedule, and tracks subscribers, views and income on the way to the YouTube Partner Program.

## What's here now

- **Landing page** (`/`)
- **Command deck** (`/studio`): pipeline, next upload, autopilot, queue, hot trends, activity
- **Trending feed** (`/studio/trends`)
- **AI studio** (`/studio/create`): trend remix, AI movie, upload
- **Video library** (`/studio/library`): approve, schedule, publish, retry
- **Channel & autopilot** (`/studio/channel`)
- **Earnings** (`/studio/earnings`)

Every screen is clickable and runs on realistic stub data (`src/lib/fixtures.ts`). Real YouTube linking, AI generation and analytics come in later milestones (see [PLAN.md](./PLAN.md)).

## Tech

- TanStack Start (React 19, file-based routing) on Netlify
- Tailwind CSS v4 (theme tokens in `src/styles.css`)
- lucide-react icons, hand-built SVG charts
- Netlify Image CDN for every image (`/.netlify/images?url=/img/...`)

## Run locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

## Roadmap

See [PLAN.md](./PLAN.md): accounts and database → YouTube OAuth → trend ingestion → AI generation pipeline → publishing and autopilot → earnings analytics → notifications.
