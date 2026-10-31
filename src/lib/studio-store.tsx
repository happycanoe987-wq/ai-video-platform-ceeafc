import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import {
  autopilot as initialAutopilot,
  channel as initialChannel,
  videos as initialVideos,
  type AutopilotSettings,
  type Channel,
  type Video,
} from './fixtures'

// Client-side stand-in for the real backend. Every action here maps to a
// future API call (see PLAN.md); the shape of state should stay the same.

interface Toast {
  id: number
  text: string
}

interface State {
  channel: Channel
  videos: Video[]
  autopilot: AutopilotSettings
  toasts: Toast[]
}

type Action =
  | { type: 'connect'; connected: boolean }
  | { type: 'autopilot'; patch: Partial<AutopilotSettings> }
  | { type: 'add'; video: Video }
  | { type: 'update'; id: string; patch: Partial<Video> }
  | { type: 'remove'; id: string }
  | { type: 'tick' }
  | { type: 'toast'; text: string }
  | { type: 'dismiss'; id: number }

let toastId = 0

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'connect':
      return {
        ...state,
        channel: { ...state.channel, connected: action.connected },
        autopilot: action.connected
          ? state.autopilot
          : { ...state.autopilot, enabled: false },
      }
    case 'autopilot':
      return { ...state, autopilot: { ...state.autopilot, ...action.patch } }
    case 'add':
      return { ...state, videos: [action.video, ...state.videos] }
    case 'update':
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.id ? { ...v, ...action.patch } : v,
        ),
      }
    case 'remove':
      return { ...state, videos: state.videos.filter((v) => v.id !== action.id) }
    case 'tick': {
      let changed = false
      const videos = state.videos.map((v) => {
        if (v.status !== 'generating') return v
        changed = true
        const progress = Math.min(100, (v.progress ?? 0) + 6)
        return progress >= 100
          ? { ...v, progress: 100, status: 'ready' as const }
          : { ...v, progress }
      })
      return changed ? { ...state, videos } : state
    }
    case 'toast':
      return {
        ...state,
        toasts: [...state.toasts, { id: ++toastId, text: action.text }],
      }
    case 'dismiss':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      }
  }
}

function nextSlot(slots: string[], taken: string[]) {
  const now = new Date()
  for (let day = 0; day < 14; day++) {
    for (const slot of [...slots].sort()) {
      const [h, m] = slot.split(':').map(Number)
      const d = new Date(now)
      d.setDate(now.getDate() + day)
      d.setHours(h, m, 0, 0)
      if (d > now && !taken.includes(d.toISOString())) return d.toISOString()
    }
  }
  return new Date(now.getTime() + 3_600_000).toISOString()
}

function useStudioState() {
  const [state, dispatch] = useReducer(reducer, {
    channel: initialChannel,
    videos: initialVideos,
    autopilot: initialAutopilot,
    toasts: [],
  })

  const hasGenerating = state.videos.some((v) => v.status === 'generating')
  useEffect(() => {
    if (!hasGenerating) return
    const t = setInterval(() => dispatch({ type: 'tick' }), 900)
    return () => clearInterval(t)
  }, [hasGenerating])

  const toast = useCallback(
    (text: string) => dispatch({ type: 'toast', text }),
    [],
  )

  const actions = useMemo(
    () => ({
      toast,
      dismiss: (id: number) => dispatch({ type: 'dismiss', id }),
      setConnected: (connected: boolean) => {
        dispatch({ type: 'connect', connected })
        toast(connected ? 'YouTube channel connected' : 'Channel disconnected')
      },
      setAutopilot: (patch: Partial<AutopilotSettings>) =>
        dispatch({ type: 'autopilot', patch }),
      createVideo: (
        input: Pick<
          Video,
          'title' | 'description' | 'source' | 'aspect' | 'durationSec' | 'thumb'
        > & { trendId?: string },
      ) => {
        const video: Video = {
          ...input,
          id: `v${Date.now()}`,
          status: input.source === 'upload' ? 'ready' : 'generating',
          progress: input.source === 'upload' ? 100 : 4,
          createdAt: new Date().toISOString(),
          aiDisclosure: input.source !== 'upload',
        }
        dispatch({ type: 'add', video })
        toast(
          input.source === 'upload'
            ? 'Upload added to your library'
            : 'Generation started — follow it in the pipeline',
        )
        return video
      },
      approve: (video: Video, slots: string[], taken: string[]) => {
        dispatch({
          type: 'update',
          id: video.id,
          patch: { status: 'scheduled', scheduledFor: nextSlot(slots, taken) },
        })
        toast('Approved and queued for the next upload slot')
      },
      publishNow: (video: Video) => {
        dispatch({
          type: 'update',
          id: video.id,
          patch: {
            status: 'published',
            publishedAt: new Date().toISOString(),
            scheduledFor: undefined,
            views: 0,
            revenue: 0,
          },
        })
        toast('Sent to YouTube')
      },
      unschedule: (video: Video) =>
        dispatch({
          type: 'update',
          id: video.id,
          patch: { status: 'ready', scheduledFor: undefined },
        }),
      retry: (video: Video) => {
        dispatch({
          type: 'update',
          id: video.id,
          patch: { status: 'generating', progress: 8, error: undefined },
        })
        toast('Retrying render')
      },
      remove: (video: Video) => {
        dispatch({ type: 'remove', id: video.id })
        toast('Removed from library')
      },
    }),
    [toast],
  )

  return { ...state, ...actions }
}

type Studio = ReturnType<typeof useStudioState>
const StudioContext = createContext<Studio | null>(null)

export function StudioProvider({ children }: { children: ReactNode }) {
  const studio = useStudioState()
  return (
    <StudioContext.Provider value={studio}>{children}</StudioContext.Provider>
  )
}

export function useStudio() {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used inside <StudioProvider>')
  return ctx
}
