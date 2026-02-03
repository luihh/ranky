import { SCORING_SYSTEM_OPTIONS } from '@/consts'
import { useGlobalSettingsStore } from '@/stores/globalSettingsStore'

import Section from '@/ui/Section'
import RadioCards from '@/ui/RadioCards'

export default function ScoringSection() {
  const global = useGlobalSettingsStore()

  return (
    <Section title="Scoring system">
      <RadioCards
        name="album-scoring-system"
        value={global.scoringSystem}
        options={SCORING_SYSTEM_OPTIONS}
        onChange={(scoringSystem) => global.setScoringSystem(scoringSystem)}
      />
    </Section>
  )
}
