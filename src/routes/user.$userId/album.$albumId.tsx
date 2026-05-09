import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getAlbum } from '@/lib/deezer'
import { useEffect, useRef, useState } from 'react'
import { useRankingStore } from '@/stores/rankingStore'
import { authClient } from '@/lib/auth/client'
import {
  generateTheme,
  getImgColorPalette,
  removeTheme,
  rgbToHex,
  hexToRgb
} from '@/utils/generateTheme'
import { snapdom } from '@zumer/snapdom'
import Nav from '@/ui/album/Nav'
import Sidebar from '@/ui/album/Sidebar'
import Main from '@/ui/album/Main'
import ScreenshotComponent from '@/ui/album/ScreenshotComponent'
import UnsavedBar from '@/ui/album/UnsavedBar'
import type { RankingData } from '@/stores/rankingStore'

type BackendRanking = {
  id: number
  albumId: string
  userId: string
  title: string
  artist: string
  cover: string
  rating: number | null
  notes: string | null
  color: string | null
  tracks: { name: string; slotIndex: number }[]
  user: { name: string; image: string | null }
}

const fetchAlbumFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { albumId: number }) => data)
  .handler(({ data }) => getAlbum(data.albumId))

const fetchRankingFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string; albumId: string }) => data)
  .handler(async ({ data }) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user/${data.userId}/album/${data.albumId}`
    )
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to fetch ranking')
    return res.json() as Promise<BackendRanking>
  })

export const Route = createFileRoute('/user/$userId/album/$albumId')({
  component: RouteComponent,
  errorComponent: () => <p>An error has occurred!</p>,
  notFoundComponent: () => <p>Not found</p>,
  pendingComponent: () => <p>Loading...</p>,
  loader: async ({ params }) => {
    const albumId = Number(params.albumId)
    if (Number.isNaN(albumId)) throw notFound()

    const [album, ranking] = await Promise.all([
      fetchAlbumFn({ data: { albumId } }),
      fetchRankingFn({ data: { userId: params.userId, albumId: params.albumId } })
    ])

    if (!album) throw notFound()

    return { album, ranking }
  }
})

function RouteComponent() {
  const { album, ranking } = Route.useLoaderData()
  const { userId } = Route.useParams()
  const { data: session } = authClient.useSession()
  const isOwner = session?.user?.discordId === userId

  const { init, setColor } = useRankingStore()
  const screenshotRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [settingsVisible, setSettingsVisible] = useState(false)

  const savedData: RankingData | null = ranking
    ? {
        tracks: ranking.tracks,
        rating: ranking.rating ?? undefined,
        notes: ranking.notes ?? undefined,
        color: ranking.color ?? undefined
      }
    : null

  useEffect(() => {
    init(album, savedData)
    return () => useRankingStore.getState().reset()
  }, [album.id])

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const handleLoad = async () => {
      if (savedData?.color) {
        generateTheme(hexToRgb(savedData.color))
        return
      }
      const palette = await getImgColorPalette(img)
      if (!palette) return
      generateTheme(palette)
      if (isOwner) setColor(rgbToHex(palette))
    }

    if (img.complete) handleLoad()
    else img.addEventListener('load', handleLoad)

    return () => {
      img.removeEventListener('load', handleLoad)
      removeTheme()
    }
  }, [])

  async function downloadScreenshot() {
    if (!screenshotRef.current) return
    await document.fonts.ready
    const image = await snapdom(screenshotRef.current, { backgroundColor: 'transparent' })
    image.download({ filename: `${album.title} - ${album.artist.name} ranking.png` })
  }

  const albumData = {
    albumId: String(album.id),
    title: album.title,
    artist: album.artist.name,
    cover: album.cover
  }

  return (
    <>
      <Nav
        size={18}
        settingsVisible={settingsVisible}
        setSettingsVisible={isOwner ? setSettingsVisible : () => {}}
      />

      <div className="absolute -top-2499.75" aria-hidden ref={screenshotRef}>
        <ScreenshotComponent album={album} />
      </div>

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[35vw_1fr]">
        <Sidebar
          album={album}
          imgRef={imgRef}
          downloadScreenshot={downloadScreenshot}
          readOnly={!isOwner}
          owner={
            !isOwner && ranking
              ? {
                  id: userId,
                  name: ranking.user.name,
                  image: ranking.user.image
                }
              : undefined
          }
        />
        <Main readOnly={!isOwner} />
      </div>

      {isOwner && <UnsavedBar rankingId={ranking?.id ?? null} albumData={albumData} />}
    </>
  )
}
