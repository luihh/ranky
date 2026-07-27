import { useAlbumMetaStore } from '@/stores/albumMetaStore'
import { useEffect } from 'react'

export default function useAlbumMeta(albumId: number) {
  const { meta, hydrate, setNotes, setRating } = useAlbumMetaStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return {
    meta: meta[albumId] ?? {},
    setNotes: (notes: string) => setNotes(albumId, notes),
    setRating: (rating: number) => setRating(albumId, rating)
  }
}
