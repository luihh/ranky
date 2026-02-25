import type { AlbumCollection } from '@/schemas/album'

export async function importRankingsToAccount(rankings: AlbumCollection) {
  const entries = Object.values(rankings)

  const results = await Promise.allSettled(
    entries.map((album) =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/ranking`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          albumId: album.id,
          title: album.album,
          artist: album.artist,
          cover: album.cover,
          tracks: album.tracks,
          rating: album.rating,
          notes: album.notes,
          color: album.colors?.savedColor
        })
      })
    )
  )

  const failed = results.filter((r) => r.status === 'rejected').length
  return { total: entries.length, failed }
}
