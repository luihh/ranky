import { useEffect, useState } from 'react';

interface RankingEntry {
  id: string;
  album: string;
  artist: string;
  timestamp: number;
  rating: number;
  cover?: string;
  tracks: any[];
}

export default function RankedAlbums() {
  const [albums, setAlbums] = useState<[string, RankingEntry][]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('albumRankings') || '{}');
    const entires = Object.entries(stored) as [string, RankingEntry][];
    setAlbums(entires);
  }, []);

  if (albums.length === 0) {
    return (
      <div className="empty">
        <p>No albums ranked yet!</p>
      </div>
    );
  }

  return (
    <div className="album-list">
      {albums.map(([key, data]) => {
        const href = `/album/${encodeURIComponent(data.id)}`;
        const rating = data.rating || 0;

        return (
          <a
            key={key}
            className="album-card"
            href={href}
          >
            {data.cover && (
              <img
                className="album-cover"
                src={data.cover}
              />
            )}
            <div className="album-info">
              <div className="album-title">
                <p className="nowrap">{data.album}</p>
              </div>
              <div className="album-artist">
                <span className="nowrap">{data.artist}</span>
              </div>
              <div className="album-date">
                {new Date(data.timestamp).toLocaleDateString()}
              </div>

              <div className="album-rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={n <= rating ? 'star filled' : 'star'}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
