import useAlbumMeta from '@/utils/useAlbumMeta'
import useAlbumSettings from '@/utils/useAlbumSettings'

import StarRating from '../ratings/StarRating'
import NumberRating from '../ratings/NumberRating'

export default function Rating({ albumId }: { albumId: number }) {
  const { meta, setRating } = useAlbumMeta(albumId)
  const { settings } = useAlbumSettings(albumId)

  const rating = meta.rating

  switch (settings.scoringSystem) {
    case 0:
      return <StarRating value={rating} onChange={setRating} />

    case 1:
      return <NumberRating value={rating} max={10} onChange={setRating} />

    case 2:
      return <NumberRating value={rating} max={100} onChange={setRating} />

    default:
      return null
  }
}
