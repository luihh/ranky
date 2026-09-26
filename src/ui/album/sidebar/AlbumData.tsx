import type { Album } from '@/lib/deezer'

import { useRef, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  generateTheme,
  removeTheme,
  getImgColorPalette,
  rgbToHex,
  hexToRgb
} from '@/utils/generateTheme'
import { updateCustomAlbumInfo } from '@/utils/customAlbum'
import useAlbumColors from '@/hooks/useAlbumColors'
import { Pencil } from 'lucide-react'

type Props = {
  album: Album
  openCoverDialog?: () => void
  onUpdate?: (patch: Partial<Pick<Album, 'title' | 'cover'>> & { artist?: string }) => void
}

export default function AlbumData({ album, openCoverDialog, onUpdate }: Props) {
  const { colors, commitColors, setSavedColor } = useAlbumColors(album.id)
  const isCustom = album.id < 0

  const imgRef = useRef<HTMLImageElement>(null)
  const prevCoverRef = useRef(album.cover)

  const [title, setTitle] = useState(album.title)
  const [artistName, setArtistName] = useState(album.artist.name)

  useEffect(() => {
    setTitle(album.title)
    setArtistName(album.artist.name)
  }, [album.id])

  useEffect(() => {
    const coverChanged = prevCoverRef.current !== album.cover
    prevCoverRef.current = album.cover

    if (isCustom && coverChanged && colors.savedColor !== '') {
      setSavedColor('')
      return
    }

    if (colors.savedColor !== '') {
      generateTheme(hexToRgb(colors.savedColor))
      return
    }

    const img = imgRef.current
    if (!img) return

    let cancelled = false

    const handleImgLoad = async () => {
      const palette = await getImgColorPalette(img)
      if (cancelled || !palette) return

      generateTheme(palette)

      const base = rgbToHex(palette)
      commitColors(base)
    }

    if (img.complete) handleImgLoad()
    else img.addEventListener('load', handleImgLoad)

    return () => {
      cancelled = true
      img?.removeEventListener('load', handleImgLoad)
      removeTheme()
    }
  }, [colors.savedColor, album.cover])

  function commitTitle() {
    const trimmed = title.trim() || 'Untitled Album'
    setTitle(trimmed)
    if (!isCustom) return
    updateCustomAlbumInfo(album.id, { title: trimmed })
    onUpdate?.({ title: trimmed })
  }

  function commitArtist() {
    const trimmed = artistName.trim() || 'Unknown Artist'
    setArtistName(trimmed)
    if (!isCustom) return
    updateCustomAlbumInfo(album.id, { artist: trimmed })
    onUpdate?.({ artist: trimmed })
  }

  if (isCustom) {
    return (
      <div className="flex flex-col items-center w-full">
        <a
          onClick={openCoverDialog}
          className="relative group border-none p-0 bg-transparent cursor-pointer"
        >
          <img
            ref={imgRef}
            src={album.cover || '/img/ranky-logo.png'}
            alt={`${title} cover`}
            draggable={false}
            className="size-60 rounded-2xl mb-2 shadow-md select-none object-cover"
            crossOrigin="anonymous"
          />
          <span className="absolute inset-0 mb-2 flex items-center justify-center rounded-2xl bg-black/0 opacity-0 group-hover:bg-black/40 group-hover:opacity-100 transition">
            <Pencil className="text-white" size={24} />
          </span>
        </a>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commitTitle}
          placeholder="Album title"
          className="text-2xl font-bold text-balance text-center bg-transparent border-none outline-none focus:underline w-full"
        />
        <input
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          onBlur={commitArtist}
          placeholder="Artist name"
          className="text-xl font-bold text-balance text-center opacity-80 bg-transparent border-none outline-none focus:underline w-full"
        />
      </div>
    )
  }

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
      <Link to="/artist/$artistId" params={{ artistId: String(album.artist.id) }} draggable={false}>
        <h2 className="text-xl font-bold text-balance opacity-80 hover:underline">
          {album.artist.name}
        </h2>
      </Link>
    </div>
  )
}
