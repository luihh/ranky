import type { Container, Item } from '@/lib/dnd'

import TrackSlot from './TrackSlot'

export default function ContainerComponent({
  id,
  title,
  items,
  readOnly,
  onDragStart,
  onDrop
}: Container & {
  readOnly: boolean
  onDragStart: (item: Item) => void
  onDrop: (item: Item) => void
}) {
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
            readOnly={readOnly}
            onDragStart={() => onDragStart({ containerId: id, index })}
            onDrop={() => onDrop({ containerId: id, index })}
          />
        ))}
      </ul>
    </div>
  )
}
