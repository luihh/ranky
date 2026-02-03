import type { AlbumCollection } from '@/schemas/album'
import { z } from 'zod'
import { migrateAlbumCollection } from './migrations/migrateAlbumCollection'

export class SafeStorage<T> {
  constructor(
    private key: string,
    private schema: z.ZodType<T>
  ) {}

  get(): T | null {
    const raw = localStorage.getItem(this.key)
    if (!raw) return null

    try {
      const parsed = this.schema.parse(JSON.parse(raw))

      if (this.key === 'albumRankings') {
        const migrated = migrateAlbumCollection(parsed as unknown as AlbumCollection)
        if (migrated !== parsed) {
          localStorage.setItem(this.key, JSON.stringify(migrated))
        }

        return migrated as unknown as T
      }

      return parsed
    } catch {
      console.warn(`Invalid data for key "${this.key}"`)
      return null
    }
  }

  set(value: T) {
    localStorage.setItem(this.key, JSON.stringify(value))
  }

  update(updateFn: (prev: T | null) => T) {
    const updated = updateFn(this.get())
    this.set(updated)
  }

  remove() {
    localStorage.removeItem(this.key)
  }
}
