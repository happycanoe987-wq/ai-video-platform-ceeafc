CREATE TABLE "activity" (
	"id" serial PRIMARY KEY,
	"at" timestamp DEFAULT now() NOT NULL,
	"kind" text NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "autopilot_settings" (
	"id" integer PRIMARY KEY,
	"settings" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channels" (
	"id" text PRIMARY KEY,
	"handle" text NOT NULL,
	"name" text NOT NULL,
	"avatar_url" text,
	"refresh_token" text NOT NULL,
	"subscribers" integer DEFAULT 0 NOT NULL,
	"total_views" integer DEFAULT 0 NOT NULL,
	"videos" integer DEFAULT 0 NOT NULL,
	"monetized" boolean DEFAULT false NOT NULL,
	"watch_hours" real DEFAULT 0 NOT NULL,
	"shorts_views_90d" integer DEFAULT 0 NOT NULL,
	"stats_at" timestamp,
	"connected_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "earnings_daily" (
	"day" text PRIMARY KEY,
	"views" integer DEFAULT 0 NOT NULL,
	"watch_minutes" integer DEFAULT 0 NOT NULL,
	"subscribers_gained" integer DEFAULT 0 NOT NULL,
	"revenue" real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta" (
	"key" text PRIMARY KEY,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trends" (
	"id" serial PRIMARY KEY,
	"headline" text NOT NULL UNIQUE,
	"category" text NOT NULL,
	"source" text NOT NULL,
	"url" text,
	"region" text NOT NULL,
	"heat" integer NOT NULL,
	"velocity" integer NOT NULL,
	"searches" text NOT NULL,
	"angle" text NOT NULL,
	"thumb_url" text,
	"used" boolean DEFAULT false NOT NULL,
	"fetched_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"tags" jsonb DEFAULT '[]' NOT NULL,
	"script" jsonb,
	"source" text NOT NULL,
	"aspect" text NOT NULL,
	"duration_sec" integer NOT NULL,
	"status" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"thumb_url" text,
	"video_key" text,
	"trend_id" integer,
	"brief" text,
	"ai_disclosure" boolean DEFAULT true NOT NULL,
	"error" text,
	"youtube_id" text,
	"scheduled_for" timestamp,
	"published_at" timestamp,
	"views" integer,
	"revenue" real,
	"created_at" timestamp DEFAULT now() NOT NULL
);
