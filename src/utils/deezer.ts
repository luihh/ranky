const BASE_URL = 'https://api.deezer.com';

export interface DeezerAlbumSearchItem {
  id: number;
  title: string;
  link: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  genre_id?: number;
  nb_tracks?: number;
  record_type?: string;
  tracklist: string;
  explicit_lyrics: boolean;
  artist: {
    id: number;
    name: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    tracklist: string;
    type: string;
  };
  type: 'album';
}

interface DeezerTrack {
  id: number;
  title: string;
}

interface DeezerAlbumInfo {
  id: number;
  title: string;
  artist: string;
  cover: string;
  tracks: DeezerTrack[];
}

export async function searchAlbums(
  query: string
): Promise<DeezerAlbumSearchItem[]> {
  const res = await fetch(
    `${BASE_URL}/search/album?q=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return (data.data || []).filter(
    (item: DeezerAlbumSearchItem) => item.record_type !== 'single'
  );
}

export async function getAlbumInfo(
  id: number
): Promise<DeezerAlbumInfo | null> {
  const res = await fetch(`${BASE_URL}/album/${id}`);
  const data = await res.json();
  if (data.error) return null;

  const tracklistUrl: string = data.tracklist;
  const allTracks: DeezerTrack[] = [];

  let nextUrl: string | null = tracklistUrl;

  while (nextUrl) {
    const res: any = await fetch(nextUrl);
    const page = await res.json();
    if (!page.data) break;

    allTracks.push(
      ...page.data.map((track: any) => ({
        id: track.id,
        title: track.title,
      }))
    );

    nextUrl = page.next ?? null;
  }

  return {
    id: data.id,
    title: data.title,
    artist: data.artist?.name,
    cover: data.cover_xl || data.cover_big,
    tracks: allTracks,
  };
}
