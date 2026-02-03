import { FastAverageColor } from 'fast-average-color'

const fac = new FastAverageColor()

type RGB = [number, number, number]

const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)))

function adjustColor([r, g, b]: RGB, factor = 1): RGB {
  return [clamp(r * factor), clamp(g * factor), clamp(b * factor)]
}

function luminance([r, g, b]: RGB) {
  return r * 0.299 + g * 0.587 + b * 0.114
}

function rgbToCss([r, g, b]: RGB, alpha = 1) {
  return alpha === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function hexToRgb(hex: string): RGB {
  const normalized = hex.replace(/^#/, '')

  if (![3, 6].includes(normalized.length)) {
    throw new Error('Invalid hex color')
  }

  const fullHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized

  const r = parseInt(fullHex.slice(0, 2), 16)
  const g = parseInt(fullHex.slice(2, 4), 16)
  const b = parseInt(fullHex.slice(4, 6), 16)

  return [r, g, b]
}

export function rgbToHex([r, g, b]: RGB): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export async function getImgColorPalette(img: HTMLImageElement | null): Promise<RGB | null> {
  if (!img) return null

  try {
    const dominant = await fac.getColorAsync(img)
    if (!dominant) return null

    const dominantRGB = hexToRgb(dominant.hex)
    return dominantRGB
  } catch (error) {
    console.error('Color extraction failed:', error)
    return null
  }
}

export function generateTheme(base: RGB): void {
  const lum = luminance(base)

  const bgColor = adjustColor(base, 0.35)
  const accentColor = adjustColor(base, 2)
  const textColor = lum < 60 ? adjustColor(base, 3.6) : adjustColor(base, 2.6)

  const theme = {
    '--color-bg': rgbToCss(bgColor),
    '--color-surface': rgbToCss(accentColor, 0.15),
    '--color-border': rgbToCss(accentColor, 0.5),
    '--color-text': rgbToCss(textColor)
  }

  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
  })
}

export function removeTheme(): void {
  const properties = ['--color-bg', '--color-surface', '--color-border', '--color-text']
  properties.forEach((property) => {
    document.documentElement.style.removeProperty(property)
  })
}
