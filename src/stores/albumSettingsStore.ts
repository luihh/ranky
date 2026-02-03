import { create } from 'zustand'
import { SafeStorage } from '@/lib/safeStorage'
import { AlbumCollectionSchema, type AlbumCollection, type AlbumSettings } from '@/schemas/album'

type LocalSettings = Record<number, AlbumSettings>

type SettingsState = {
  settings: LocalSettings
  hydrated: boolean
  hydrate: () => void
  setSettings: (albumId: number, next: AlbumSettings) => void
}

const getStorage = () => {
  if (typeof window === 'undefined') return null
  return new SafeStorage<AlbumCollection>('albumRankings', AlbumCollectionSchema)
}

export const useAlbumSettingsStore = create<SettingsState>((set, get) => ({
  settings: {},
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

    const settings: LocalSettings = {}
    for (const [id, album] of Object.entries(collection)) {
      if (album.settings) {
        settings[Number(id)] = album.settings
      }
    }

    set({ settings, hydrated: true })
  },

  setSettings(albumId, next) {
    set((state) => ({
      settings: {
        ...state.settings,
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
          settings: next
        }
      }
    })
  }
}))
