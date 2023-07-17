const TapMap = require('tap-map')
const globby = require('globby')
const matchAll = require('string.prototype.matchall')
const stylelint = require('stylelint')
const {readFileSync} = require('fs')

const ruleName = 'primer/no-unused-vars'

const cwd = process.cwd()
const COLON = ':'
const SCSS_VARIABLE_PATTERN = /(\$[-\w]+)/g

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: name => `The variable "${name}" is not referenced.`,
})

const cache = new TapMap()

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  if (!enabled) {
    return noop
  }

  const {files = ['**/*.scss', '!node_modules'], variablePattern = SCSS_VARIABLE_PATTERN, verbose = false} = options
  // eslint-disable-next-line no-console
  const log = verbose ? (...args) => console.warn(...args) : noop
  const cacheOptions = {files, variablePattern, cwd}
  const {refs} = getCachedVariables(cacheOptions, log)

  return (root, result) => {
    root.walkDecls(decl => {
      for (const [name] of matchAll(decl.prop, variablePattern)) {
        if (!refs.has(name)) {
          stylelint.utils.report({
            message: messages.rejected(name),
            node: decl,
            result,
            ruleName,
          })
        } else {
          const path = stripCwd(decl.source.input.file)
          log(`${name} declared in ${path} ref'd in ${pluralize(refs.get(name).size, 'file')}`)
        }
      }
    })
  }
})

function getCachedVariables(options, log) {
  const key = JSON.stringify(options)
  return cache.tap(key, () => {
    const {files, variablePattern} = options
    const decls = new TapMap()
    const refs = new TapMap()

    log(`Looking for variables in ${files} ...`)
    for (const file of globby.sync(files)) {
      const css = readFileSync(file, 'utf8')
      for (const match of matchAll(css, variablePattern)) {
        const after = css.substr(match.index + match[0].length)
        const name = match[0]
        if (after.startsWith(COLON)) {
          decls.tap(name, set).add(file)
        } else {
          refs.tap(name, set).add(file)
        }
      }
    }
    log(`Found ${decls.size} declarations, ${pluralize(refs.size, 'reference')}.`)

    for (const [name, filesList] of decls.entries()) {
      const fileRefs = refs.get(name)
      if (fileRefs) {
        log(`variable "${name}" declared in ${pluralize(filesList.size, 'file')}, ref'd in ${fileRefs.size}`)
      } else {
        log(`[!] variable "${name}" declared in ${Array.from(filesList)[0]} is not referenced`)
      }
    }

    return {decls, refs}
  })
}

function noop() {}

function set() {
  return new Set()
}

function stripCwd(path) {
  return path.startsWith(cwd) ? path.substr(cwd.length + 1) : path
}

function pluralize(num, str, plural = `${str}s`) {
  return num === 1 ? `${num} ${str}` : `${num} ${plural}`
}
