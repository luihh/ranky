import { useRankingStore } from '@/stores/rankingStore'
import ContainerComponent from './ranking/ContainerComponent'

export default function AlbumMain({ readOnly }: { readOnly: boolean }) {
  const { containers, dragged, moveItem, setDragged } = useRankingStore()

  return (
    <main className="my-auto mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {containers.map((container) => (
        <ContainerComponent
          key={container.id}
          {...container}
          readOnly={readOnly}
          onDragStart={({ containerId, index }) => !readOnly && setDragged({ containerId, index })}
          onDrop={({ containerId, index }) => {
            if (readOnly || !dragged) return
            moveItem(dragged, { containerId, index })
            setDragged(null)
          }}
        />
      ))}
    </main>
  )
}
