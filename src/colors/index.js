import { colors as w3cx11 } from 'chroma-js'
import xkcd from './xkcd'

export const sets = [
  {
    name: 'W3C/X11',
    colors: w3cx11,
  },
  {
    name: 'XKCD',
    colors: xkcd,
  },
]

export const colors = { xkcd, w3cx11 }
