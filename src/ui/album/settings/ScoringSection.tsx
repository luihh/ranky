import type { Album } from '@/lib/deezer'
import { SCORING_SYSTEM_OPTIONS } from '@/consts'
import useAlbumSettings from '@/utils/useAlbumSettings'

import Section from '@/ui/Section'
import RadioCards from '@/ui/RadioCards'

export default function ScoringSection({ album }: { album: Album }) {
  const { settings, setSettings } = useAlbumSettings(album.id)

  return (
    <Section title="Scoring system">
      <RadioCards
        name="album-scoring-system"
        value={settings.scoringSystem}
        options={SCORING_SYSTEM_OPTIONS}
        onChange={(scoringSystem) => setSettings({ ...settings, scoringSystem })}
      />
    </Section>
  )
}
