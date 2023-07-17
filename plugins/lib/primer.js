const {existsSync} = require('fs')
const {join} = require('path')

module.exports = {
  getPrimerModuleDir,
  requirePrimerFile,
}

function getPrimerModuleDir() {
  const cwd = process.cwd()
  const localPackageJson = join(cwd, 'package.json')
  if (existsSync(localPackageJson)) {
    // eslint-disable-next-line import/no-dynamic-require
    const {name} = require(localPackageJson)
    if (name === '@primer/css') {
      return cwd
    }
  }
  return '@primer/css'
}

function requirePrimerFile(path) {
  const fullPath = join(getPrimerModuleDir(), path)
  // eslint-disable-next-line import/no-dynamic-require
  return require(fullPath)
}
