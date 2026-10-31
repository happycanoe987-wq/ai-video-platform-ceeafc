import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

// The linked YouTube channel. One owner channel per deployment.
export const channels = pgTable('channels', {
  id: text().primaryKey(), // YouTube channel id
  handle: text().notNull(),
  name: text().notNull(),
  avatarUrl: text('avatar_url'),
  refreshToken: text('refresh_token').notNull(), // AES-GCM encrypted
  subscribers: integer().notNull().default(0),
  totalViews: integer('total_views').notNull().default(0),
  videos: integer().notNull().default(0),
  monetized: boolean().notNull().default(false),
  watchHours: real('watch_hours').notNull().default(0),
  shortsViews90d: integer('shorts_views_90d').notNull().default(0),
  statsAt: timestamp('stats_at'),
  connectedAt: timestamp('connected_at').defaultNow().notNull(),
})

export const autopilotSettings = pgTable('autopilot_settings', {
  id: integer().primaryKey(),
  settings: jsonb().notNull(),
})

export const videos = pgTable('videos', {
  id: serial().primaryKey(),
  title: text().notNull(),
  description: text().notNull().default(''),
  tags: jsonb().$type<string[]>().notNull().default([]),
  script: jsonb().$type<{ caption: string; visual: string }[]>(),
  source: text().notNull(),
  aspect: text().notNull(),
  durationSec: integer('duration_sec').notNull(),
  status: text().notNull(),
  progress: integer().notNull().default(0),
  thumbUrl: text('thumb_url'),
  videoKey: text('video_key'),
  trendId: integer('trend_id'),
  brief: text(),
  aiDisclosure: boolean('ai_disclosure').notNull().default(true),
  error: text(),
  youtubeId: text('youtube_id'),
  scheduledFor: timestamp('scheduled_for'),
  publishedAt: timestamp('published_at'),
  views: integer(),
  revenue: real(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const trends = pgTable('trends', {
  id: serial().primaryKey(),
  headline: text().notNull().unique(),
  category: text().notNull(),
  source: text().notNull(),
  url: text(),
  region: text().notNull(),
  heat: integer().notNull(),
  velocity: integer().notNull(),
  searches: text().notNull(),
  angle: text().notNull(),
  thumbUrl: text('thumb_url'),
  used: boolean().notNull().default(false),
  fetchedAt: timestamp('fetched_at').defaultNow().notNull(),
})

export const activity = pgTable('activity', {
  id: serial().primaryKey(),
  at: timestamp().defaultNow().notNull(),
  kind: text().notNull(),
  text: text().notNull(),
})

export const earningsDaily = pgTable('earnings_daily', {
  day: text().primaryKey(), // YYYY-MM-DD
  views: integer().notNull().default(0),
  watchMinutes: integer('watch_minutes').notNull().default(0),
  subscribersGained: integer('subscribers_gained').notNull().default(0),
  revenue: real().notNull().default(0),
})

export const meta = pgTable('meta', {
  key: text().primaryKey(),
  value: text().notNull(),
})
