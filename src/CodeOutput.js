import React from 'react'

import { kebabCase, camelCase } from './utils'

import { Row } from './layout'

const CodeOutput = ({ sourceName, resultName, type, amount }) => {
  const [capitalizationStyle, setCapitalizationStyle] = React.useState('kebab')
  const capitalizationFunc =
    capitalizationStyle === 'kebab' ? kebabCase : camelCase

  function handleCapitalizationStyleChange(event) {
    if (event.currentTarget.checked) {
      setCapitalizationStyle(event.currentTarget.value)
    }
  }

  return (
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
                --{capitalizationFunc(resultName)}
              </span>
              : <span className="func">color-mod</span>(
              <span className="func">var</span>(
              <span className="var">
                --{capitalizationFunc(sourceName)}
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
                ${capitalizationFunc(resultName)}
              </span>
              : <span className="func">mix</span>(
              {type === 'tint' ? 'white' : 'black'},{' '}
              <span className="var">
                ${capitalizationFunc(sourceName)}
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
                ${capitalizationFunc(resultName)}
              </span>
              : <span className="func">{type}</span>(
              <span className="var">
                ${capitalizationFunc(sourceName)}
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
                @{capitalizationFunc(resultName)}
              </span>
              : <span className="func">{type}</span>(
              <span className="var">
                @{capitalizationFunc(sourceName)}
              </span>
              , <span className="num">{+(100 * amount).toFixed(1)}</span>
              %);
            </code>
          </pre>
        </dd>
      </dl>
    </Row>
  )
}

export default CodeOutput
