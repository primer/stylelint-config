const path = require('path')
const {ruleName} = require('../plugins/no-deprecated-colors')

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/no-deprecated-colors.js'],
  ruleName,
  config: [
    true,
    {
      deprecatedFile: path.join(__dirname, '../plugins/lib/primitives-v8.json')
    }
  ],
  fix: true,
  accept: [
    {code: '.x { color: var(--fgColor-default, var(--color-fg-default)); }'},
    {
      code: '@include focusOutline(2px, var(--focus-outlineColor, var(--color-accent-fg));'
    }
  ],
  reject: [
    {
      code: '.x { color: var(--color-fg-default); }',
      fixed: '.x { color: var(--fgColor-default, var(--color-fg-default)); }',
      message: `--color-fg-default is a deprecated color variable. Please use the replacement --fgColor-default. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6
    },
    {
      code: '.x { border-color: var(--color-primer-border-contrast); }',
      fixed: '.x { border-color: var(--borderColor-muted, var(--color-primer-border-contrast)); }',
      message: `--color-primer-border-contrast is a deprecated color variable. Please use the replacement --borderColor-muted. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6
    },
    {
      code: '.x { fill: var(--color-fg-default); }',
      unfixable: true,
      message: `--color-fg-default is a deprecated color variable. Please consult the primer color docs for a replacement. https://primer.style/primitives/storybook/?path=/story/migration-tables (primer/no-deprecated-colors)`,
      line: 1,
      column: 6
    },
    {
      code: '.x { background-color: var(--color-canvas-default-transparent); }',
      unfixable: true,
      message: `--color-canvas-default-transparent is a deprecated color variable. Please consult the primer color docs for a replacement. https://primer.style/primitives/storybook/?path=/story/migration-tables (primer/no-deprecated-colors)`,
      line: 1,
      column: 6
    },
    {
      code: '.x { border: 1px solid var(--color-neutral-emphasis); .foo { background-color: var(--color-neutral-emphasis); } }',
      fixed:
        '.x { border: 1px solid var(--borderColor-neutral-emphasis, var(--color-neutral-emphasis)); .foo { background-color: var(--bgColor-neutral-emphasis, var(--color-neutral-emphasis)); } }',
      warnings: [
        {
          message:
            '--color-neutral-emphasis is a deprecated color variable. Please use the replacement --borderColor-neutral-emphasis. (primer/no-deprecated-colors)',
          line: 1,
          column: 6
        },
        {
          message:
            '--color-neutral-emphasis is a deprecated color variable. Please use the replacement --bgColor-neutral-emphasis. (primer/no-deprecated-colors)',
          line: 1,
          column: 62
        }
      ]
    }
  ]
})
