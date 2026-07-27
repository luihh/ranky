import type { AlbumSettings } from '@/schemas/album'
import { useAlbumSettingsStore } from '@/stores/albumSettingsStore'
import { useGlobalSettingsStore } from '@/stores/globalSettingsStore'
import { useEffect } from 'react'

export default function useAlbumSettings(albumId: number) {
  const global = useGlobalSettingsStore()

  const { hydrate, setSettings } = useAlbumSettingsStore()
  const stored = useAlbumSettingsStore((s) => s.settings[albumId])

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const settings: AlbumSettings = {
    showPlaceholdersOnScreenshot:
      stored?.showPlaceholdersOnScreenshot ?? global.showPlaceholdersOnScreenshot,
    scoringSystem: stored?.scoringSystem ?? global.scoringSystem
  }

  return { settings, setSettings: (next: AlbumSettings) => setSettings(albumId, next) }
}
