import type {
  DeezerAlbumSearchItem,
  DeezerArtistSearchItem,
  DeezerArtistAlbum,
  DeezerTrackItem,
  DeezerPaginatedResponse,
  Track,
  Album,
  Artist,
  ArtistAlbums
} from './types'

const BASE_URL = 'https://api.deezer.com'

export async function searchAlbums(query: string): Promise<DeezerAlbumSearchItem[]> {
  const res = await fetch(`${BASE_URL}/search/album?q=${encodeURIComponent(query)}`)
  const data = await res.json()
  return (data.data || []).filter((item: DeezerAlbumSearchItem) => item.record_type !== 'single')
}

export async function searchArtists(query: string): Promise<DeezerArtistSearchItem[]> {
  const res = await fetch(`${BASE_URL}/search/artist?q=${encodeURIComponent(query)}`)
  const data = await res.json()
  return data.data
}

export async function getAlbum(id: number): Promise<Album | null> {
  const albumRes = await fetch(`${BASE_URL}/album/${id}`)
  const data: DeezerAlbumSearchItem = await albumRes.json()
  if (!data.id) return null

  const tracklistUrl: string = data.tracklist
  const allTracks: Array<Track> = []

  let nextUrl: string | null = tracklistUrl

  while (nextUrl) {
    const trackRes = await fetch(nextUrl)
    const page: DeezerPaginatedResponse<DeezerTrackItem> = await trackRes.json()

    if (!page.data) break

    allTracks.push(...page.data.map(({ id, title }) => ({ id, title })))

    nextUrl = page.next ?? null
  }

  return {
    id: data.id,
    title: data.title,
    artist: {
      id: data.artist.id,
      name: data.artist.name
    },
    cover: data.cover_xl || data.cover_big,
    tracks: allTracks
  }
}

export async function getArtistCore(id: number): Promise<Omit<Artist, 'albums'> | null> {
  const res = await fetch(`${BASE_URL}/artist/${id}`)
  const data: DeezerArtistSearchItem = await res.json()
  if (!data.id) return null

  return {
    id: data.id,
    name: data.name,
    picture: data.picture_xl || data.picture_big
  }
}

export async function getArtistAlbums(
  artistId: number,
  index = 0
): Promise<{ albums: ArtistAlbums[]; nextIndex: number | null }> {
  const res = await fetch(`${BASE_URL}/artist/${artistId}/albums?index=${index}`)
  const page: DeezerPaginatedResponse<DeezerAlbumSearchItem> = await res.json()

  const albums: ArtistAlbums[] = page.data
    .filter((album: DeezerArtistAlbum) => album.record_type !== 'single')
    .map((album: DeezerArtistAlbum) => ({
      id: album.id,
      title: album.title,
      cover: album.cover_xl || album.cover_big
    }))

  return { albums, nextIndex: page.next ? index + page.data.length : null }
}

export type {
  DeezerAlbumSearchItem,
  DeezerArtistSearchItem,
  DeezerTrackItem,
  DeezerPaginatedResponse,
  Track,
  Album,
  Artist,
  ArtistAlbums
}
