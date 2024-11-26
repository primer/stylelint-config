import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import pluginJson from '@rollup/plugin-json'
import packageJson from './package.json' assert {type: 'json'}

const external = ['dependencies', 'devDependencies', 'peerDependencies'].flatMap(type => {
  if (packageJson[type]) {
    return Object.keys(packageJson[type]).map(name => {
      return new RegExp(`^${name}(/.*)?`)
    })
  }
  return []
})

const baseConfig = {
  input: 'index.js',
  external: [...external, new RegExp('^node:')],
  plugins: [nodeResolve(), pluginJson(), commonjs()],
}

export default [
  {
    ...baseConfig,
    output: {
      format: 'esm',
      file: 'dist/index.mjs',
      importAttributesKey: 'with',
    },
  },
  {
    ...baseConfig,
    output: {
      format: 'cjs',
      file: 'dist/index.cjs',
    },
  },
]
