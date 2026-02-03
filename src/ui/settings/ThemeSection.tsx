import { useGlobalColorStore } from '@/stores/globalColorStore'
import { generateTheme, hexToRgb, removeTheme } from '@/utils/generateTheme'

import Section from '@/ui/Section'
import ColorPicker from '@/ui/ColorPicker'
import { useState } from 'react'

export default function ThemeComponent() {
  const { color: globalColor, defaultColor, setColor: setGlobalColor } = useGlobalColorStore()
  const [color, setColor] = useState<string>(globalColor)

  function handleColorPicker(c: string) {
    const base = hexToRgb(c)
    generateTheme(base)
    setColor(c)
  }

  function handleReset() {
    removeTheme()
    setColor(defaultColor)
  }

  function handleSave() {
    setGlobalColor(color)
  }

  return (
    <Section title="Global Theme">
      {color && <ColorPicker color={color} onChange={handleColorPicker} reset={handleReset} />}
      <button onClick={handleSave}>Save Global Theme</button>
    </Section>
  )
}
