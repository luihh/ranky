import { useAlbumMetaStore } from '@/stores/albumMetaStore'
import { useEffect } from 'react'

export default function useAlbumMeta(albumId: number) {
  const meta = useAlbumMetaStore((s) => s.meta)
  const hydrate = useAlbumMetaStore((s) => s.hydrate)
  const setNotes = useAlbumMetaStore((s) => s.setNotes)
  const setRating = useAlbumMetaStore((s) => s.setRating)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return {
    meta: meta[albumId] ?? {},
    setNotes: (notes: string) => setNotes(albumId, notes),
    setRating: (rating: number) => setRating(albumId, rating)
  }
}
