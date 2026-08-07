import type { Album } from '@/lib/deezer'
import { useGlobalColorStore } from '@/stores/globalColorStore'
import { generateTheme, hexToRgb } from '@/utils/generateTheme'
import useAlbumColors from '@/hooks/useAlbumColors'

import Section from '@/ui/Section'
import ColorPicker from '@/ui/ColorPicker'

export default function ThemeSection({ album }: { album: Album }) {
  const { colors, setSavedColor } = useAlbumColors(album.id)
  const setGlobalColor = useGlobalColorStore((s) => s.setColor)

  function handleColorPicker(c: string) {
    const base = hexToRgb(c)
    generateTheme(base)
    setSavedColor(c)
  }

  return (
    <Section title="Theme">
      {colors.savedColor && (
        <ColorPicker
          color={colors.savedColor}
          onChange={handleColorPicker}
          reset={() => handleColorPicker(colors.initialColor)}
        />
      )}
      <button onClick={() => setGlobalColor(colors.savedColor)}>Set as global theme</button>
    </Section>
  )
}
