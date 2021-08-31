const path = require('path')
const {ruleName} = require('../plugins/no-deprecated-colors')

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/no-deprecated-colors.js'],
  ruleName,
  config: [
    true,
    {
      deprecatedFile: path.join(__dirname, '__fixtures__/deprecations.json')
    }
  ],
  fix: true,
  accept: [{code: '.x { color: var(--color-fg-default, var(--color-text-primary)); }'}],
  reject: [
    {
      code: '.x { border: 1px solid var(--color-text-primary); }',
      fixed: '.x { border: 1px solid var(--color-fg-default); }',
      message: `--color-text-primary is a deprecated color variable. Please use the replacement --color-fg-default. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6
    },
    {
      code: '.x { border: 1px solid var(--color-text-secondary); }',
      unfixable: true,
      message: `--color-text-secondary is a deprecated color variable. Please use one of (--color-fg-one, --color-fg-two). (primer/no-deprecated-colors)`,
      line: 1,
      column: 6
    },
    {
      code: '.x { border: 1px solid var(--color-text-white); }',
      unfixable: true,
      message: `--color-text-white is a deprecated color variable. Please consult the primer color docs for a replacement. https://primer.style/primitives (primer/no-deprecated-colors)`,
      line: 1,
      column: 6
    }
  ]
})
