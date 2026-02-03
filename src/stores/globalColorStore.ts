import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ColorState = {
  color: string
  defaultColor: string
  setColor: (color: string) => void
}

export const useGlobalColorStore = create<ColorState>()(
  persist(
    (set) => ({
      color: '#606060',
      defaultColor: '#606060',
      setColor: (color) => set({ color })
    }),
    {
      name: 'global-theme-color'
    }
  )
)
