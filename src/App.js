import React from 'react'
import chroma from 'chroma-js'

import { ucFirst, closestColor } from './utils'
import { Row, Col, PadBox } from './layout'

import Swatch, { HexReadout } from './Swatch'

import Intro from './Intro'
import Instructions from './Instructions'
import ErrorReadout from './ErrorReadout'
import CodeOutput from './CodeOutput'
import Footer from './Footer'

import './App.css'

const DEFAULT_COLORS = [
  ['#101ca7', 'blue'],
  ['#10aded', 'blue'],
  ['#20b075', 'green'],
  ['#5a17ed', 'purple'],
  ['#a90110', 'red'],
  ['#ba11e7', 'pink'],
  ['#ba271e', 'red'],
  ['#ba6e15', 'orange'],
  ['#bada55', 'green'],
  ['#c0ffee', 'blue'],
  ['#de1e7e', 'pink'],
  ['#facade', 'pink'],
  ['#face17', 'yellow'],
]
const DEFAULT_COLOR =
  DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]

const App = () => {
  const [lcRatio, setLcRatio] = React.useState(0.3)
  const [autoOptimize, setAutoOptimize] = React.useState(true)

  const [source, setSource] = React.useState(DEFAULT_COLOR[0])
  const [sourceName, setSourceName] = React.useState('')
  const [autoSourceName, setAutoSourceName] = React.useState(true)
  const sourceRef = React.useRef()

  const defaultColorIsLight = chroma(DEFAULT_COLOR[0]).luminance() > 0.5
  const [target, setTarget] = React.useState(
    chroma(DEFAULT_COLOR[0]).set('hsl.l', defaultColorIsLight ? 0.15 : 0.85)
  )
  const targetRef = React.useRef()

  const [resultName, setResultName] = React.useState('')
  const [autoResultName, setAutoResultName] = React.useState(true)

  const [type, setType] = React.useState(getOptimized().type)
  const [amount, setAmount] = React.useState(getOptimized().amount)
  const [manuallyTweaked, setManuallyTweaked] = React.useState(false)

  function handleTypeChange(event) {
    if (event.currentTarget.checked) {
      setType(event.currentTarget.value)
    }
  }

  function mix(a, mode) {
    return chroma.mix(source, mode === 'tint' ? 'white' : 'black', a)
  }

  function getOptimized() {
    // For now this is brute force over the full range of tints and shades
    // at 0.5% increments
    return ['tint', 'shade'].reduce(
      (bestType, mode) => {
        const best = Array.from(Array(201).keys())
          .map(n => n / 200)
          .reduce(
            (best, testAmount) => {
              const mixed = mix(testAmount, mode)
              const difference = chroma.deltaE(
                target,
                mixed,
                lcRatio,
                1 - lcRatio
              )
              if (difference < best.difference)
                return { color: mixed, difference, amount: testAmount }
              return best
            },
            { color: null, difference: Infinity, amount: null }
          )
        if (best.difference < bestType.difference)
          return { ...best, type: mode }
        return bestType
      },
      { color: null, difference: Infinity, amount: null, type: null }
    )
  }

  function optimize() {
    const best = getOptimized()
    setManuallyTweaked(false)
    setType(best.type)
    setAmount(best.amount)
  }

  const result = mix(amount, type)
  const derivedSourceName = autoSourceName
    ? closestColor(source).name
    : sourceName
  const derivedResultName = autoResultName
    ? closestColor(result).name
    : resultName

  return (
    <div className="container">
      <header>
        <PadBox>
          <Intro color={DEFAULT_COLOR[1]} colorIsLight={defaultColorIsLight} />
          <hr />
          <Instructions />
        </PadBox>
      </header>

      <main>
        <PadBox>
          <Row align="top">
            <fieldset>
              <legend>Optimization options</legend>
              <Row align="baseline">
                <label htmlFor="lcRatioSlider">Prefer to match</label>
                lightness
                <input
                  id="lcRatioSlider"
                  type="range"
                  min="0.01"
                  max="0.99"
                  value={lcRatio}
                  onChange={event => {
                    setLcRatio(event.currentTarget.value)
                    if (autoOptimize) optimize()
                  }}
                  step="0.01"
                  style={{ alignSelf: 'center' }}
                />
                chroma
              </Row>
              <label>
                <input
                  type="checkbox"
                  checked={autoOptimize}
                  onChange={event => {
                    setAutoOptimize(event.currentTarget.checked)
                    if (event.currentTarget.checked) optimize()
                  }}
                />{' '}
                Auto-optimize
              </label>
            </fieldset>

            <fieldset>
              <legend>Modification</legend>

              <Row align="baseline">
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="tint"
                    checked={type === 'tint'}
                    onChange={handleTypeChange}
                  />{' '}
                  Tint
                </label>

                <label>
                  <input
                    type="radio"
                    name="type"
                    value="shade"
                    checked={type === 'shade'}
                    onChange={handleTypeChange}
                  />{' '}
                  Shade
                </label>
              </Row>

              <Row>
                <label>{ucFirst(type)} amount</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  value={amount}
                  onChange={event => {
                    setAmount(event.currentTarget.value)
                    setManuallyTweaked(true)
                  }}
                  step="0.001"
                />
                <span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={Math.round(amount * 1000) / 10}
                    onChange={event => {
                      setAmount(event.currentTarget.value / 100)
                      setManuallyTweaked(true)
                    }}
                    style={{ width: '4em' }}
                  />
                  %
                </span>
              </Row>
            </fieldset>
          </Row>
        </PadBox>

        <div className="swatches">
          <Swatch
            name={derivedSourceName}
            color={source}
            onClick={event => {
              if (
                event.target.closest('input') ||
                event.target.closest('label')
              )
                return
              sourceRef.current.click()
            }}
          >
            <Col>
              <h2>Source</h2>
              <Row>
                <input
                  type="color"
                  value={source}
                  onChange={event => {
                    setSource(event.currentTarget.value)
                    if (autoOptimize) optimize()
                  }}
                  ref={sourceRef}
                />
                <HexReadout />
              </Row>
              <Row>
                <input
                  type="text"
                  value={derivedSourceName}
                  readOnly={autoSourceName}
                  onFocus={() => {
                    setAutoSourceName(false)
                    setSourceName(derivedSourceName)
                  }}
                  onBlur={() => {
                    if (closestColor(source).name === sourceName)
                      setAutoSourceName(true)
                  }}
                  onChange={event => setSourceName(event.currentTarget.value)}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={autoSourceName}
                    onChange={event =>
                      setAutoSourceName(event.currentTarget.checked)
                    }
                  />{' '}
                  Auto-name
                </label>
              </Row>
            </Col>
          </Swatch>

          <Swatch
            name={derivedResultName}
            color={target}
            onClick={event => {
              if (event.target.closest('input')) return
              targetRef.current.click()
            }}
          >
            <Col>
              <h2>Target</h2>
              <Row>
                <input
                  type="color"
                  value={target}
                  onChange={event => {
                    setTarget(event.currentTarget.value)
                    if (autoOptimize) optimize()
                  }}
                  ref={targetRef}
                />
                <HexReadout />
              </Row>
            </Col>
          </Swatch>

          <Swatch color={result}>
            <Col>
              <Row>
                <Col>
                  <h2>Result</h2>
                  <Row>
                    <HexReadout />
                    {(!autoOptimize || manuallyTweaked) && (
                      <button type="button" onClick={() => optimize()}>
                        Optimize
                      </button>
                    )}
                  </Row>
                  <Row>
                    <input
                      type="text"
                      value={derivedResultName}
                      readOnly={autoResultName}
                      onFocus={() => {
                        setAutoResultName(false)
                        setResultName(derivedResultName)
                      }}
                      onBlur={() => {
                        if (closestColor(target).name === resultName)
                          setAutoResultName(true)
                      }}
                      onChange={event =>
                        setResultName(event.currentTarget.value)
                      }
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={autoResultName}
                        onChange={event =>
                          setAutoResultName(event.currentTarget.checked)
                        }
                      />{' '}
                      Auto-name
                    </label>
                  </Row>
                </Col>
                <div>
                  <ErrorReadout target={target} result={result} lcRatio={lcRatio} />
                </div>
              </Row>
            </Col>
          </Swatch>
        </div>

        <PadBox>
          <CodeOutput sourceName={derivedSourceName} resultName={derivedResultName} type={type} amount={amount} />
        </PadBox>
      </main>
      <Footer />
    </div>
  )
}

export default App
