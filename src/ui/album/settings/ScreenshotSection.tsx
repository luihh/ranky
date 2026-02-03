import type { Album } from '@/lib/deezer'
import { SafeStorage } from '@/lib/safeStorage'
import { AlbumCollection, AlbumCollectionSchema, AlbumSettings } from '@/schemas/album'
import { SETTINGS_SHOWCASE_SCREENSHOTS } from '@/consts'
import useAlbumSettings from '@/utils/useAlbumSettings'

import Section from '@/ui/Section'
import Switch from '@/ui/Switch'

export default function ScreenshotSection({ album }: { album: Album }) {
  const { settings, setSettings } = useAlbumSettings(album.id)

  const albumStore = new SafeStorage<AlbumCollection>('albumRankings', AlbumCollectionSchema)
  const stored = albumStore.get()?.[album.id]

  function toggle() {
    const next: AlbumSettings = {
      ...settings,
      showPlaceholdersOnScreenshot: !settings.showPlaceholdersOnScreenshot
    }

    setSettings(next)
  }

  const screenshot = settings.showPlaceholdersOnScreenshot
    ? SETTINGS_SHOWCASE_SCREENSHOTS.showPlaceholdersOnScreenshot[0]
    : SETTINGS_SHOWCASE_SCREENSHOTS.showPlaceholdersOnScreenshot[1]

  return (
    <Section title="Screenshot">
      <Switch
        label="Show placeholders in screenshot"
        checked={settings.showPlaceholdersOnScreenshot}
        disabled={stored === undefined}
        onChange={toggle}
      />

      {screenshot && (
        <img
          src={screenshot}
          draggable={false}
          className="mt-4 size-full object-cover rounded-lg select-none"
        />
      )}
    </Section>
  )
}
