import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SortOptions = 'date-desc' | 'date-asc' | 'album' | 'artist' | 'rating'

type SortState = {
  sortBy: SortOptions
  setSortBy: (sortBy: SortOptions) => void
}

export const useHomeSortByStore = create<SortState>()(
  persist(
    (set) => ({
      sortBy: 'date-desc',
      setSortBy: (sortBy) => set({ sortBy })
    }),
    {
      name: 'home-sort-by'
    }
  )
)
