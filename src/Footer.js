import React from 'react'

import { PadBox } from './layout'

const Footer = () => (
  <footer>
    <PadBox>
      <p>
        Colour name suggestions are taken as the closest match found from a
        combination of the{' '}
        <a href="https://drafts.csswg.org/css-color/#named-colors">
          list of CSS named colours
        </a>{' '}
        and the{' '}
        <a href="https://blog.xkcd.com/2010/05/03/color-survey-results/">
          XKCD colour survey list
        </a>
        .
      </p>
      <p>
        The difference between colours is measured using{' '}
        <a href="https://en.wikipedia.org/wiki/Color_difference#CMC_l:c_.281984.29">
          the CMC l:c metric
        </a>
        , with parameters set via the “prefer to match lightness/chroma”
        option given above.
      </p>
      <p style={{ textAlign: 'center' }}>
        By <a href="https://bartnagel.ca">Bart Nagel</a>.{' '}
        <a href="https://github.com/tremby/too-many-shades">
          Source code on Github
        </a>
        .
      </p>
    </PadBox>
  </footer>
)

export default Footer
