import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import useGlobalTheme from '@/hooks/useGlobalTheme'
import Navbar from '@/ui/Navbar'

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

function RouteComponent() {
  useGlobalTheme()

  const user = Route.useLoaderData()
  const { userId } = Route.useParams()

  const { data: rankings = [] } = useQuery({
    queryKey: ['user-rankings', userId],
    queryFn: () => userRankingsFn({ data: { userId } })
  })

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
            <p className="text-sm opacity-40">
              {rankings.length} ranking{rankings.length !== 1 ? 's' : ''}
            </p>
          </div>
        </header>

        {rankings.length > 0 ? (
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Rankings</h2>

            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {rankings.map((ranking) => (
                <li key={ranking.id} className="bg-surface border rounded-2xl overflow-hidden">
                  <Link
                    to="/user/$userId/album/$albumId"
                    params={{ userId: String(userId), albumId: String(ranking.albumId) }}
                    className="flex flex-col no-underline"
                    draggable={false}
                  >
                    <img
                      src={ranking.cover}
                      alt={ranking.title}
                      className="aspect-square object-cover"
                      draggable={false}
                    />
                    <div className="p-3 flex flex-col gap-0.5">
                      <span className="block truncate font-semibold text-sm">{ranking.title}</span>
                      <span className="block truncate text-xs opacity-50">{ranking.artist}</span>
                      {ranking.rating != null && (
                        <span className="text-xs opacity-70 mt-1">{ranking.rating} / 10</span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="opacity-40 text-sm">This user hasn't ranked anything yet.</p>
        )}
      </div>
    </>
  )
}
