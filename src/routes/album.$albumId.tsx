import { useEffect, useRef, useState } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { queryOptions } from '@tanstack/react-query'
import { getAlbum } from '@/lib/deezer'
import { getCustomAlbum } from '@/utils/customAlbum'
import { snapdom } from '@zumer/snapdom'
import { downloadBlob } from '@/utils/downloadImage'
import { useAlbumRankingStore } from '@/stores/albumRankingStore'

import Nav from '@/ui/album/Nav'
import SettingsDialog from '@/ui/album/settings/SettingsDialog'
import SmartRankDialog from '@/ui/album/smartRank/SmartRankDialog'
import CoverDialog from '@/ui/album/sidebar/CoverDialog'
import Sidebar from '@/ui/album/Sidebar'
import Main from '@/ui/album/Main'
import ScreenshotComponent from '@/ui/album/ScreenshotComponent'

const albumFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { albumId: number }) => data)
  .handler(async ({ data }) => {
    return await getAlbum(data.albumId)
  })

const albumQuery = (albumId: number) =>
  queryOptions({
    queryKey: ['album', albumId],
    queryFn: () => albumFn({ data: { albumId } }),
    staleTime: 1000 * 60 * 5
  })

export const Route = createFileRoute('/album/$albumId')({
  component: RouteComponent,
  errorComponent: () => <p>An error has ocurred!</p>,
  notFoundComponent: () => <p>Album not found</p>,
  pendingComponent: () => <p>Loading...</p>,
  loader: async ({ params, context }) => {
    const albumId = Number(params.albumId)

    if (Number.isNaN(albumId)) {
      throw notFound()
    }

    if (albumId < 0) {
      return null
    }

    const album = await context.queryClient.ensureQueryData(albumQuery(albumId))

    if (!album) {
      throw notFound()
    }

    return album
  },
  head: ({ loaderData: album }) => {
    if (!album)
      return {
        meta: [{ title: 'Ranky' }],
        scripts: [{ src: '/dragdroptouch.js?autoload', type: 'module' }]
      }

    const title = `${album.title} - ${album.artist.name}`
    const description = `Create album tracklist ranking`
    const img = album.cover
    const url = 'https://ranky.luihh.dev/'

    return {
      meta: [
        { title },
        { name: 'description', content: description },

        { name: 'og:title', content: title },
        { name: 'og:description', content: description },
        { name: 'og:image', content: img },
        { name: 'og:url', content: url },

        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: img },
        { name: 'twitter:url', content: url }
      ],
      links: [
        { rel: 'icon', href: img },
        { rel: 'canonical', href: `${url}/album/${album.id}` }
      ],
      scripts: [{ src: '/dragdroptouch.js?autoload', type: 'module' }]
    }
  }
})

function RouteComponent() {
  const loaderAlbum = Route.useLoaderData()
  const { albumId } = Route.useParams()
  const [customAlbum, setCustomAlbum] = useState<typeof loaderAlbum | undefined>(undefined)
  const id = Number(albumId)

  const screenshotRef = useRef<HTMLDivElement>(null)

  const [settingsVisible, setSettingsVisible] = useState<boolean>(false)
  const [smartRankVisible, setSmartRankVisible] = useState<boolean>(false)
  const [coverDialogVisible, setCoverDialogVisible] = useState<boolean>(false)

  useEffect(() => {
    if (id >= 0) return

    const album = getCustomAlbum(id)

    setCustomAlbum(album ?? null)
  }, [id])

  if (id < 0 && customAlbum === undefined) {
    return <p>Loading...</p>
  }

  const album = id < 0 ? customAlbum : loaderAlbum

  if (!album) {
    return <p>Album not found...</p>
  }

  function updateCustomAlbumState(
    patch: Partial<{ title: string; cover: string; artist: string }>
  ) {
    useAlbumRankingStore.getState().updateAlbumInfo(patch)

    setCustomAlbum((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        title: patch.title ?? prev.title,
        cover: patch.cover ?? prev.cover,
        artist: patch.artist ? { ...prev.artist, name: patch.artist } : prev.artist
      }
    })
  }

  async function downloadScreenshot() {
    if (!album || !screenshotRef.current) return
    await document.fonts.ready
    const image = await snapdom(screenshotRef.current, { backgroundColor: 'transparent' })
    const filename = `${album.title} - ${album.artist.name} ranking.png`
    const blob = await image.toBlob({ type: 'png' })
    if (!blob) return
    // image.download({ filename })
    await downloadBlob(blob, filename)
  }

  return (
    <>
      <SettingsDialog album={album} isVisible={settingsVisible} setIsVisible={setSettingsVisible} />
      <SmartRankDialog
        album={album}
        isVisible={smartRankVisible}
        setIsVisible={setSmartRankVisible}
      />
      {album.id < 0 && (
        <CoverDialog
          album={album}
          isVisible={coverDialogVisible}
          setIsVisible={setCoverDialogVisible}
          onUpdate={updateCustomAlbumState}
        />
      )}
      <Nav
        size={18}
        settingsVisible={settingsVisible}
        setSettingsVisible={setSettingsVisible}
        smartRankVisible={smartRankVisible}
        setSmartRankVisible={setSmartRankVisible}
      />
      <div className="absolute -top-2499.75" aria-hidden ref={screenshotRef}>
        <ScreenshotComponent album={album} />
      </div>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[35vw_1fr]">
        <Sidebar
          album={album}
          downloadScreenshot={downloadScreenshot}
          setCoverDialogVisible={setCoverDialogVisible}
          onUpdate={updateCustomAlbumState}
        />
        <Main album={album} />
      </div>
    </>
  )
}
