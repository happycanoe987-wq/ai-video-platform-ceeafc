// All stubbed product data lives here. Later milestones replace these
// exports with Netlify Database queries, the YouTube Data/Analytics APIs,
// and live trend feeds — screens should only ever import from this module
// (directly or through the studio store).

export type VideoStatus =
  | 'generating'
  | 'ready'
  | 'scheduled'
  | 'published'
  | 'failed'

export type VideoSource = 'trend' | 'movie' | 'upload'
export type AspectRatio = '9:16' | '16:9'

export interface Video {
  id: string
  title: string
  description: string
  source: VideoSource
  aspect: AspectRatio
  durationSec: number
  status: VideoStatus
  thumb: string
  createdAt: string
  scheduledFor?: string
  publishedAt?: string
  views?: number
  revenue?: number
  progress?: number
  trendId?: string
  aiDisclosure: boolean
  error?: string
}

export interface Trend {
  id: string
  rank: number
  headline: string
  category: 'Politics' | 'World' | 'Tech' | 'Science' | 'Sports' | 'Culture'
  source: string
  region: string
  heat: number
  velocity: number
  searches: string
  angle: string
  thumb: string
}

export interface Channel {
  connected: boolean
  handle: string
  name: string
  avatarInitials: string
  subscribers: number
  totalViews: number
  videos: number
  monetized: boolean
  watchHours: number
  shortsViews90d: number
}

export interface AutopilotSettings {
  enabled: boolean
  uploadsPerDay: number
  slots: string[]
  formats: { shorts: boolean; longForm: boolean; movies: boolean }
  categories: Trend['category'][]
  requireApproval: boolean
  addAiDisclosure: boolean
  originalCommentaryOnly: boolean
  timezone: string
}

export interface EarningsMonth {
  label: string
  revenue: number
  views: number
  subscribers: number
}

export interface ActivityItem {
  id: string
  at: string
  kind: 'publish' | 'generate' | 'trend' | 'milestone' | 'reply'
  text: string
}

export const img = (file: string, w = 640) =>
  `/.netlify/images?url=/img/${file}&w=${w}&fm=webp&q=72`

// MONETIZATION THRESHOLDS — YouTube Partner Program requirements.
export const YPP = {
  subscribers: 1000,
  watchHours: 4000,
  shortsViews90d: 10_000_000,
}

export const channel: Channel = {
  connected: true,
  handle: '@Daniel-x3s3n',
  name: 'Daniel — World in 60s',
  avatarInitials: 'DW',
  subscribers: 742,
  totalViews: 186_420,
  videos: 38,
  monetized: false,
  watchHours: 2_910,
  shortsViews90d: 3_480_000,
}

export const trends: Trend[] = [
  {
    id: 't1',
    rank: 1,
    headline:
      'Alaska voters react to allegations of a spoiler in the U.S. Senate race',
    category: 'Politics',
    source: 'AP News',
    region: 'US',
    heat: 96,
    velocity: 412,
    searches: '2M+',
    angle: 'Explain what a "spoiler candidate" is in 45 seconds with a map.',
    thumb: 'thumb-election.png',
  },
  {
    id: 't2',
    rank: 2,
    headline: 'US midterms: 4 days to go — what the polls say',
    category: 'Politics',
    source: 'BBC',
    region: 'US',
    heat: 93,
    velocity: 288,
    searches: '1M+',
    angle: 'Three races that decide the House, visualised as a countdown.',
    thumb: 'thumb-election.png',
  },
  {
    id: 't3',
    rank: 3,
    headline:
      "Spain's deadly train crash puts human error and systemic failure under scrutiny",
    category: 'World',
    source: 'Reuters',
    region: 'EU',
    heat: 88,
    velocity: 197,
    searches: '500K+',
    angle: 'How rail signalling is supposed to prevent this — a calm explainer.',
    thumb: 'thumb-train.png',
  },
  {
    id: 't4',
    rank: 4,
    headline: 'Bystander footage reshapes debate over street arrests in LA',
    category: 'Culture',
    source: 'LA Times',
    region: 'US',
    heat: 84,
    velocity: 164,
    searches: '500K+',
    angle: 'Your rights when filming in public, in plain language.',
    thumb: 'thumb-city.png',
  },
  {
    id: 't5',
    rank: 5,
    headline: 'Private lander sends first images from the lunar south pole',
    category: 'Science',
    source: 'Space.com',
    region: 'Global',
    heat: 79,
    velocity: 141,
    searches: '200K+',
    angle: 'Why the south pole matters: water ice, explained with visuals.',
    thumb: 'thumb-space.png',
  },
  {
    id: 't6',
    rank: 6,
    headline: 'Record swell hits Nazaré as big-wave season opens early',
    category: 'Sports',
    source: 'Surfer',
    region: 'EU',
    heat: 72,
    velocity: 96,
    searches: '100K+',
    angle: 'The physics of a 30-metre wave in under a minute.',
    thumb: 'thumb-ocean.png',
  },
  {
    id: 't7',
    rank: 7,
    headline: 'New open-weight AI model tops coding benchmarks',
    category: 'Tech',
    source: 'The Verge',
    region: 'Global',
    heat: 68,
    velocity: 77,
    searches: '100K+',
    angle: 'What the benchmark actually measures — and what it misses.',
    thumb: 'thumb-city.png',
  },
]

export const videos: Video[] = [
  {
    id: 'v1',
    title: "Alaska's Senate Race: Spoiler Claims Shake the Last Frontier",
    description: 'A 60-second explainer on the spoiler allegations.',
    source: 'trend',
    aspect: '9:16',
    durationSec: 58,
    status: 'generating',
    progress: 64,
    thumb: 'thumb-election.png',
    createdAt: '2026-10-31T09:10:00Z',
    trendId: 't1',
    aiDisclosure: true,
  },
  {
    id: 'v2',
    title: 'Phone Raised, Street Frozen: When an Arrest Becomes a Witness Moment',
    description: 'Know your rights when filming police in public.',
    source: 'trend',
    aspect: '9:16',
    durationSec: 52,
    status: 'failed',
    error: 'Render timed out at scene 4 of 6.',
    thumb: 'thumb-city.png',
    createdAt: '2026-10-31T03:12:00Z',
    trendId: 't4',
    aiDisclosure: true,
  },
  {
    id: 'v3',
    title: 'Signals, Speed & a Single Mistake: Inside Spain’s Rail Safety Net',
    description: 'How European rail signalling works, and where it can fail.',
    source: 'trend',
    aspect: '16:9',
    durationSec: 412,
    status: 'ready',
    thumb: 'thumb-train.png',
    createdAt: '2026-10-31T07:40:00Z',
    trendId: 't3',
    aiDisclosure: true,
  },
  {
    id: 'v4',
    title: 'RINGFALL — an AI short film (Part 1)',
    description: 'A lone pilot races a collapsing planetary ring.',
    source: 'movie',
    aspect: '16:9',
    durationSec: 236,
    status: 'scheduled',
    scheduledFor: '2026-10-31T17:00:00Z',
    thumb: 'thumb-space.png',
    createdAt: '2026-10-30T21:05:00Z',
    aiDisclosure: true,
  },
  {
    id: 'v5',
    title: 'The 30-Metre Wave, Explained',
    description: 'Physics of Nazaré in under a minute.',
    source: 'trend',
    aspect: '9:16',
    durationSec: 49,
    status: 'scheduled',
    scheduledFor: '2026-10-31T21:00:00Z',
    thumb: 'thumb-ocean.png',
    createdAt: '2026-10-31T06:15:00Z',
    trendId: 't6',
    aiDisclosure: true,
  },
  {
    id: 'v6',
    title: 'Midterms in 60 Seconds: The 3 Races to Watch',
    description: 'Countdown explainer.',
    source: 'trend',
    aspect: '9:16',
    durationSec: 60,
    status: 'published',
    publishedAt: '2026-10-30T18:00:00Z',
    views: 48_210,
    revenue: 0,
    thumb: 'thumb-election.png',
    createdAt: '2026-10-30T12:00:00Z',
    trendId: 't2',
    aiDisclosure: true,
  },
  {
    id: 'v7',
    title: 'My Drone Run Over the Coast (Raw Upload)',
    description: 'Original footage uploaded by Daniel.',
    source: 'upload',
    aspect: '16:9',
    durationSec: 184,
    status: 'published',
    publishedAt: '2026-10-29T15:30:00Z',
    views: 6_930,
    revenue: 0,
    thumb: 'thumb-ocean.png',
    createdAt: '2026-10-29T15:00:00Z',
    aiDisclosure: false,
  },
  {
    id: 'v8',
    title: 'Water on the Moon? The South Pole, Explained',
    description: 'Lunar south pole explainer.',
    source: 'trend',
    aspect: '9:16',
    durationSec: 55,
    status: 'published',
    publishedAt: '2026-10-29T09:00:00Z',
    views: 21_870,
    revenue: 0,
    thumb: 'thumb-space.png',
    createdAt: '2026-10-29T06:00:00Z',
    trendId: 't5',
    aiDisclosure: true,
  },
]

export const autopilot: AutopilotSettings = {
  enabled: false,
  uploadsPerDay: 3,
  slots: ['09:00', '17:00', '21:00'],
  formats: { shorts: true, longForm: true, movies: false },
  categories: ['Politics', 'World', 'Science', 'Tech'],
  requireApproval: true,
  addAiDisclosure: true,
  originalCommentaryOnly: true,
  timezone: 'America/New_York',
}

// Channel history for the earnings screen. Revenue stays at $0 until the
// channel joins the Partner Program — the "projected" series shows what the
// same views would earn at the estimated RPM once monetized.
export const earnings: EarningsMonth[] = [
  { label: 'May', revenue: 0, views: 2_140, subscribers: 31 },
  { label: 'Jun', revenue: 0, views: 6_880, subscribers: 74 },
  { label: 'Jul', revenue: 0, views: 14_320, subscribers: 152 },
  { label: 'Aug', revenue: 0, views: 22_910, subscribers: 268 },
  { label: 'Sep', revenue: 0, views: 41_600, subscribers: 431 },
  { label: 'Oct', revenue: 0, views: 98_570, subscribers: 742 },
]

export const estimatedRpm = { shorts: 0.06, longForm: 3.4 } // USD per 1,000 views

export const activity: ActivityItem[] = [
  {
    id: 'a1',
    at: '2026-10-31T09:10:00Z',
    kind: 'generate',
    text: 'Started rendering “Alaska’s Senate Race” from trend #1',
  },
  {
    id: 'a2',
    at: '2026-10-31T07:40:00Z',
    kind: 'generate',
    text: 'Rail-safety explainer finished — waiting for your approval',
  },
  {
    id: 'a3',
    at: '2026-10-31T06:00:00Z',
    kind: 'trend',
    text: '14 new trends scanned · 3 matched your categories',
  },
  {
    id: 'a4',
    at: '2026-10-30T22:14:00Z',
    kind: 'milestone',
    text: 'Channel passed 700 subscribers',
  },
  {
    id: 'a5',
    at: '2026-10-30T18:00:00Z',
    kind: 'publish',
    text: 'Published “Midterms in 60 Seconds” to YouTube',
  },
  {
    id: 'a6',
    at: '2026-10-30T19:32:00Z',
    kind: 'reply',
    text: 'Drafted 12 comment replies for review',
  },
]

export const movieGenres = [
  'Sci-fi',
  'Thriller',
  'Documentary',
  'Drama',
  'Animation',
  'Horror',
] as const

export const voices = ['Atlas (calm)', 'Nova (energetic)', 'Reed (newsroom)']
