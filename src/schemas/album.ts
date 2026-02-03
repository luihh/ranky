import { z } from 'zod'

const AlbumSettingsSchema = z.object({
  showPlaceholdersOnScreenshot: z.boolean().default(true),
  scoringSystem: z.union([z.literal(0), z.literal(1), z.literal(2)])
})

const AlbumColorSchema = z.object({
  savedColor: z.string(),
  initialColor: z.string()
})

export const AlbumSchema = z.object({
  version: z.number().optional(),
  id: z.string(),
  album: z.string(),
  artist: z.string(),
  cover: z.string(),
  rating: z.number().optional(),
  notes: z.string().optional(),
  timestamp: z.number(),
  tracks: z.array(
    z.object({
      name: z.string(),
      slotIndex: z.number()
    })
  ),
  settings: AlbumSettingsSchema.optional(),
  colors: AlbumColorSchema.optional()
})

export const AlbumCollectionSchema = z.record(z.string(), AlbumSchema)

export type Album = z.infer<typeof AlbumSchema>
export type AlbumCollection = z.infer<typeof AlbumCollectionSchema>
export type AlbumSettings = z.infer<typeof AlbumSettingsSchema>
export type AlbumColors = z.infer<typeof AlbumColorSchema>
