import { createFileRoute, Outlet } from '@tanstack/react-router'
import useGlobalTheme from '@/hooks/useGlobalTheme'

import Navbar from '@/ui/Navbar'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent
})

function RouteComponent() {
  useGlobalTheme()

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}
