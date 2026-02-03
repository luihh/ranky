import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { getArtistCore, getArtistAlbums } from '@/lib/deezer'
import { generateTheme, getImgColorPalette, removeTheme } from '@/utils/generateTheme'

import Navbar from '@/ui/Navbar'

const artistCoreFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { artistId: number }) => data)
  .handler(async ({ data }) => {
    return await getArtistCore(data.artistId)
  })

const artistAlbumsFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { artistId: number; index: number }) => data)
  .handler(async ({ data }) => {
    return await getArtistAlbums(data.artistId, data.index)
  })

function useArtistAlbums(artistId: number) {
  return useInfiniteQuery({
    queryKey: ['artist-albums', artistId],
    queryFn: ({ pageParam }) =>
      artistAlbumsFn({
        data: { artistId, index: pageParam }
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextIndex
  })
}

export function useInfiniteScroll(onIntersect: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!enabled || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [enabled, onIntersect])

  return ref
}

export const Route = createFileRoute('/artist/$artistId')({
  component: RouteComponent,
  errorComponent: () => <p>An error has ocurred!</p>,
  notFoundComponent: () => <p>Artist not found</p>,
  pendingComponent: () => <p>Loading...</p>,
  loader: async ({ params, context }) => {
    const artistId = Number(params.artistId)

    if (Number.isNaN(artistId)) {
      throw notFound()
    }

    const artist = await context.queryClient.ensureQueryData({
      queryKey: ['artist-core', artistId],
      queryFn: () => artistCoreFn({ data: { artistId } }),
      staleTime: 1000 * 60 * 5
    })

    if (!artist) {
      throw notFound()
    }

    context.queryClient.prefetchInfiniteQuery({
      queryKey: ['artist-albums', artist.id],
      queryFn: ({ pageParam }) =>
        artistAlbumsFn({
          data: { artistId: artist.id, index: pageParam }
        }),
      initialPageParam: 0
    })

    return artist
  }
})

function RouteComponent() {
  const artist = Route.useLoaderData()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useArtistAlbums(artist.id)

  const albums = data?.pages.flatMap((page) => page.albums) ?? []

  const loadMoreRef = useInfiniteScroll(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }, hasNextPage ?? false)

  const imgRef = useRef<HTMLImageElement>(null)

  async function handleImgLoad() {
    const palette = await getImgColorPalette(imgRef.current)
    if (!palette) return

    generateTheme(palette)
  }

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const onLoad = () => handleImgLoad()

    if (img.complete) {
      onLoad()
    } else {
      img.addEventListener('load', onLoad)
    }

    return () => {
      img.removeEventListener('load', onLoad)
      removeTheme()
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-8 w-full md:w-[90%] p-6 mx-auto">
        <header className="flex md:flex-row flex-col items-center gap-6">
          <img
            ref={imgRef}
            src={artist.picture}
            alt={artist.name}
            className="size-40 rounded-full object-cover border"
            crossOrigin="anonymous"
            draggable={false}
          />
          <h1 className="text-4xl font-bold text-balance text-center md:text-left">
            {artist.name}
          </h1>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Albums</h2>

          <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
            {albums.map((album) => (
              <li
                key={album.id}
                className="snap-start shrink-0 w-48 bg-surface border rounded-2xl overflow-hidden"
              >
                <Link
                  to="/album/$albumId"
                  params={{ albumId: String(album.id) }}
                  className="flex flex-col"
                  draggable={false}
                >
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="aspect-square object-cover"
                    draggable={false}
                  />
                  <div className="p-4">
                    <span className="block truncate font-semibold">{album.title}</span>
                  </div>
                </Link>
              </li>
            ))}

            {hasNextPage && (
              <li className="shrink-0 w-px">
                <div ref={loadMoreRef} />
              </li>
            )}
          </ul>

          {isFetchingNextPage && <p className="text-sm opacity-60">Loading more albums…</p>}
        </section>
      </div>
    </>
  )
}
