import { ALBUM_SCHEMA_VERSION } from '@/consts'
import type { AlbumCollection } from '@/schemas/album'

function migrateStarRatingTo100(rating?: number) {
  if (rating == null) return rating
  return Math.round((rating / 5) * 100)
}

export function migrateAlbumCollection(collection: AlbumCollection): AlbumCollection {
  let changed = false
  const migrated: AlbumCollection = {}

  for (const [id, album] of Object.entries(collection)) {
    if (!album.version || album.version < ALBUM_SCHEMA_VERSION) {
      console.log('[MIGRATION] upgrading album', id, {
        before: album.rating,
        after: migrateStarRatingTo100(album.rating)
      })

      migrated[id] = {
        ...album,
        version: ALBUM_SCHEMA_VERSION,
        rating: migrateStarRatingTo100(album.rating)
      }

      changed = true
    } else {
      migrated[id] = album
    }
  }

  return changed ? migrated : collection
}
