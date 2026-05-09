import type { Container, Item, Slot } from '@/lib/dnd'
import type { Album } from '@/lib/deezer'
import { create } from 'zustand'
import { createPlaceholder, moveItem as moveItemFn } from '@/lib/dnd'

export type RankingData = {
  tracks: {
    name: string
    slotIndex: number
  }[]
  rating?: number
  notes?: string
  color?: string
}

type RankingStore = {
  containers: Container[]
  dragged: Item | null
  album: Album | null
  rating?: number
  notes?: string
  color?: string

  savedSnapshot: RankingData | null
  isDirty: boolean

  init: (album: Album, saved: RankingData | null) => void
  moveItem: (source: Item, target: Item) => void
  setDragged: (item: Item | null) => void

  setRating: (rating: number) => void
  setNotes: (notes: string) => void
  setColor: (color: string) => void

  reset: () => void
  markSaved: () => void
  getCurrentData: () => RankingData
}

function buildContainers(album: Album, saved: RankingData | null): Container[] {
  const rankingItems: Slot[] = album.tracks.map(() => createPlaceholder())
  const tracklistItems: Slot[] = [...album.tracks]

  if (saved?.tracks?.length) {
    saved.tracks.forEach(({ name, slotIndex }) => {
      const trackIndex = tracklistItems.findIndex((t) => t.title === name)
      if (trackIndex === -1) return

      const track = tracklistItems[trackIndex]
      tracklistItems[trackIndex] = createPlaceholder()
      rankingItems[slotIndex] = track
    })
  }

  return [
    { id: 'ranking', title: 'Ranking', items: rankingItems },
    { id: 'tracklist', title: 'Tracklist', items: tracklistItems }
  ]
}

function getTracksFromContainers(containers: Container[]) {
  const ranking = containers.find((c) => c.id === 'ranking')
  return (
    ranking?.items
      .map((track, i) => (track.title ? { name: track.title, slotIndex: i } : null))
      .filter(Boolean) ?? []
  )
}

function snapshotEqual(a: RankingData | null, b: RankingData): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export const useRankingStore = create<RankingStore>((set, get) => ({
  containers: [],
  dragged: null,
  album: null,
  rating: undefined,
  notes: undefined,
  color: undefined,
  savedSnapshot: null,
  isDirty: false,

  init(album, saved) {
    const containers = buildContainers(album, saved)
    const snapshot: RankingData = {
      tracks: saved?.tracks ?? [],
      rating: saved?.rating,
      notes: saved?.notes,
      color: saved?.color
    }

    set({
      containers,
      album,
      rating: saved?.rating,
      notes: saved?.notes,
      color: saved?.color,
      savedSnapshot: snapshot,
      isDirty: false
    })
  },

  moveItem(source, target) {
    set((state) => {
      const containers = moveItemFn(state.containers, source, target)
      const current = get().getCurrentData()
      current.tracks = getTracksFromContainers(containers) as RankingData['tracks']
      return {
        containers,
        isDirty: !snapshotEqual(state.savedSnapshot, current)
      }
    })
  },

  setDragged: (item) => set({ dragged: item }),

  setRating(rating) {
    set((state) => {
      const current = { ...get().getCurrentData(), rating }
      return { rating, isDirty: !snapshotEqual(state.savedSnapshot, current) }
    })
  },

  setNotes(notes) {
    set((state) => {
      const current = { ...get().getCurrentData(), notes }
      return { notes, isDirty: !snapshotEqual(state.savedSnapshot, current) }
    })
  },

  setColor(color) {
    set((state) => {
      const current = { ...get().getCurrentData(), color }
      return { color, isDirty: !snapshotEqual(state.savedSnapshot, current) }
    })
  },

  getCurrentData(): RankingData {
    const state = get()
    return {
      tracks: getTracksFromContainers(state.containers) as RankingData['tracks'],
      rating: state.rating,
      notes: state.notes,
      color: state.color
    }
  },

  markSaved() {
    const current = get().getCurrentData()
    set({ savedSnapshot: current, isDirty: false })
  },

  reset() {
    const { album, savedSnapshot } = get()
    if (!album) return

    const containers = buildContainers(album, savedSnapshot)
    set({
      containers,
      rating: savedSnapshot?.rating,
      notes: savedSnapshot?.notes,
      color: savedSnapshot?.color,
      isDirty: false
    })
  }
}))
