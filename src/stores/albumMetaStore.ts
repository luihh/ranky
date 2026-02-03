import { create } from 'zustand'
import { SafeStorage } from '@/lib/safeStorage'
import { AlbumCollectionSchema, type AlbumCollection } from '@/schemas/album'

export type AlbumMeta = {
  notes?: string
  rating?: number
}

type LocalMeta = Record<number, AlbumMeta>

type MetaState = {
  meta: LocalMeta
  hydrated: boolean
  hydrate: () => void
  setNotes: (albumId: number, notes: string) => void
  setRating: (albumId: number, rating?: number) => void
}

const getStorage = () => {
  if (typeof window === 'undefined') return null
  return new SafeStorage<AlbumCollection>('albumRankings', AlbumCollectionSchema)
}

export const useAlbumMetaStore = create<MetaState>((set, get) => ({
  meta: {},
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

    const meta: LocalMeta = {}
    for (const [id, album] of Object.entries(collection)) {
      meta[Number(id)] = {
        notes: album.notes,
        rating: album.rating
      }
    }

    set({ meta, hydrated: true })
  },

  setNotes(albumId, notes) {
    set((state) => ({
      meta: {
        ...state.meta,
        [albumId]: {
          ...state.meta[albumId],
          notes
        }
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
          notes
        }
      }
    })
  },

  setRating(albumId, rating) {
    set((state) => ({
      meta: {
        ...state.meta,
        [albumId]: {
          ...state.meta[albumId],
          rating
        }
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
          rating
        }
      }
    })
  }
}))
