import { AlbumSettings } from './schemas/album'

export const SCORING_SYSTEM_OPTIONS: {
  value: AlbumSettings['scoringSystem']
  label: string
  description: string
}[] = [
  {
    value: 0,
    label: 'Stars (1-5)',
    description: 'Classic 5-star rating'
  },
  {
    value: 1,
    label: '1 / 10',
    description: 'Score from 1 to 10'
  },
  {
    value: 2,
    label: '1 / 100',
    description: 'Precise score from 1 to 100'
  }
]

export const ALBUM_SCHEMA_VERSION = 1

export const SETTINGS_SHOWCASE_SCREENSHOTS = {
  showPlaceholdersOnScreenshot: [
    '/img/placeholders-showcase-ranking.png',
    '/img/no-placeholders-showcase-ranking.png'
  ]
}
