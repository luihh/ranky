import { useEffect } from 'react'
import { useGlobalColorStore } from '@/stores/globalColorStore'
import { generateTheme, removeTheme, hexToRgb } from '@/utils/generateTheme'

export default function useGlobalTheme() {
  const color = useGlobalColorStore((s) => s.color)

  useEffect(() => {
    if (color) {
      generateTheme(hexToRgb(color))
    } else {
      removeTheme()
    }
  }, [color])
}
