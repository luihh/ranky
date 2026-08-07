import type { Album } from '@/lib/deezer'

import { useAlbumRankingStore } from '@/stores/albumRankingStore'
import useAlbumSettings from '@/hooks/useAlbumSettings'
import useAlbumMeta from '@/hooks/useAlbumMeta'
import clsx from 'clsx'

import Rating from './sidebar/Rating'

export default function ScreenshotComponent({ album }: { album: Album }) {
  const { settings } = useAlbumSettings(album.id)
  const showPlaceholders = settings.showPlaceholdersOnScreenshot

  const { meta } = useAlbumMeta(album.id)
  const notes = meta.notes

  const containers = useAlbumRankingStore((s) => s.containers)
  const ranking = containers.find((c) => c.id === 'ranking')
  const items = showPlaceholders
    ? ranking?.items
    : ranking?.items.filter((track) => track.id !== 'placeholder')

  return (
    <div
      key={showPlaceholders ? 'with-placeholders' : 'no-placeholders'}
      className="p-8 bg-bg flex flex-row gap-8 items-center"
    >
      <div className="flex flex-col min-w-80 w-80 h-full text-center items-center">
        <img src={album.cover} crossOrigin="anonymous" className="size-60 rounded-2xl mb-2" />
        <h2 className="text-2xl w-full font-bold text-balance">{album.title}</h2>
        <h2 className="text-xl w-full font-semibold text-balance opacity-80 mb-2">
          {album.artist.name}
        </h2>

        <Rating albumId={album.id} />

        {notes && <p className="mt-2 max-w-60 leading-snug opacity-80">“{notes.slice(0, 250)}”</p>}
      </div>

      <div className="flex flex-col gap-2 max-w-md">
        {items?.map((track, i) => (
          <div key={i} className="flex w-full">
            <span className="size-12 bg-surface min-w-12 flex justify-center items-center text-xl font-bold border rounded-l-xl">
              {i + 1}
            </span>
            <div
              className={clsx(
                'h-12 border rounded-r-xl w-full',
                track.id === 'placeholder' ? 'border border-dashed' : 'bg-surface'
              )}
            >
              <div className="size-full bg-surface flex justify-center items-center text-center rounded-r-xl">
                <span className="p-4 w-80 truncate">{track.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
