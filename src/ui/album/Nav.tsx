import { CornerDownLeft, House, Settings, WandSparkles } from 'lucide-react'
import { Link, useRouter } from '@tanstack/react-router'

export default function Nav({
  size,
  settingsVisible,
  setSettingsVisible,
  smartRankVisible,
  setSmartRankVisible
}: {
  size: number
  settingsVisible: boolean
  setSettingsVisible: (isVisible: boolean) => void
  smartRankVisible: boolean
  setSmartRankVisible: (isVisible: boolean) => void
}) {
  const router = useRouter()

  return (
    <nav className="lg:fixed m-4 flex gap-2 z-10">
      <button className="border-none!" onClick={() => router.history.back()}>
        <CornerDownLeft size={size} />
      </button>
      <Link to="/" draggable={false}>
        <button className="border-none!">
          <House size={size} />
        </button>
      </Link>
      <button className="border-none!" onClick={() => setSettingsVisible(!settingsVisible)}>
        <Settings size={size} />
      </button>
      <button className="border-none!" onClick={() => setSmartRankVisible(!smartRankVisible)}>
        <WandSparkles size={size} />
      </button>
    </nav>
  )
}
