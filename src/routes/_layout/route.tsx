import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useGlobalColorStore } from '@/stores/globalColorStore'
import { generateTheme, hexToRgb, removeTheme } from '@/utils/generateTheme'

import Navbar from '@/ui/Navbar'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent
})

function RouteComponent() {
  const { color } = useGlobalColorStore()

  useEffect(() => {
    if (color) {
      generateTheme(hexToRgb(color))
    } else {
      removeTheme()
    }
  }, [color])

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}
