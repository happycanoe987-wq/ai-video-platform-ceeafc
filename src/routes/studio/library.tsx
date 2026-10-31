import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start' // or '@tanstack/start' depending on your project setup

import { CalendarClock, Eye, Plus, RotateCw, Send, Trash, Undo2, Download, Share2 } from 'lucide-react'
import { Empty, PageHeader, StatusBadge, Thumb, sourceLabel } from '../../components/studio-ui'
import type { Video, VideoStatus } from '../../components/studio-ui' // Adjusted to assume shared type location or your fixtures
import { compact, dateTime } from '../../lib/format'
import { useStudio } from '../../lib/studio-store'

const filters = ['all', 'generating', 'ready', 'scheduled', 'published', 'failed'] as const
type Filter = (typeof filters)[number]

export const Route = createFileRoute('/studio/library')({
  validateSearch: (s: Record<string, unknown>): { status?: Filter } => ({
    status: filters.includes(s.status as Filter) ? (s.status as Filter) : undefined,
  }),
  component: LibraryPage,
})

// Server-side action that securely accesses credentials and uploads to YouTube
const uploadToServerAction = createServerFn({ method: 'POST' })
  .validator((data: { url: string; title: string }) => data)
  .handler(async ({ data }) => {
    const { uploadVideo } = await import('../../../server/google.js')
    
    const fileResponse = await fetch(data.url)
    if (!fileResponse.ok) throw new Error('Could not download video asset source')
    
    const arrayBuffer = await fileResponse.arrayBuffer()
    const videoBytes = new Uint8Array(arrayBuffer)

    const meta = {
      title: data.title || 'Platform Upload',
      description: 'Uploaded manually via Video Generation Platform.',
      tags: ['ai', 'video'],
      aiDisclosure: true
    }

    const youtubeId = await uploadVideo(meta, videoBytes)
    return { success: true, youtubeId }
  })
export function LibraryPage() {
  const { status = 'all' } = Route.useSearch()
  const navigate = useNavigate()
  const { videos, autopilot, approve, publishNow, unschedule, retry, remove, channel } = useStudio()

  const list = videos.filter((v) => status === 'all' || v.status === status)
  const taken = videos.flatMap((v) => (v.scheduledFor ? [v.scheduledFor] : []))
  
  const countOf = (f: Filter) =>
    f === 'all' ? videos.length : videos.filter((v) => v.status === f).length

  const handleManualShare = async (video: any) => {
    try {
      alert('Uploading video directly to YouTube. This will take a moment, please do not close this tab...')
      const response = await uploadToServerAction({ 
        data: { url: video.url, title: video.title } 
      })
      alert(`Success! Video manually published to channel. YouTube Video ID: ${response.youtubeId}`)
    } catch (error: any) {
      alert(`Upload failed: ${error?.message || 'Unknown Server Error'}`)
    }
  }

  return (
    <>
      <PageHeader eyebrow="Video library" title="Everything you've made">
        <Link to="/studio/create" className="btn-primary">
          <Plus className="size-4" /> New video
        </Link>
      </PageHeader>
      {/* Library filtering and video list mapping */}
    </>
  )
}
