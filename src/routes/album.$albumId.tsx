import { useRef, useState } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { queryOptions } from '@tanstack/react-query'
import { getAlbum } from '@/lib/deezer'
import { snapdom } from '@zumer/snapdom'
import { downloadBlob } from '@/utils/downloadImage'

import Nav from '@/ui/album/Nav'
import SettingsDialog from '@/ui/album/settings/SettingsDialog'
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

    const album = await context.queryClient.ensureQueryData(albumQuery(albumId))

    if (!album) {
      throw notFound()
    }

    return album
  },
  head: ({ loaderData: album }) => {
    if (!album)
      return {
        meta: [{ title: 'Ranky' }]
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
  const album = Route.useLoaderData()

  const screenshotRef = useRef<HTMLDivElement>(null)

  const [settingsVisible, setSettingsVisible] = useState<boolean>(false)

  async function downloadScreenshot() {
    if (!screenshotRef.current) return
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
      <Nav size={18} settingsVisible={settingsVisible} setSettingsVisible={setSettingsVisible} />
      <div className="absolute -top-2499.75" aria-hidden ref={screenshotRef}>
        <ScreenshotComponent album={album} />
      </div>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[35vw_1fr]">
        <Sidebar album={album} downloadScreenshot={downloadScreenshot} />
        <Main album={album} />
      </div>
    </>
  )
}
