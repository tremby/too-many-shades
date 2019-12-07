import React from 'react'

const Instructions = () => (
  <>
    <p>
      <big>
        This tool helps you find a{' '}
        <a href="https://en.wikipedia.org/wiki/Tints_and_shades">
          tint or shade
        </a>{' '}
        of a source colour to match a target colour as closely as possible.
      </big>
    </p>
    <p>
      Pick your source colour. Name it if you like. Pick your target colour.
    </p>
    <p>
      The best match based on a particular metric is found for you, and you even
      get a suggested name. You can adjust the parameters for the matching
      algorithm or you can manually tweak the colour. Once you're happy, you can
      grab CSS for the colour mod from below.
    </p>
  </>
)

export default Instructions
