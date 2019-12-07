import React from 'react'
import chroma from 'chroma-js'

import c from 'classnames'

import { sets as colorSets } from './colors'
import Swatch, { HexReadout } from './Swatch'

import './App.css'

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
  return `${degrees.toFixed(2)}°`
}

function mod(a, n) {
  return a - Math.floor(a / n) * n
}

function smallestAngle(a, b) {
  const diff = a - b
  return mod(diff + 180, 360) - 180
}

function closestColor(color) {
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

function ucFirst(string) {
  return string.substring(0, 1).toLocaleUpperCase() + string.substring(1)
}

function kebabCase(string) {
  return string.toLowerCase().replace(/[^a-z0-9]+/gi, '-')
}

function camelCase(string) {
  return string.replace(/[^A-Z0-9]+(.)/gi, (m, char) => char.toUpperCase())
}

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

  const [capitalizationStyle, setCapitalizationStyle] = React.useState('kebab')
  const capitalizationFunc =
    capitalizationStyle === 'kebab' ? kebabCase : camelCase

  function handleTypeChange(event) {
    if (event.currentTarget.checked) {
      setType(event.currentTarget.value)
    }
  }

  function handleCapitalizationStyleChange(event) {
    if (event.currentTarget.checked) {
      setCapitalizationStyle(event.currentTarget.value)
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
          <h1>Too many shades</h1>
          <p>
            Your designer has given you a style guide, and it even has named
            colours in it! You add those to your constants sheet, and start
            building. But soon you find a shade of {DEFAULT_COLOR[1]} which
            isn’t on the sheet. You add it and name it and keep going. But you
            find more and more. You’ve added eight or nine by now, and you keep
            having to rename them, because what goes between{' '}
            <code>light{ucFirst(DEFAULT_COLOR[1])}</code> and{' '}
            <code>lighter{ucFirst(DEFAULT_COLOR[1])}</code>? You move on to the
            next layout. This one has striped table rows, it has icons, it has
            accents, every single one a different shade of {DEFAULT_COLOR[1]}.
            When will it end? How many more synonyms for “light” and “dark” can
            you possibly come up with?
          </p>
          <p>
            Time to stop this silliness. They should have been mods of each
            other from the start. This {DEFAULT_COLOR[1]} is probably some kind
            of {defaultColorIsLight ? 'shade' : 'tint'} of{' '}
            <code>brand{ucFirst(DEFAULT_COLOR[1])}</code>? Maybe? Let’s see how
            close we can get.
          </p>
          <hr />
          <p>
            <big>
              This tool helps you find a{' '}
              <a href="https://en.wikipedia.org/wiki/Tints_and_shades">
                tint or shade
              </a>{' '}
              of a source colour to match a target colour as closely as
              possible.
            </big>
          </p>
          <p>
            Pick your source colour. Name it if you like. Pick your target
            colour.
          </p>
          <p>
            The best match based on a particular metric is found for you, and
            you even get a suggested name. You can adjust the parameters for the
            matching algorithm or you can manually tweak the colour. Once you're
            happy, you can grab CSS for the colour mod from below.
          </p>
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
                </div>
              </Row>
            </Col>
          </Swatch>
        </div>

        <PadBox>
          <Row align="top">
            <fieldset>
              <legend>Code output options</legend>
              <div>
                <label>
                  <input
                    type="radio"
                    value="kebab"
                    checked={capitalizationStyle === 'kebab'}
                    onChange={handleCapitalizationStyleChange}
                  />{' '}
                  Kebab case
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="camel"
                    checked={capitalizationStyle === 'camel'}
                    onChange={handleCapitalizationStyleChange}
                  />{' '}
                  Camel case
                </label>
              </div>
            </fieldset>
            <dl>
              <dt>
                <a href="https://github.com/jonathantneal/postcss-color-mod-function">
                  PostCSS
                </a>
              </dt>
              <dd>
                <pre>
                  <code>
                    <span className="var">
                      --{capitalizationFunc(derivedResultName)}
                    </span>
                    : <span className="func">color-mod</span>(
                    <span className="func">var</span>(
                    <span className="var">
                      --{capitalizationFunc(derivedSourceName)}
                    </span>
                    ) <span className="func">{type}</span>(
                    <span className="num">{+(100 * amount).toFixed(1)}</span>
                    %));
                  </code>
                </pre>
              </dd>

              <dt>
                <a href="https://sass-lang.com/documentation/modules/color#mix">
                  Sass
                </a>
              </dt>
              <dd>
                <pre>
                  <code>
                    <span className="var">
                      ${capitalizationFunc(derivedResultName)}
                    </span>
                    : <span className="func">mix</span>(
                    {type === 'tint' ? 'white' : 'black'},{' '}
                    <span className="var">
                      ${capitalizationFunc(derivedSourceName)}
                    </span>
                    , <span className="num">{+(100 * amount).toFixed(1)}</span>
                    %);
                  </code>
                </pre>
              </dd>

              <dt>
                <a href="http://compass-style.org/reference/compass/helpers/colors/">
                  Sass with Compass
                </a>
              </dt>
              <dd>
                <pre>
                  <code>
                    <span className="var">
                      ${capitalizationFunc(derivedResultName)}
                    </span>
                    : <span className="func">{type}</span>(
                    <span className="var">
                      ${capitalizationFunc(derivedSourceName)}
                    </span>
                    , <span className="num">{+(100 * amount).toFixed(1)}</span>
                    %);
                  </code>
                </pre>
              </dd>

              <dt>
                <a href="http://lesscss.org/functions/#color-operations">
                  Less
                </a>
              </dt>
              <dd>
                <pre>
                  <code>
                    <span className="var">
                      @{capitalizationFunc(derivedResultName)}
                    </span>
                    : <span className="func">{type}</span>(
                    <span className="var">
                      @{capitalizationFunc(derivedSourceName)}
                    </span>
                    , <span className="num">{+(100 * amount).toFixed(1)}</span>
                    %);
                  </code>
                </pre>
              </dd>
            </dl>
          </Row>
        </PadBox>
      </main>
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
    </div>
  )
}

const Row = ({ align, children, className, ...otherProps }) => (
  <div className={c('flexRow', align, className)} {...otherProps}>
    {children}
  </div>
)

const Col = ({ children, className, ...otherProps }) => (
  <div className={c(className, 'flexCol')} {...otherProps}>
    {children}
  </div>
)

const PadBox = ({ children }) => <div className="pad">{children}</div>

export default App
