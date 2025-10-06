import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)

export function primitivesVariables(type) {
  const variables = []

  const files = []
  switch (type) {
    case 'spacing':
      files.push('base/size/size.json')
      break
    case 'border':
      files.push('functional/size/border.json')
      files.push('functional/themes/light.json')
      break
    case 'typography':
      files.push('base/typography/typography.json')
      files.push('functional/typography/typography.json')
      break
    case 'box-shadow':
      files.push('functional/themes/light.json')
      files.push('functional/size/border.json')
      break
    case 'colors':
      files.push('functional/themes/light.json')
      break
  }

  for (const file of files) {
    // eslint-disable-next-line import/no-dynamic-require
    const data = require(`@primer/primitives/dist/styleLint/${file}`)

    for (const key of Object.keys(data)) {
      const token = data[key]
      const valueProp = '$value' in token ? '$value' : 'value'
      const values = typeof token[valueProp] === 'string' ? [token[valueProp]] : token[valueProp]

      variables.push({
        name: `--${token['name']}`,
        values,
      })
    }
  }

  return variables
}

const HAS_VALID_HEX = /#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})(?:$|[^\da-f])/i
const COLOR_FUNCTION_NAMES = ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch']

/**
 * Check if a value contains a valid 3, 4, 6 or 8 digit hex
 *
 * @param {string} value
 * @returns {boolean}
 */
export function hasValidColor(value) {
  return HAS_VALID_HEX.test(value) || COLOR_FUNCTION_NAMES.includes(value)
}

export function walkGroups(root, validate) {
  for (const node of root.nodes) {
    if (node.type === 'function') {
      walkGroups(node, validate)
    } else {
      validate(node)
    }
  }
  return root
}
