import { create } from 'zustand'
import { SafeStorage } from '@/lib/safeStorage'
import { AlbumCollectionSchema, type AlbumCollection, type AlbumColors } from '@/schemas/album'

type LocalColors = Record<number, AlbumColors>

type ColorState = {
  colors: LocalColors
  hydrated: boolean
  hydrate: () => void
  setColors: (albumId: number, next: AlbumColors) => void
}

const getStorage = () => {
  if (typeof window === 'undefined') return null
  return new SafeStorage<AlbumCollection>('albumRankings', AlbumCollectionSchema)
}

export const useAlbumColorStore = create<ColorState>((set, get) => ({
  colors: {},
  hydrated: false,

  hydrate() {
    if (get().hydrated) return

    const storage = getStorage()
    if (!storage) return

    const collection = storage.get()
    if (!collection) {
      set({ hydrated: true })
      return
    }

    const colors: LocalColors = {}
    for (const [id, album] of Object.entries(collection)) {
      if (album.colors) {
        colors[Number(id)] = album.colors
      }
    }

    set({ colors, hydrated: true })
  },

  setColors(albumId, next) {
    set((state) => ({
      colors: {
        ...state.colors,
        [albumId]: next
      }
    }))

    const storage = getStorage()
    if (!storage || !storage.get()?.[albumId]) return

    storage.update((prev) => {
      const collection = prev ?? {}
      return {
        ...collection,
        [albumId]: {
          ...collection[albumId],
          timestamp: Date.now(),
          colors: next
        }
      }
    })
  }
}))
