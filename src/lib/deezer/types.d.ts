export interface DeezerAlbumSearchItem {
  id: number
  title: string
  link: string
  cover: string
  cover_small: string
  cover_medium: string
  cover_big: string
  cover_xl: string
  md5_image: string
  genre_id?: number
  nb_tracks?: number
  record_type?: string
  tracklist: string
  explicit_lyrics: boolean
  artist: {
    id: number
    name: string
    picture: string
    picture_small: string
    picture_medium: string
    picture_big: string
    picture_xl: string
    tracklist: string
    type: string
  }
  type: string
}

export type DeezerArtistAlbum = Omit<DeezerAlbumSearchItem, 'artist'>

export interface DeezerArtistSearchItem {
  id: number
  name: string
  link: string
  share: string
  picture: string
  picture_small: string
  picture_medium: string
  picture_big: string
  picture_xl: string
  nb_album: number
  nb_fan: number
  radio: boolean
  tracklist: string
}

export interface DeezerTrackItem {
  id: number
  readable: boolean
  title: string
  title_short: string
  title_version: string
  isrc: string
  link: string
  duration: number
  track_position: number
  disk_number: number
  rank: number
  explicit_lyrics: boolean
  explicit_content_lyrics: number
  explicit_content_cover: number
  preview: string
  md5_image: string
  artist: {
    id: number
    name: string
    tracklist: string
    type: string
  }
  type: 'track'
}

export interface DeezerPaginatedResponse<T> {
  data: Array<T>
  total: number
  next?: string
}

export interface Track {
  id: number
  title: string
}

export interface Album {
  id: number
  title: string
  artist: {
    id: number
    name: string
  }
  cover: string
  tracks: Track[]
}

export type ArtistAlbums = Omit<Album, 'artist' | 'tracks'>

export interface Artist {
  id: number
  name: string
  picture: string
  albums: ArtistAlbums[]
}
