import { Link, useNavigate } from '@tanstack/react-router'
import { SafeStorage } from '@/lib/safeStorage'
import { AlbumCollectionSchema, type AlbumCollection } from '@/schemas/album'
import { useEffect, useState } from 'react'
import { type SortOptions, useHomeSortByStore } from '@/stores/homeSortByStore'
import { useGlobalSettingsStore } from '@/stores/globalSettingsStore'
import { Plus } from 'lucide-react'
import humanizeDuration from 'humanize-duration'
import renderRating from '@/utils/renderRating'
import { createCustomAlbum } from '@/utils/customAlbum'

export default function Rankings() {
  const navigate = useNavigate()
  const global = useGlobalSettingsStore()
  const [albums, setAlbums] = useState<AlbumCollection | null>({})
  const sortBy = useHomeSortByStore((s) => s.sortBy)
  const setSortBy = useHomeSortByStore((s) => s.setSortBy)

  useEffect(() => {
    const albumsSaved = new SafeStorage<AlbumCollection>(
      'albumRankings',
      AlbumCollectionSchema
    ).get()
    setAlbums(albumsSaved)
  }, [])

  const sortedAlbums = albums
    ? [...Object.values(albums)].sort((a, b) => {
        switch (sortBy) {
          case 'date-asc':
            return a.timestamp - b.timestamp
          case 'date-desc':
            return b.timestamp - a.timestamp
          case 'album':
            return a.album.localeCompare(b.album)
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

  function handleCreateCustomAlbum() {
    const id = createCustomAlbum()
    navigate({ to: '/album/$albumId', params: { albumId: String(id) } })
  }

  // if (!albums || Object.keys(albums).length <= 0) {
  //   return (
  //     <div className="flex flex-col justify-center items-center gap-4 w-full md:w-[90%] p-6 mx-auto">
  //       <p className="text-2xl text-center text-balance font-semibold opacity-75">
  //         No albums ranked yet
  //       </p>
  //       <div className="w-full max-w-xs border border-dashed rounded-2xl bg-surface/25 overflow-hidden transition hover:bg-surface/15">
  //         <Link to="/" className="flex items-center justify-center h-28 w-full" draggable={false}>
  //           <Plus className="size-6 opacity-50" />
  //         </Link>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 w-full md:w-[90%] p-6 mx-auto">
        <div className="w-full flex items-center justify-between gap-4">
          {/* <div className="flex items-center gap-3"> */}
          <h1 className="text-3xl font-bold text-center">Albums</h1>

          {/* <button
              aria-label="Create Custom Album"
              onClick={handleCreateCustomAlbum}
              className="all-unset cursor-pointer! border! border-dashed! rounded-2xl! border-border! bg-surface/25! overflow-hidden! transition! hover:bg-surface/15! p-1!"
            >
              <Plus className="size-5! opacity-50 transition-transform duration-200 group-hover:-translate-y-3" />
            </button> */}
          {/* </div> */}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOptions)}
            className="bg-surface border rounded-lg px-3 py-2 text-sm"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="album">Album name</option>
            <option value="artist">Artist name</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <ul className="w-full list-none grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {sortedAlbums.map((data) => {
            const now = Date.now()
            const timeAgo = humanizeDuration(now - data.timestamp, { largest: 1, round: true })

            return (
              <li
                key={data.id}
                className="bg-surface border rounded-2xl overflow-hidden transition hover:bg-surface/75"
              >
                <Link
                  to={'/album/$albumId'}
                  params={{ albumId: String(data.id) }}
                  className="flex gap-4 h-full"
                  draggable={false}
                >
                  <img
                    src={data.cover}
                    alt={`${data.album} by ${data.artist} album cover`}
                    className="size-28"
                    draggable={false}
                  />
                  <div className="flex flex-col justify-center min-w-0 w-full pr-4">
                    <span className="block truncate text-xl font-semibold leading-tight">
                      {data.album}
                    </span>
                    <span className="block truncate text-base opacity-80">{data.artist}</span>
                    <span className="block text-base font-semibold tracking-tight">
                      {renderRating(
                        data.rating,
                        data.settings?.scoringSystem ?? global.scoringSystem
                      )}
                    </span>
                    <span className="block text-xs opacity-50">{timeAgo} ago</span>
                  </div>
                </Link>
              </li>
            )
          })}
          <li className="group border border-dashed rounded-2xl bg-surface/25 overflow-hidden transition hover:bg-surface/15">
            <a
              className="relative flex items-center justify-center h-28 w-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                handleCreateCustomAlbum()
              }}
            >
              <Plus className="size-6 opacity-50 transition-transform duration-200 group-hover:-translate-y-3" />
              <span className="absolute text-sm font-medium opacity-0 translate-y-5 transition-all duration-200 group-hover:opacity-70 group-hover:translate-y-2.5">
                Custom Album
              </span>
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}
