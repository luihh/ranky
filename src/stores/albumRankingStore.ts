import type { Container, Item, Slot } from '@/lib/dnd'
import type { Album } from '@/lib/deezer'
import { AlbumCollectionSchema, type AlbumCollection } from '@/schemas/album'

import { create } from 'zustand'
import { createPlaceholder, moveItem as moveItemFn } from '@/lib/dnd'
import { SafeStorage } from '@/lib/safeStorage'

type RankingState = {
  containers: Container[]
  dragged: Item | null
  album: Album | null

  init: (album: Album) => void
  moveItem: (source: Item, target: Item) => void
  applyRanking: (order: Slot[]) => void
  setDragged: (item: Item | null) => void
  reset: () => void
}

const albumStore = new SafeStorage<AlbumCollection>('albumRankings', AlbumCollectionSchema)

function saveRanking(album: Album, rankingItems: Slot[]) {
  albumStore.update((prev) => {
    const collection = prev ?? {}
    const albumData = collection[album.id]

    return {
      ...collection,
      [album.id]: {
        ...albumData,
        id: String(album.id),
        album: album.title,
        artist: album.artist.name,
        cover: album.cover,
        timestamp: Date.now(),
        tracks: rankingItems
          .map((track, i) => (track.title ? { name: track.title, slotIndex: i } : null))
          .filter(Boolean)
      }
    }
  })
}

export const useAlbumRankingStore = create<RankingState>((set) => ({
  containers: [],
  dragged: null,
  album: null,

  init: (album) =>
    set(() => {
      const stored = albumStore.get()
      const rankingItems: Slot[] = album.tracks.map(() => createPlaceholder())
      const tracklistItems: Slot[] = [...album.tracks]

      const containers = [
        {
          id: 'ranking',
          title: 'Ranking',
          items: rankingItems
        },
        {
          id: 'tracklist',
          title: 'Tracklist',
          items: tracklistItems
        }
      ]

      const savedTracks = stored?.[album.id]?.tracks
      if (savedTracks?.length) {
        savedTracks.forEach(({ name, slotIndex }) => {
          const trackIndex = tracklistItems.findIndex((t) => t.title === name)
          if (trackIndex === -1) return

          const track = tracklistItems[trackIndex]

          tracklistItems[trackIndex] = createPlaceholder()
          rankingItems[slotIndex] = track
        })
      }

      return { containers, album }
    }),

  moveItem: (source, target) =>
    set((state) => {
      const album = state.album
      if (!album) return state

      const containers = moveItemFn(state.containers, source, target)

      const ranking = containers.find((c) => c.id === 'ranking')
      if (!ranking) return { containers }

      saveRanking(album, ranking.items)

      return { containers }
    }),

  applyRanking: (order) =>
    set((state) => {
      const album = state.album
      if (!album) return state

      const rankingItems: Slot[] = order
      const tracklistItems: Slot[] = album.tracks.map(() => createPlaceholder())

      const containers = state.containers.map((c) => {
        if (c.id === 'ranking') return { ...c, items: rankingItems }
        if (c.id === 'tracklist') return { ...c, items: tracklistItems }
        return c
      })

      saveRanking(album, rankingItems)

      return { containers }
    }),

  setDragged: (item) => set({ dragged: item }),

  reset: () => set({ containers: [], album: null })
}))
