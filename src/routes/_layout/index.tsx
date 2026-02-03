import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { type HomeTab, Tabs } from '@/ui/home/Tabs'
import Rankings from '@/ui/home/Rankings'

export const Route = createFileRoute('/_layout/')({
  component: RouteComponent
})

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<HomeTab>('albums')
  void setActiveTab
  void Tabs

  return (
    <>
      {/* <Tabs activeTab={activeTab} setActiveTab={setActiveTab} /> */}

      {activeTab === 'albums' && <Rankings />}
    </>
  )
}
