import React from 'react'
import chroma from 'chroma-js'

import { smallestAngle } from './utils'

function error(a, b, map) {
  const aVal = map(a)
  return (map(b) - aVal) / aVal
}

function errorToString(fraction) {
  return `${(100 * fraction).toFixed(2)}%`
}

function degreesError(a, b, map) {
  return smallestAngle(map(a), map(b))
}

function degreesErrorToString(degrees) {
  return isNaN(degrees) ? '–' : `${degrees.toFixed(2)}°`
}

const ErrorReadout = ({ target, result, lcRatio }) => (
  <dl style={{ fontSize: '90%' }}>
    <dt>Difference</dt>
    <dd>
      {chroma
        .deltaE(target, result, lcRatio, 1 - lcRatio)
        .toFixed(2)}
    </dd>

    <dt>Hue error</dt>
    <dd>
      {degreesErrorToString(
        degreesError(target, result, c =>
          chroma(c).get('hsl.h')
        )
      )}
    </dd>

    <dt>Saturation error</dt>
    <dd>
      {errorToString(
        error(target, result, c => chroma(c).get('hsl.s'))
      )}
    </dd>

    <dt>Lightness error</dt>
    <dd>
      {errorToString(
        error(target, result, c => chroma(c).get('hsl.l'))
      )}
    </dd>
  </dl>
)

export default ErrorReadout
