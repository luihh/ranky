import type { Container, Slot } from '@/lib/dnd'

import { useState } from 'react'
import { useAlbumRankingStore } from '@/stores/albumRankingStore'
import { useTrackPreviewStore } from '@/stores/trackPreviewStore'
import TrackPreview from '@/ui/TrackPreview'
import { X } from 'lucide-react'
import clsx from 'clsx'

export default function TrackSlot({
  id,
  title,
  preview,
  index,
  containerId,
  isCustom,
  onDragStart,
  onDrop
}: Slot & {
  preview?: string
  index: number
  containerId: Container['id']
  isCustom: boolean
  onDragStart: () => void
  onDrop: () => void
}) {
  const [isOver, setIsOver] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [draftTitle, setDraftTitle] = useState(title)

  const playingId = useTrackPreviewStore((s) => s.playingId)
  const openId = useTrackPreviewStore((s) => s.openId)
  const setOpenId = useTrackPreviewStore((s) => s.setOpenId)

  const removeTrack = useAlbumRankingStore((s) => s.removeTrack)
  const renameTrack = useAlbumRankingStore((s) => s.renameTrack)

  const isOpen = typeof id === 'number' && openId === id
  const isPlaying = typeof id === 'number' && playingId === id
  const previewOpen = isPlaying || isOpen

  const isPlaceholder = id === 'placeholder'
  const editable = isCustom && !isPlaceholder

  function commitRename() {
    setIsEditing(false)

    const trimmed = draftTitle.trim()
    if (!trimmed || trimmed === title || typeof id !== 'number') {
      setDraftTitle(title)
      return
    }

    renameTrack(id, trimmed)
  }

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
          if (id === 'placeholder' || (!isCustom && !preview)) return
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
            {isEditing ? (
              <input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => e.key === 'Enter' && commitRename()}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                className="flex-1 min-w-0 bg-transparent border-none outline-none underline"
              ></input>
            ) : (
              <span
                className="flex-1 min-w-0 truncate select-none"
                onDoubleClick={(e) => {
                  if (!editable) return
                  e.stopPropagation()
                  setDraftTitle(title)
                  setIsEditing(true)
                }}
              >
                {title}
              </span>
            )}

            {preview && (
              <div
                className={clsx(
                  'shrink-0 transition-all duration-200 ease-out flex items-center justify-center',
                  previewOpen
                    ? 'w-8 opacity-100'
                    : 'w-0 opacity-0 group-hover:w-8 group-hover:opacity-100'
                )}
              >
                <TrackPreview id={id} preview={preview} />
              </div>
            )}

            {editable && !isEditing && (
              <div
                className={clsx(
                  'shrink-0 transition-all duration-200 ease-out flex items-center justify-center',
                  previewOpen
                    ? 'w-8 opacity-100'
                    : 'w-0 opacity-0 group-hover:w-8 group-hover:opacity-100'
                )}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (typeof id === 'number') removeTrack(id)
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}
