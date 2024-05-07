export async function primitivesVariables(type) {
  const variables = []

  const files = []
  switch (type) {
    case 'size':
      files.push('base/size/size.json')
      break
  }

  for (const file of files) {
    const {default: data} = await import(`@primer/primitives/dist/styleLint/${file}`, {
      assert: {
        type: 'json',
      },
    })

    for (const key of Object.keys(data)) {
      const size = data[key]
      const values = size['value']
      values.push(`${parseInt(size['original']['value']) + 1}px`)
      values.push(`${parseInt(size['original']['value']) - 1}px`)

      variables.push({
        name: `--${size['name']}`,
        values,
      })
    }
  }

  return variables
}
