import React from 'react'
import c from 'classnames'

export const Row = ({ align, children, className, ...otherProps }) => (
  <div className={c('flexRow', align, className)} {...otherProps}>
    {children}
  </div>
)

export const Col = ({ children, className, ...otherProps }) => (
  <div className={c(className, 'flexCol')} {...otherProps}>
    {children}
  </div>
)

export const PadBox = ({ children }) => <div className="pad">{children}</div>
