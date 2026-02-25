import { useEffect } from 'react'
import { useGlobalColorStore } from '@/stores/globalColorStore'
import { generateTheme, hexToRgb, removeTheme } from '@/utils/generateTheme'

export default function useGlobalTheme() {
  const { color } = useGlobalColorStore()

  useEffect(() => {
    if (color) {
      generateTheme(hexToRgb(color))
    } else {
      removeTheme()
    }
  }, [color])
}
