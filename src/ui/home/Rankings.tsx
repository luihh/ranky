import { Link } from '@tanstack/react-router'
import { SafeStorage } from '@/lib/safeStorage'
import { AlbumCollectionSchema, type AlbumCollection } from '@/schemas/album'
import { useEffect, useState } from 'react'
import { type SortOptions, useHomeSortByStore } from '@/stores/homeSortByStore'
import { useGlobalSettingsStore } from '@/stores/globalSettingsStore'
import humanizeDuration from 'humanize-duration'
import renderRating from '@/utils/renderRating'

export default function Rankings() {
  const global = useGlobalSettingsStore()
  const [albums, setAlbums] = useState<AlbumCollection | null>({})
  const { sortBy, setSortBy } = useHomeSortByStore()

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

  if (!albums || Object.keys(albums).length <= 0) {
    return (
      <p className="text-2xl text-center text-balance font-semibold opacity-75 p-6">
        No albums ranked yet
      </p>
    )
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 w-full md:w-[90%] p-6 mx-auto">
        <div className="w-full flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-center">Albums</h1>

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
        </ul>
      </div>
    </>
  )
}
