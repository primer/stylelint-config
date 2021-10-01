const path = require('path')
const {ruleName} = require('../plugins/no-deprecated-colors')

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/no-deprecated-colors.js'],
  ruleName,
  config: [
    true,
    {
      deprecatedFile: path.join(__dirname, '__fixtures__/deprecations.json'),
      removedFile: path.join(__dirname, '__fixtures__/removed.json')
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
      code: '.x { border: 1px solid var(--color-text-primary); .foo { color: var(--color-text-primary); } }',
      fixed: '.x { border: 1px solid var(--color-fg-default); .foo { color: var(--color-fg-default); } }',
      warnings: [
        {
          message:
            '--color-text-primary is a deprecated color variable. Please use the replacement --color-fg-default. (primer/no-deprecated-colors)',
          line: 1,
          column: 6
        },
        {
          message:
            '--color-text-primary is a deprecated color variable. Please use the replacement --color-fg-default. (primer/no-deprecated-colors)',
          line: 1,
          column: 58
        }
      ]
    },
    {
      code: '.x { border-color: var(--color-border-primary) var(--color-border-primary); }',
      fixed: '.x { border-color: var(--color-border-default) var(--color-border-default); }',
      warnings: [
        {
          message:
            '--color-border-primary is a deprecated color variable. Please use the replacement --color-border-default. (primer/no-deprecated-colors)',
          line: 1,
          column: 6
        },
        {
          message:
            '--color-border-primary is a deprecated color variable. Please use the replacement --color-border-default. (primer/no-deprecated-colors)',
          line: 1,
          column: 6
        }
      ]
    },
    {
      code: '.x { border-color: var(--color-border-primary) var(--color-border-secondary); }',
      fixed: '.x { border-color: var(--color-border-default) var(--color-border-subtle); }',
      warnings: [
        {
          message:
            '--color-border-primary is a deprecated color variable. Please use the replacement --color-border-default. (primer/no-deprecated-colors)',
          line: 1,
          column: 6
        },
        {
          message:
            '--color-border-secondary is a deprecated color variable. Please use the replacement --color-border-subtle. (primer/no-deprecated-colors)',
          line: 1,
          column: 6
        }
      ]
    },
    {
      code: '$border: $border-width $border-style var(--color-border-primary) !default;',
      fixed: '$border: $border-width $border-style var(--color-border-default) !default;',
      message: `--color-border-primary is a deprecated color variable. Please use the replacement --color-border-default. (primer/no-deprecated-colors)`,
      line: 1,
      column: 1
    },
    {
      code: '.x { border: $border-width $border-style var(--color-border-primary); }',
      fixed: '.x { border: $border-width $border-style var(--color-border-default); }',
      message: `--color-border-primary is a deprecated color variable. Please use the replacement --color-border-default. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6
    },
    {
      code: '.x { background-color: var(--color-bg-canvas); }',
      fixed: '.x { background-color: var(--color-canvas-default); }',
      message: `--color-bg-canvas is a deprecated color variable. Please use the replacement --color-canvas-default. (primer/no-deprecated-colors)`,
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
