import type { Album } from '@/lib/deezer'
import { Download } from 'lucide-react'
import AlbumData from './sidebar/AlbumData'
import Notes from './sidebar/Notes'
import Rating from './sidebar/Rating'
import { Link } from '@tanstack/react-router'

export default function Sidebar({
  album,
  imgRef,
  downloadScreenshot,
  readOnly,
  owner
}: {
  album: Album
  imgRef: React.RefObject<HTMLImageElement | null>
  downloadScreenshot: () => void
  readOnly: boolean
  owner?: {
    id: string
    name: string
    image: string | null
  }
}) {
  return (
    <aside className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center items-center text-center p-6 lg:gap-0 gap-2">
      <div className="mt-auto w-full flex flex-col items-center gap-2">
        {readOnly && owner && (
          <Link
            to="/user/$userId"
            params={{ userId: owner.id }}
            className="flex items-center gap-2 px-4 py-2 rounded-full mb-2 hover:underline"
          >
            {owner.image && (
              <img
                src={owner.image}
                alt={owner.name}
                className="size-8 rounded-full object-cover"
                draggable={false}
              />
            )}
            <span className="opacity-80">{owner.name}'s ranking</span>
          </Link>
        )}

        <AlbumData album={album} imgRef={imgRef} />
        <Rating albumId={album.id} readOnly={readOnly} />
        <Notes albumId={album.id} readOnly={readOnly} />
      </div>
      <div className="mt-auto">
        {!readOnly && (
          <button className="gap-2!" onClick={downloadScreenshot}>
            <Download size={20} />
            Download Ranking Image
          </button>
        )}
      </div>
    </aside>
  )
}
