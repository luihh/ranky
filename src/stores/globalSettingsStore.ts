import type { AlbumSettings } from '@/schemas/album'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ScoringSystems = AlbumSettings['scoringSystem']

export type SettingsState = AlbumSettings & {
  setShowPlaceholdersOnScreenshot: (value: boolean) => void
  setScoringSystem: (value: ScoringSystems) => void
}

export const useGlobalSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      showPlaceholdersOnScreenshot: true,
      setShowPlaceholdersOnScreenshot: (showPlaceholdersOnScreenshot) =>
        set({ showPlaceholdersOnScreenshot }),

      scoringSystem: 0,
      setScoringSystem: (scoringSystem) => set({ scoringSystem })
    }),
    {
      name: 'global-settings'
    }
  )
)
