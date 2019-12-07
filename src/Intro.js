import React from 'react'

import { ucFirst } from './utils'

const Intro = ({ color, colorIsLight }) => (
  <>
    <h1>Too many shades</h1>
    <p>
      Your designer has given you a style guide, and it even has named colours
      in it! You add those to your constants sheet, and start building. But soon
      you find a shade of {color} which isn’t on the sheet. You add it and name
      it and keep going. But you find more and more. You’ve added eight or nine
      by now, and you keep having to rename them, because what goes between{' '}
      <code>light{ucFirst(color)}</code> and{' '}
      <code>lighter{ucFirst(color)}</code>? You move on to the next layout. This
      one has striped table rows, it has icons, it has accents, every single one
      a different shade of {color}. When will it end? How many more synonyms for
      “light” and “dark” can you possibly come up with?
    </p>
    <p>
      Time to stop this silliness. They should have been mods of each other from
      the start. This {color} is probably some kind of{' '}
      {colorIsLight ? 'shade' : 'tint'} of <code>brand{ucFirst(color)}</code>?
      Maybe? Let’s see how close we can get.
    </p>
  </>
)

export default Intro
