# TrendReel — Product roadmap

TrendReel is an autonomous YouTube studio. It finds what the world is talking about, makes original AI videos and short films about it, takes your own uploads, publishes everything to your linked YouTube channel on a daily schedule, and tracks growth and income.

Each milestone below can be built on its own. Do them in order.

## ✅ Milestone 1: Product surface (done)

- Landing page (`/`) with the product story, live channel monitor, trend ticker and monetization progress.
- Studio shell (`/studio`) with a sidebar on desktop and a bottom bar on mobile, plus toasts.
- Command deck: pipeline counts, next upload, autopilot toggle, active queue, hot trends, AI activity log, views chart.
- Trending feed: category filters, featured story, heat and velocity, a suggested angle for each trend.
- AI studio: three modes (from a trend, AI movie, upload footage) with a live preview and AI plan.
- Video library: status filters and the full lifecycle (approve and schedule, publish now, unschedule, retry, delete).
- Channel & autopilot: mock Google consent flow, upload slots, formats, topics, approval mode, monetization guardrails.
- Earnings: projected income at estimated RPM, Partner Program progress, views chart, top uploads.
- All data comes from `src/lib/fixtures.ts`, and client-side state from `src/lib/studio-store.tsx`.

## Milestone 2: Accounts and data model

- Netlify Identity for sign-up and login, with `/studio/*` protected.
- Netlify Database (Drizzle) tables: `channels`, `videos`, `trends`, `autopilot_settings`, `activity`, `earnings_daily`.
- Replace fixtures with server functions/loaders, keeping the same TypeScript shapes.
- Store uploads and rendered video files in Netlify Blobs.

## Milestone 3: Real YouTube channel linking

- Google OAuth with scopes `youtube.upload`, `youtube`, `yt-analytics.readonly`, `yt-analytics-monetary.readonly` and `youtube.force-ssl` (comments). Store refresh tokens server-side, encrypted.
- Pull channel stats into the database (subscribers, views, video count).
- Support more than one channel per account.
- Note: Google has to verify the app before strangers can use these scopes, and the upload quota is limited (about 6 uploads a day at the default quota). Apply for an audit or a quota increase early.

## Milestone 4: Trend ingestion

- A scheduled function (hourly) pulls RSS/news APIs, Google Trends and YouTube `mostPopular`.
- Remove duplicates, group similar stories, and score heat and velocity. Use an AI Gateway model to write a suggested angle and category for each.
- Store results in the `trends` table and show them in the Trending feed.

## Milestone 5: AI generation pipeline

- Script writer (AI Gateway LLM): hook, context, original commentary, call to action, plus title, description, tags and chapters.
- Voice-over, scene images (Gemini image model) and the video render provider (e.g. Kling/Veo/Runway via API), running as background functions with status updates into `videos.progress`.
- AI movie mode: series bible, consistent characters, multiple parts that continue the story.
- Uploads: trim, captions, metadata and a thumbnail picked from the best frame.
- Retry handling and error reasons shown in the Library.

## Milestone 6: Publishing and autopilot

- A scheduled function publishes `scheduled` videos at their slot through the YouTube Data API, with the AI-disclosure flag set.
- Daily autopilot loop: pick trends that match the chosen topics → generate → either queue for approval or publish straight away.
- Comment-reply drafts, approved or posted automatically.
- Guardrails: originality check, duplicate-topic cooldown, daily quota budget.

## Milestone 7: Earnings and analytics

- Daily sync from the YouTube Analytics API: views, watch time, subscribers, and estimated revenue once monetized.
- Real Partner Program progress, revenue charts and per-video revenue.
- A feedback loop: send each format's and topic's results back into autopilot's choices.

## Milestone 8: Notifications and polish

- Email or push notices when a video is ready, published or has failed, and on milestones.
- Onboarding checklist, empty states for new channels, settings and billing.
