import type { Album } from '@/lib/deezer'
import { Activity } from 'react'
import { X } from 'lucide-react'

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
    <Activity mode={isVisible ? 'visible' : 'hidden'}>
      <div
        className="fixed top-0 bg-black/75 h-screen w-screen z-50 content-center"
        onClick={() => setSettingsVisible(false)}
      >
        <div
          className="m-auto p-4 w-[90%] max-h-[90vh] bg-bg rounded-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="border-none!" onClick={() => setSettingsVisible(!isVisible)}>
            <X size={16} />
          </button>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 justify-items-center">
            <ThemeSection album={album} />
            <ScreenshotSection album={album} />
            <ScoringSection album={album} />
            <DataSection album={album} />
          </div>
        </div>
      </div>
    </Activity>
  )
}
