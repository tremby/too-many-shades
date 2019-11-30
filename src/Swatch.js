import React from 'react'
import chroma from 'chroma-js'

import c from 'classnames'

import './Swatch.css'

const SwatchContext = React.createContext(null)

const Swatch = ({ children, className, color, ...otherProps }) => (
  <SwatchContext.Provider value={color}>
    <div
      className={c(className, 'swatch', {
        light: chroma(color).luminance() > 0.5,
      })}
      style={{ backgroundColor: color }}
      {...otherProps}
    >
      {children}
    </div>
  </SwatchContext.Provider>
)

export const HexReadout = () => {
  const color = React.useContext(SwatchContext)
  return <big>{chroma(color).hex()}</big>
}

export default Swatch
