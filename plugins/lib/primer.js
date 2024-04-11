import {existsSync} from 'fs'
import {join} from 'path'
import {createRequire} from 'module'

export function getPrimerModuleDir() {
  const require = createRequire(import.meta.url)
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

export function requirePrimerFile(path) {
  const require = createRequire(import.meta.url)
  const fullPath = join(getPrimerModuleDir(), path)
  // eslint-disable-next-line import/no-dynamic-require
  return require(fullPath)
}