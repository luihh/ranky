import type { Album } from '@/lib/deezer'

import Dialog from '@/ui/Dialog'
import ThemeSection from './ThemeSection'
import DataSection from './DataSection'
import ScreenshotSection from './ScreenshotSection'
import ScoringSection from './ScoringSection'

type Props = {
  album: Album
  isVisible: boolean
  setSettingsVisible: (v: boolean) => void
}

export default function SettingsDialog({ album, isVisible, setSettingsVisible }: Props) {
  return (
    <Dialog isVisible={isVisible} onClose={() => setSettingsVisible(false)}>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 justify-items-center">
        <ThemeSection album={album} />
        <ScreenshotSection album={album} />
        <ScoringSection album={album} />
        <DataSection album={album} />
      </div>
    </Dialog>
  )
}
