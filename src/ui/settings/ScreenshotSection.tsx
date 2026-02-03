import { useGlobalSettingsStore } from '@/stores/globalSettingsStore'
import { SETTINGS_SHOWCASE_SCREENSHOTS } from '@/consts'

import Section from '@/ui/Section'
import Switch from '@/ui/Switch'

export default function ScreenshotSection() {
  const global = useGlobalSettingsStore()

  function toggle() {
    global.setShowPlaceholdersOnScreenshot(!global.showPlaceholdersOnScreenshot)
  }

  const screenshot = global.showPlaceholdersOnScreenshot
    ? SETTINGS_SHOWCASE_SCREENSHOTS.showPlaceholdersOnScreenshot[0]
    : SETTINGS_SHOWCASE_SCREENSHOTS.showPlaceholdersOnScreenshot[1]

  return (
    <Section title="Screenshot">
      <Switch
        label="Show placeholders in screenshot"
        checked={global.showPlaceholdersOnScreenshot}
        onChange={toggle}
      />
      {screenshot && (
        <img
          src={screenshot}
          draggable={false}
          className="mt-4 size-full object-cover rounded-lg select-none"
        />
      )}
    </Section>
  )
}
