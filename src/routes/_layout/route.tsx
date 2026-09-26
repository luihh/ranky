import { createFileRoute, Outlet } from '@tanstack/react-router'
import useGlobalTheme from '@/hooks/useGlobalTheme'

import Navbar from '@/ui/Navbar'
import Footer from '@/ui/Footer'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent
})

function RouteComponent() {
  useGlobalTheme()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
