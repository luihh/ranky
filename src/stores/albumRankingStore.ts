import type { Container, Item, Slot } from '@/lib/dnd'
import type { Album } from '@/lib/deezer'
import { AlbumCollectionSchema, type AlbumCollection, type CustomTrack } from '@/schemas/album'

import { create } from 'zustand'
import { createPlaceholder, moveItem as moveItemFn } from '@/lib/dnd'
import { SafeStorage } from '@/lib/safeStorage'
import { setCustomAlbumTracks, addCustomTrackId } from '@/utils/customAlbum'

type RankingState = {
  containers: Container[]
  dragged: Item | null
  album: Album | null
  customTracks: CustomTrack[]

  init: (album: Album) => void
  moveItem: (source: Item, target: Item) => void
  applyRanking: (order: Slot[]) => void
  addTrack: (title: string) => void
  removeTrack: (id: number) => void
  renameTrack: (id: number, newTitle: string) => void
  updateAlbumInfo: (patch: Partial<Pick<Album, 'title' | 'cover'>> & { artist?: string }) => void
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
  customTracks: [],

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

      const customTracks: CustomTrack[] = album.tracks.map((t) => ({
        id: t.id as number,
        title: t.title
      }))

      return { containers, album, customTracks }
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

  addTrack: (title) =>
    set((state) => {
      const album = state.album
      if (!album || album.id >= 0) return state

      const trimmed = title.trim()
      if (!trimmed) return state

      const id = addCustomTrackId(state.customTracks)
      const nextTracks = [...state.customTracks, { id, title: trimmed }]
      const newSlot: Slot = { id, title: trimmed }
      const newPlaceholder: Slot = createPlaceholder()

      const containers = state.containers.map((c) => {
        if (c.id === 'tracklist') return { ...c, items: [...c.items, newSlot] }
        if (c.id === 'ranking') return { ...c, items: [...c.items, newPlaceholder] }
        return c
      })

      setCustomAlbumTracks(album.id, nextTracks)

      return { containers, customTracks: nextTracks }
    }),

  removeTrack: (id) =>
    set((state) => {
      const album = state.album
      if (!album || album.id >= 0) return state

      const nextTracks = state.customTracks.filter((t) => t.id !== id)

      const rankingContainer = state.containers.find((c) => c.id === 'ranking')!
      const trackIsInRanking = rankingContainer.items.some((item) => item.id === id)

      const containers = state.containers.map((c) => {
        if (c.id === 'tracklist') {
          if (trackIsInRanking) {
            const placeholderIndex = c.items.findIndex((item) => item.id === 'placeholder')
            if (placeholderIndex === -1) return c
            return {
              ...c,
              items: c.items.filter((_, i) => i !== placeholderIndex)
            }
          }

          return { ...c, items: c.items.filter((item) => item.id !== id) }
        }

        if (c.id === 'ranking') {
          if (trackIsInRanking) {
            return { ...c, items: c.items.filter((item) => item.id !== id) }
          }

          const placeholderIndex = c.items.findIndex((item) => item.id === 'placeholder')
          if (placeholderIndex === -1) return c
          return {
            ...c,
            items: c.items.filter((_, i) => i !== placeholderIndex)
          }
        }

        return c
      })

      const ranking = containers.find((c) => c.id === 'ranking')
      if (ranking) saveRanking(album, ranking.items)

      setCustomAlbumTracks(album.id, nextTracks)

      return { containers, customTracks: nextTracks }
    }),

  renameTrack: (id, newTitle) =>
    set((state) => {
      const album = state.album
      if (!album || album.id >= 0) return state

      const trimmed = newTitle.trim()
      if (!trimmed) return state

      const nextTracks = state.customTracks.map((t) => (t.id === id ? { ...t, title: trimmed } : t))

      const containers = state.containers.map((c) => ({
        ...c,
        items: c.items.map((item) => (item.id === id ? { ...item, title: trimmed } : item))
      }))

      const ranking = containers.find((c) => c.id === 'ranking')
      if (ranking) saveRanking(album, ranking.items)

      setCustomAlbumTracks(album.id, nextTracks)

      return { containers, customTracks: nextTracks }
    }),

  updateAlbumInfo: (patch) =>
    set((state) => {
      if (!state.album) return state

      return {
        album: {
          ...state.album,
          title: patch.title ?? state.album.title,
          cover: patch.cover ?? state.album.cover,
          artist: patch.artist ? { ...state.album.artist, name: patch.artist } : state.album.artist
        }
      }
    }),

  setDragged: (item) => set({ dragged: item }),

  reset: () => set({ containers: [], album: null, customTracks: [] })
}))
