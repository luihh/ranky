import type { Container, Slot } from '@/lib/dnd'

import { useState } from 'react'
import clsx from 'clsx'

export default function TrackSlot({
  id,
  title,
  index,
  containerId,
  onDragStart,
  onDrop
}: Slot & {
  index: number
  containerId: Container['id']
  onDragStart: () => void
  onDrop: () => void
}) {
  const [isOver, setIsOver] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  return (
    <li className="flex flex-row">
      {containerId === 'ranking' ? (
        <span className="size-12 bg-surface min-w-12 flex justify-center items-center text-xl font-bold border rounded-l-xl">
          {index + 1}
        </span>
      ) : null}
      <div
        className={clsx(
          'h-12 w-full border',
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
      >
        <div
          className={clsx(
            'size-full bg-surface flex justify-center items-center text-center',
            containerId === 'ranking' && 'rounded-r-xl',
            containerId === 'tracklist' && 'rounded-xl'
          )}
        >
          <span className="p-4 w-80 truncate select-none">{title}</span>
        </div>
      </div>
    </li>
  )
}
