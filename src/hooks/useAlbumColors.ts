import type { AlbumColors } from '@/schemas/album'
import { useAlbumColorStore } from '@/stores/albumColorStore'
import { useEffect } from 'react'

export default function useAlbumColors(albumId: number) {
  const { hydrate, setColors } = useAlbumColorStore()
  const stored = useAlbumColorStore((s) => s.colors[albumId])

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const colors: AlbumColors = {
    savedColor: stored?.savedColor ?? '',
    initialColor: stored?.initialColor ?? ''
  }

  return {
    colors,
    setSavedColor: (savedColor: string) => setColors(albumId, { ...colors, savedColor }),
    commitColors: (color: string) => setColors(albumId, { savedColor: color, initialColor: color })
  }
}
