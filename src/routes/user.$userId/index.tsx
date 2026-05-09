import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import useGlobalTheme from '@/hooks/useGlobalTheme'
import Navbar from '@/ui/Navbar'
import renderRating from '@/utils/renderRating'
import { useGlobalSettingsStore } from '@/stores/globalSettingsStore'
import { useState } from 'react'

const userFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${data.userId}`)
    if (!res.ok) return null
    return res.json() as Promise<{
      id: string
      name: string
      image: string | null
      createdAt: string
    }>
  })

const userRankingsFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${data.userId}/rankings`)
    if (!res.ok) return []
    return res.json() as Promise<
      {
        id: number
        albumId: string
        title: string
        artist: string
        cover: string
        rating: number | null
        color: string | null
      }[]
    >
  })

export const Route = createFileRoute('/user/$userId/')({
  component: RouteComponent,
  errorComponent: () => <p>An error has occurred!</p>,
  notFoundComponent: () => <p>User not found</p>,
  pendingComponent: () => <p>Loading...</p>,
  loader: async ({ params, context }) => {
    const user = await context.queryClient.ensureQueryData({
      queryKey: ['user', params.userId],
      queryFn: () => userFn({ data: { userId: params.userId } }),
      staleTime: 1000 * 60 * 5
    })

    if (!user) throw notFound()

    context.queryClient.prefetchQuery({
      queryKey: ['user-rankings', params.userId],
      queryFn: () => userRankingsFn({ data: { userId: params.userId } })
    })

    return user
  }
})

type SortOptions = 'album' | 'artist' | 'rating'

function RouteComponent() {
  useGlobalTheme()
  const global = useGlobalSettingsStore()
  const [sortBy, setSortBy] = useState<SortOptions>('album')

  const user = Route.useLoaderData()
  const { userId } = Route.useParams()

  const { data: rankings = [] } = useQuery({
    queryKey: ['user-rankings', userId],
    queryFn: () => userRankingsFn({ data: { userId } })
  })

  const sortedAlbums = rankings
    ? [...Object.values(rankings)].sort((a, b) => {
        switch (sortBy) {
          case 'album':
            return a.title.localeCompare(b.title)
          case 'artist':
            return a.artist.localeCompare(b.artist)
          case 'rating':
            const ar = a.rating ?? -Infinity
            const br = b.rating ?? -Infinity
            return br - ar
          default:
            return 0
        }
      })
    : []

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-8 w-full md:w-[90%] p-6 mx-auto">
        <header className="flex md:flex-row flex-col items-center gap-6">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="size-40 rounded-full object-cover border"
              draggable={false}
            />
          ) : (
            <div className="size-40 rounded-full bg-surface border flex items-center justify-center text-4xl font-bold opacity-40">
              {user.name[0].toUpperCase()}
            </div>
          )}
          <div className="flex flex-col items-center md:items-start gap-1">
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <p className="text-sm opacity-75">
              {rankings.length} ranking{rankings.length !== 1 ? 's' : ''}
            </p>
          </div>
        </header>

        {rankings.length > 0 ? (
          <section className="flex flex-col gap-4">
            <div className="w-full flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-center">Rankings</h1>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOptions)}
                className="bg-surface border rounded-lg px-3 py-2 text-sm"
              >
                <option value="album">Album name</option>
                <option value="artist">Artist name</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <ul className="w-full list-none grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
              {sortedAlbums.map((ranking) => {
                return (
                  <li
                    key={ranking.id}
                    className="bg-surface border rounded-2xl overflow-hidden transition hover:bg-surface/75"
                  >
                    <Link
                      to="/user/$userId/album/$albumId"
                      params={{ userId: String(userId), albumId: String(ranking.albumId) }}
                      className="flex gap-4 h-full"
                      draggable={false}
                    >
                      <img
                        src={ranking.cover}
                        alt={`${ranking.title} by ${ranking.artist} album cover`}
                        className="size-28"
                        draggable={false}
                      />
                      <div className="flex flex-col justify-center min-w-0 w-full pr-4">
                        <span className="block truncate text-xl font-semibold leading-tight">
                          {ranking.title}
                        </span>
                        <span className="block truncate text-base opacity-80">
                          {ranking.artist}
                        </span>
                        <span className="block text-base font-semibold tracking-tight">
                          {renderRating(ranking.rating!, global.scoringSystem)}
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : (
          <p className="opacity-40 text-sm text-balance text-center md:text-start">
            This user hasn't ranked anything yet.
          </p>
        )}
      </div>
    </>
  )
}
