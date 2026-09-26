import type { Container, Item } from '@/lib/dnd'
import { useAlbumRankingStore } from '@/stores/albumRankingStore'
import { useState } from 'react'

import TrackSlot from './TrackSlot'
import { Plus } from 'lucide-react'

export default function ContainerComponent({
  id,
  title,
  items,
  isCustom,
  onDragStart,
  onDrop
}: Container & {
  isCustom: boolean
  onDragStart: (item: Item) => void
  onDrop: (item: Item) => void
}) {
  const addTrack = useAlbumRankingStore((s) => s.addTrack)
  const [newTrackTitle, setNewTrackTitle] = useState('')

  const canAddHere = isCustom && id === 'tracklist'

  function handleAdd() {
    const trimmed = newTrackTitle.trim()
    if (!trimmed) return
    addTrack(trimmed)
    setNewTrackTitle('')
  }

  return (
    <div key={id} id={id} className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold opacity-75 text-center">{title}</h1>
      <ul className="flex flex-col gap-2 justify-center select-none">
        {items.map((item, index) => (
          <TrackSlot
            key={`${item.id}-${index}`}
            {...item}
            index={index}
            containerId={id}
            isCustom={isCustom}
            onDragStart={() => onDragStart({ containerId: id, index })}
            onDrop={() => onDrop({ containerId: id, index })}
          />
        ))}
      </ul>

      {canAddHere && (
        <div className="flex gap-2 mt-2">
          <input
            value={newTrackTitle}
            onChange={(e) => setNewTrackTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Track title"
            className="flex-1 min-w-0 rounded-lg border px-4 py-2 resize-none bg-surface text-sm"
          />
          <button onClick={handleAdd} disabled={!newTrackTitle.trim()} aria-label="Add track">
            <Plus size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
