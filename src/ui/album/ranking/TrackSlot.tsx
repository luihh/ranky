import type { Container, Slot } from '@/lib/dnd'

import { useEffect, useRef, useState } from 'react'
import { useTrackPreviewStore } from '@/stores/trackPreviewStore'
import { Play, Pause } from 'lucide-react'
import clsx from 'clsx'

export default function TrackSlot({
  id,
  title,
  preview,
  index,
  containerId,
  onDragStart,
  onDrop
}: Slot & {
  preview?: string
  index: number
  containerId: Container['id']
  onDragStart: () => void
  onDrop: () => void
}) {
  const [isOver, setIsOver] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playingId = useTrackPreviewStore((s) => s.playingId)
  const openId = useTrackPreviewStore((s) => s.openId)
  const setPlayingId = useTrackPreviewStore((s) => s.setPlayingId)
  const setOpenId = useTrackPreviewStore((s) => s.setOpenId)

  useEffect(() => {
    if (typeof id === 'number' && playingId !== id && audioRef.current) {
      audioRef.current.pause()
    }
  }, [playingId, id])

  const togglePreview = () => {
    if (!audioRef.current || id === 'placeholder') return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      setPlayingId(id)
    }
  }

  const isOpen = typeof id === 'number' && openId === id
  const previewOpen = isPlaying || isOpen

  return (
    <li className="flex flex-row">
      {containerId === 'ranking' ? (
        <span className="size-12 bg-surface min-w-12 flex justify-center items-center text-xl font-bold border rounded-l-xl">
          {index + 1}
        </span>
      ) : null}
      <div
        className={clsx(
          'group h-12 w-full border',
          id === 'placeholder' ? 'border border-dashed opacity-80' : 'bg-surface cursor-grab',
          containerId === 'ranking' && 'rounded-r-xl w-[calc(100%-var(--spacing)*12)]!',
          containerId === 'tracklist' && 'rounded-xl',
          isOver && 'border-2 border-dashed',
          isDragging && 'opacity-60'
        )}
        draggable={id !== 'placeholder'}
        onDragStart={() => {
          setIsDragging(true)
          onDragStart()
        }}
        onDragEnd={() => {
          setIsDragging(false)
          setIsOver(false)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsOver(true)
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={() => {
          setIsOver(false)
          onDrop()
        }}
        onClick={() => {
          if (id === 'placeholder' || !preview) return
          setOpenId(isOpen ? null : id)
        }}
      >
        <div
          className={clsx(
            'size-full bg-surface flex justify-center items-center text-center',
            containerId === 'ranking' && 'rounded-r-xl',
            containerId === 'tracklist' && 'rounded-xl'
          )}
        >
          <div className="flex items-center w-80 px-4">
            <span className="flex-1 min-w-0 truncate select-none">{title}</span>

            {preview ? (
              <>
                <div
                  className={clsx(
                    'shrink-0 transition-all duration-200 ease-out flex items-center justify-center',
                    previewOpen
                      ? 'w-8 opacity-100'
                      : 'w-0 opacity-0 group-hover:w-8 group-hover:opacity-100'
                  )}
                >
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
                </div>
                <audio
                  ref={audioRef}
                  src={preview}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => {
                    setIsPlaying(false)
                    if (playingId === id) setPlayingId(null)
                  }}
                  onEnded={() => setIsPlaying(false)}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  )
}
