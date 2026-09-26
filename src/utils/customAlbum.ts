import type { Album, Track } from '@/lib/deezer'
import { AlbumCollectionSchema, type CustomTrack, type AlbumCollection } from '@/schemas/album'
import { SafeStorage } from '@/lib/safeStorage'

const albumStore = new SafeStorage<AlbumCollection>('albumRankings', AlbumCollectionSchema)

export function generateCustomAlbumId(): number {
  return -Date.now()
}

function nextTrackId(tracks: CustomTrack[]): number {
  return tracks.reduce((max, t) => Math.max(max, t.id), 0) + 1
}

export function getCustomAlbum(id: number): Album | null {
  const collection = albumStore.get()
  const stored = collection?.[id]

  if (!stored || !stored.isCustom) return null

  const tracks: Track[] = (stored.customTracks ?? []).map(({ id, title }) => ({
    id,
    title,
    preview: ''
  }))

  return {
    id,
    title: stored.album,
    artist: {
      id,
      name: stored.artist
    },
    cover: stored.cover,
    tracks
  }
}

export function createCustomAlbum(
  input: Partial<{
    title: string
    artist: string
    cover: string
    tracks: string[]
  }> = {}
): number {
  const id = generateCustomAlbumId()
  const customTracks: CustomTrack[] = (input.tracks ?? []).map((title, i) => ({
    id: i + 1,
    title
  }))

  albumStore.update((prev) => {
    const collection = prev ?? {}

    return {
      ...collection,
      [id]: {
        id: String(id),
        album: input.title ?? 'Untitled Album',
        artist: input.artist ?? 'Unknown Artist',
        cover: input.cover ?? '',
        timestamp: Date.now(),
        isCustom: true,
        customTracks,
        tracks: []
      }
    }
  })

  return id
}

export function updateCustomAlbumInfo(
  id: number,
  patch: Partial<{ title: string; artist: string; cover: string }>
) {
  albumStore.update((prev) => {
    const collection = prev ?? {}
    const stored = collection[id]
    if (!stored?.isCustom) return collection

    return {
      ...collection,
      [id]: {
        ...stored,
        album: patch.title ?? stored.album,
        artist: patch.artist ?? stored.artist,
        cover: patch.cover ?? stored.cover,
        timestamp: Date.now()
      }
    }
  })
}

export function setCustomAlbumTracks(id: number, tracks: CustomTrack[]) {
  albumStore.update((prev) => {
    const collection = prev ?? {}
    const stored = collection[id]
    if (!stored?.isCustom) return collection

    return {
      ...collection,
      [id]: {
        ...stored,
        customTracks: tracks,
        timestamp: Date.now()
      }
    }
  })
}

export function addCustomTrackId(existing: CustomTrack[]): number {
  return nextTrackId(existing)
}
