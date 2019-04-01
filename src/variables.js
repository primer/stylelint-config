const {dirname, join} = require('path')
const visit = require('unist-util-visit')
const {select, selectAll} = require('unist-util-select')
const {parse, jsonify} = require('sast')
const {readFileSync} = require('fs')

module.exports = {
  readVariablesFromFile,
  readVariablesFromImports,
  readVariablesFromTree
}

function readVariablesFromFile(file, defs = {}) {
  const source = readFileSync(file, 'utf8')
  const tree = parse(source, {syntax: 'scss'})
  return readVariablesFromTree(tree, defs, {file})
}

function readVariablesFromImports(file, defs = {}) {
  const source = readFileSync(file, 'utf8')
  const tree = parse(source, {syntax: 'scss'})
  const dir = dirname(file)
  visit(tree, 'atkeyword', (node, index, parent) => {
    const ident = select('ident', node)
    if (ident && ident.value === 'import') {
      const importPath = select('string', parent)
      if (importPath) {
        const path = join(dir, stripQuotes(importPath.value))
        // console.warn(`reading from: ${importPath.value} => ${path}`)
        try {
          readVariablesFromImports(path, defs, {file: path, importedBy: file})
        } catch (error) {
          console.warn(`unable to read variables from ${path}: ${error}`)
        }
      } else {
        // console.warn(`no "string" in: ${parent.source}`)
      }
    }
  })
  readVariablesFromTree(tree, defs, {file})
  return defs
}

function readVariablesFromTree(tree, defs = {}, data) {
  for (const node of tree.children.filter(c => c.type === 'declaration')) {
    const vars = selectAll('value variable ident', node).map(ident => ident.value)
    let jsonified
    try {
      jsonified = jsonify(node)
    } catch (error) {
      console.warn(`Unable to jsonify(): ${JSON.stringify(node)} - ${error}`)
      continue
    }
    const {name, value} = jsonified
    if (typeof value === 'string' && value.startsWith('$')) {
      const key = value.substr(1)
      const ref = defs[key]
      if (!ref) {
        console.warn(`Unable to resolve "$${key}" in: ${data.file}`)
      }
      defs[name] = Object.assign(
        {
          value: ref && ref.value,
          type: 'variable',
          vars
        },
        data
      )
    } else {
      defs[name] = Object.assign(
        {
          value,
          type: 'static',
          vars
        },
        data
      )
    }
  }
  return defs
}

function stripQuotes(str) {
  return str.replace(/^['"](.+)['"]$/, '$1')
}
