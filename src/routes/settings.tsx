import { createFileRoute } from '@tanstack/react-router'
import useGlobalTheme from '@/hooks/useGlobalTheme'

import Navbar from '@/ui/Navbar'
import ThemeSection from '@/ui/settings/ThemeSection'
import ScreenshotSection from '@/ui/settings/ScreenshotSection'
import DataSection from '@/ui/settings/DataSection'
import ScoringSection from '@/ui/settings/ScoringSection'

export const Route = createFileRoute('/settings')({
  ssr: false,
  component: RouteComponent
})

function RouteComponent() {
  useGlobalTheme()

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center gap-4 w-full md:w-[90%] p-6 mx-auto">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-sm opacity-50">
            *Changes made here apply to all albums by default, but individual album settings will
            override these values.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 justify-items-center">
          <ThemeSection />
          <ScreenshotSection />
          <ScoringSection />
          <DataSection />
        </div>
      </div>
    </>
  )
}
