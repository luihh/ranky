import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { searchAlbums, searchArtists } from '@/lib/deezer'
import { Suspense } from 'react'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

const searchSchema = z.object({
  q: z.string().min(1, 'Query not found')
})

const searchAlbumsFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { q: string }) => data)
  .handler(async ({ data }) => {
    return await searchAlbums(data.q)
  })

const searchArtistsFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { q: string }) => data)
  .handler(async ({ data }) => {
    return await searchArtists(data.q)
  })

export const Route = createFileRoute('/_layout/search')({
  component: RouteComponent,
  errorComponent: () => <p>An error has ocurred!</p>,
  notFoundComponent: () => <p>Invalid search query</p>,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { q } }) => ({ q }),
  head: ({ match }) => {
    const q = match.search.q
    return {
      meta: [{ title: `Search - ${q}` }]
    }
  }
})

function RouteComponent() {
  const { q } = Route.useLoaderDeps()

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <QueryComponent query={q} />
    </Suspense>
  )
}

function QueryComponent({ query }: { query: string }) {
  const { data: albumsResults } = useSuspenseQuery(
    queryOptions({
      queryKey: ['album-search', query],
      queryFn: () => searchAlbumsFn({ data: { q: query } }),
      staleTime: 1000 * 60 * 5
    })
  )
  const { data: artistsResults } = useSuspenseQuery(
    queryOptions({
      queryKey: ['artist-search', query],
      queryFn: () => searchArtistsFn({ data: { q: query } }),
      staleTime: 1000 * 60 * 5
    })
  )

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full md:w-[90%] p-6 mx-auto">
      {artistsResults.length !== 0 && (
        <>
          <h1 className="text-3xl font-bold text-center">Artists</h1>
          <ul className="w-full flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-2">
            {artistsResults.map((artist) => (
              <li
                key={artist.id}
                className="bg-surface hover:bg-surface/75 transition snap-start shrink-0 min-w-64 max-w-full border rounded-full overflow-hidden"
              >
                <Link
                  to={'/artist/$artistId'}
                  params={{ artistId: String(artist.id) }}
                  className="flex gap-4"
                  draggable={false}
                >
                  <img
                    src={artist.picture_medium}
                    alt={`${artist.name}'s picture`}
                    className="size-28 rounded-full object-cover"
                    draggable={false}
                  />
                  <div className="flex flex-col justify-center min-w-0 pr-8">
                    <span className="truncate text-xl font-semibold">{artist.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {albumsResults.length !== 0 && (
        <>
          <h1 className="text-3xl font-bold text-center">Albums</h1>
          <ul className="w-full list-none grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {albumsResults.map((album) => (
              <li
                key={album.id}
                className="bg-surface hover:bg-surface/75 transition border rounded-2xl overflow-hidden"
              >
                <Link
                  to={'/album/$albumId'}
                  params={{ albumId: String(album.id) }}
                  className="flex gap-4"
                  draggable={false}
                >
                  <img
                    src={album.cover_medium}
                    alt={`${album.title} by ${album.artist.name} album cover`}
                    className="size-28"
                    draggable={false}
                  />
                  <div className="flex flex-col justify-center min-w-0 pr-4">
                    <span className="block truncate text-xl font-semibold leading-tight">
                      {album.title}
                    </span>
                    <span className="block truncate text-base opacity-80">{album.artist.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
