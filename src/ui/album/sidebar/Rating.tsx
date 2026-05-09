import { useRankingStore } from '@/stores/rankingStore'
import useAlbumSettings from '@/hooks/useAlbumSettings'
import StarRating from '../ratings/StarRating'
import NumberRating from '../ratings/NumberRating'

export default function Rating({ albumId, readOnly }: { albumId: number; readOnly: boolean }) {
  const rating = useRankingStore((s) => s.rating)
  const setRating = useRankingStore((s) => s.setRating)
  const { settings } = useAlbumSettings(albumId)

  switch (settings.scoringSystem) {
    case 0:
      return (
        <StarRating value={rating} readOnly={readOnly} onChange={readOnly ? () => {} : setRating} />
      )
    case 1:
      return (
        <NumberRating
          value={rating}
          max={10}
          readOnly={readOnly}
          onChange={readOnly ? () => {} : setRating}
        />
      )
    case 2:
      return (
        <NumberRating
          value={rating}
          max={100}
          readOnly={readOnly}
          onChange={readOnly ? () => {} : setRating}
        />
      )
    default:
      return null
  }
}
