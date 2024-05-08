import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)

export async function primitivesVariables(type) {
  const variables = []

  const files = []
  switch (type) {
    case 'size':
      files.push('base/size/size.json')
      break
  }

  for (const file of files) {
    // eslint-disable-next-line import/no-dynamic-require
    const data = require(`@primer/primitives/dist/styleLint/${file}`)

    for (const key of Object.keys(data)) {
      const size = data[key]
      const values = size['value']

      variables.push({
        name: `--${size['name']}`,
        values,
      })
    }
  }

  return variables
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