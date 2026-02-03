import type { Album } from '@/lib/deezer'

import { useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  generateTheme,
  removeTheme,
  getImgColorPalette,
  rgbToHex,
  hexToRgb
} from '@/utils/generateTheme'
import useAlbumColors from '@/utils/useAlbumColors'

export default function AlbumData({ album }: { album: Album }) {
  const { colors, commitColors } = useAlbumColors(album.id)

  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (colors.savedColor !== '') {
      generateTheme(hexToRgb(colors.savedColor))
      return
    }

    const img = imgRef.current
    if (!img) return

    const handleImgLoad = async () => {
      const palette = await getImgColorPalette(img)
      if (!palette) return

      generateTheme(palette)

      const base = rgbToHex(palette)
      commitColors(base)
    }

    if (img.complete) handleImgLoad()
    else img.addEventListener('load', handleImgLoad)

    return () => {
      img?.removeEventListener('load', handleImgLoad)
      removeTheme()
    }
  }, [colors.savedColor])

  return (
    <div className="flex flex-col items-center w-full">
      <img
        ref={imgRef}
        src={album.cover}
        alt={`${album.title} cover`}
        draggable={false}
        className="size-60 rounded-2xl mb-2 shadow-md select-none"
        crossOrigin="anonymous"
      />
      <h1 className="text-2xl font-bold text-balance">{album.title}</h1>
      <Link to="/artist/$artistId" params={{ artistId: String(album.artist.id) }}>
        <h2 className="text-xl font-bold text-balance opacity-80 hover:underline">
          {album.artist.name}
        </h2>
      </Link>
    </div>
  )
}
