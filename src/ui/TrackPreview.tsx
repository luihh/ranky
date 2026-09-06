import { useEffect, useRef, useState } from 'react'
import { useTrackPreviewStore } from '@/stores/trackPreviewStore'
import { Play, Pause } from 'lucide-react'

type Props = {
  id: number | 'placeholder'
  preview?: string
}

export default function TrackPreview({ id, preview }: Props) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playingId = useTrackPreviewStore((s) => s.playingId)
  const setPlayingId = useTrackPreviewStore((s) => s.setPlayingId)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5
    }
  }, [])

  useEffect(() => {
    if (typeof id === 'number' && playingId !== id && audioRef.current) {
      audioRef.current.pause()
    }
  }, [playingId, id])

  function togglePreview() {
    if (!audioRef.current || id === 'placeholder') return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      setPlayingId(id)
    }
  }

  if (!preview) return null

  return (
    <>
      <button
        type="button"
        draggable={false}
        onClick={(e) => {
          e.stopPropagation()
          togglePreview()
        }}
        className="px-2! rounded-full!"
        aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
      >
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
      <audio
        ref={audioRef}
        src={preview}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          setIsPlaying(false)
          if (playingId === id) setPlayingId(null)
        }}
        onEnded={() => {
          setIsPlaying(false)
          if (playingId === id) setPlayingId(null)
        }}
      />
    </>
  )
}
