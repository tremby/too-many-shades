import chroma from 'chroma-js'

import { sets as colorSets } from './colors'

export function ucFirst(string) {
  return string.substring(0, 1).toLocaleUpperCase() + string.substring(1)
}

export function mod(a, n) {
  return a - Math.floor(a / n) * n
}

export function smallestAngle(a, b) {
  const diff = a - b
  return mod(diff + 180, 360) - 180
}

export function kebabCase(string) {
  return string.toLowerCase().replace(/[^a-z0-9]+/gi, '-')
}

export function camelCase(string) {
  return string.replace(/[^A-Z0-9]+(.)/gi, (m, char) => char.toUpperCase())
}

export function closestColor(color) {
  return colorSets
    .reduce((all, { colors }) => [...all, ...Object.entries(colors)], [])
    .reduce(
      (best, [name, testColor]) => {
        if (best.difference === 0) return best // Exit early on exact match
        const difference = chroma.deltaE(color, testColor)
        if (difference < best.difference)
          return { difference, name, color: testColor }
        return best
      },
      { difference: Infinity, name: null, color: null }
    )
}
