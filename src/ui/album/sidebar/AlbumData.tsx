import type { Album } from '@/lib/deezer'
import { Link } from '@tanstack/react-router'

export default function AlbumData({
  album,
  imgRef
}: {
  album: Album
  imgRef: React.RefObject<HTMLImageElement | null>
}) {
  return (
    <div className="flex flex-col items-center w-full">
      <img
        ref={imgRef}
        src={album.cover}
        alt={`${album.title} cover`}
        draggable={false}
        className="size-60 rounded-2xl mb-2 shadow-md select-none"
        crossOrigin="anonymous"
      />
      <h1 className="text-2xl font-bold text-balance">{album.title}</h1>
      <Link to="/artist/$artistId" params={{ artistId: String(album.artist.id) }} draggable={false}>
        <h2 className="text-xl font-bold text-balance opacity-80 hover:underline">
          {album.artist.name}
        </h2>
      </Link>
    </div>
  )
}
