import type { Ingredient } from '../data/ingredients'

const hexToRgb = (hex: string) => {
  const clean = hex.replace('#', '')
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

const toHex = (value: number) => Math.round(value).toString(16).padStart(2, '0')

export const averageColor = (items: Ingredient[]) => {
  if (!items.length) return '#f2b264'
  const total = items.reduce(
    (acc, item) => {
      const rgb = hexToRgb(item.color)
      return { r: acc.r + rgb.r, g: acc.g + rgb.g, b: acc.b + rgb.b }
    },
    { r: 0, g: 0, b: 0 },
  )

  return `#${toHex(total.r / items.length)}${toHex(total.g / items.length)}${toHex(total.b / items.length)}`
}
