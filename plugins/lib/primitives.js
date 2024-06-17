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
      const intValue = parseInt(size['original']['value'])
      if (![2, 6].includes(intValue)) {
        values.push(`${intValue + 1}px`)
        values.push(`${intValue - 1}px`)
      }

      variables.push({
        name: `--${size['name']}`,
        values,
      })
    }
  }

  return variables
}
