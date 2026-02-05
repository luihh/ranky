import { AlbumSettings } from '@/schemas/album'
import clsx from 'clsx'

export default function renderRating(
  rating: number | undefined,
  scoringSystem: AlbumSettings['scoringSystem']
) {
  if (rating == null) return null

  switch (scoringSystem) {
    case 0: {
      const stars = Math.round((rating / 100) * 5)
      return (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => {
            const active = i <= stars

            return (
              <span key={i} className={clsx(active || 'opacity-50')}>
                ★
              </span>
            )
          })}
        </div>
      )
    }

    case 1: {
      const value = Math.round(rating / 10)
      return (
        <>
          {value}
          <span className="opacity-50">/10</span>
        </>
      )
    }

    case 2:
    default:
      return (
        <>
          {rating}
          <span className="opacity-50">/100</span>
        </>
      )
  }
}
