import type { Album } from '@/lib/deezer'

import { useEffect } from 'react'
import { useAlbumRankingStore } from '@/stores/albumRankingStore'

import ContainerComponent from './ranking/ContainerComponent'

export default function AlbumMain({ album }: { album: Album }) {
  const { containers, dragged, init, moveItem, setDragged } = useAlbumRankingStore()

  useEffect(() => {
    init(album)
    return () => useAlbumRankingStore.getState().reset()
  }, [album.id])

  return (
    <main className="my-auto mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {containers.map((container) => (
        <ContainerComponent
          key={container.id}
          {...container}
          onDragStart={({ containerId, index }) => setDragged({ containerId, index })}
          onDrop={({ containerId, index }) => {
            if (!dragged) return
            moveItem(dragged, { containerId, index })
            setDragged(null)
          }}
        />
      ))}
    </main>
  )
}
