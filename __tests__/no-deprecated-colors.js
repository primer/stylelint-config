const path = require('path')
const {ruleName} = require('../plugins/no-deprecated-colors')

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/no-deprecated-colors.js'],
  ruleName,
  config: [
    true,
    {
      deprecatedFile: path.join(__dirname, '../plugins/lib/primitives-v8.json'),
    },
  ],
  fix: true,
  accept: [
    {code: '.x { color: var(--fgColor-default); }'},
    {
      code: '@include focusOutline(2px, var(--focus-outlineColor));',
    },
  ],
  reject: [
    {
      code: '.x { color: var(--color-fg-default); }',
      fixed: '.x { color: var(--fgColor-default); }',
      message: `Variable --color-fg-default is deprecated for property color. Please use the replacement --fgColor-default. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { border-right: $border-width $border-style var(--color-border-muted); }',
      fixed: '.x { border-right: $border-width $border-style var(--borderColor-muted); }',
      message: `Variable --color-border-muted is deprecated for property border-right. Please use the replacement --borderColor-muted. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { border-color: var(--color-primer-border-contrast); }',
      fixed: '.x { border-color: var(--borderColor-muted); }',
      message: `Variable --color-primer-border-contrast is deprecated for property border-color. Please use the replacement --borderColor-muted. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { box-shadow: var(--color-fg-default); }',
      unfixable: true,
      message: `Variable --color-fg-default is deprecated for property box-shadow. Please consult the primer color docs for a replacement. https://primer.style/primitives/storybook/?path=/story/migration-tables (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { background-color: var(--color-canvas-default-transparent); }',
      fixed: '.x { background-color: var(--bgColor-transparent); }',
      message: `Variable --color-canvas-default-transparent is deprecated for property background-color. Please use the replacement --bgColor-transparent. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { border: var(--borderWidth-thin) solid var(--color-border-default); }',
      fixed: '.x { border: var(--borderWidth-thin) solid var(--borderColor-default); }',
      message: `Variable --color-border-default is deprecated for property border. Please use the replacement --borderColor-default. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { border-color: var(--color-canvas-default-transparent); }',
      fixed: '.x { border-color: var(--borderColor-transparent); }',
      message: `Variable --color-canvas-default-transparent is deprecated for property border-color. Please use the replacement --borderColor-transparent. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { border: 1px solid var(--color-neutral-emphasis); .foo { background-color: var(--color-neutral-emphasis); } }',
      fixed:
        '.x { border: 1px solid var(--borderColor-neutral-emphasis); .foo { background-color: var(--bgColor-neutral-emphasis); } }',
      config: [
        true,
        {
          deprecatedFile: path.join(__dirname, '../plugins/lib/primitives-v8.json'),
          inlineFallback: false,
        },
      ],
      warnings: [
        {
          message:
            'Variable --color-neutral-emphasis is deprecated for property border. Please use the replacement --borderColor-neutral-emphasis. (primer/no-deprecated-colors)',
          line: 1,
          column: 6,
        },
        {
          message:
            'Variable --color-neutral-emphasis is deprecated for property background-color. Please use the replacement --bgColor-neutral-emphasis. (primer/no-deprecated-colors)',
          line: 1,
          column: 62,
        },
      ],
    },
  ],
})
// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/no-deprecated-colors.js'],
  ruleName,
  config: [
    true,
    {
      deprecatedFile: path.join(__dirname, '../plugins/lib/primitives-v8.json'),
      inlineFallback: true,
    },
  ],
  fix: true,
  accept: [
    {code: '.x { color: var(--fgColor-default, var(--color-fg-default)); }'},
    {
      code: '@include focusOutline(2px, var(--focus-outlineColor, var(--color-accent-fg)));',
    },
  ],
  reject: [
    {
      code: '.x { color: var(--color-fg-default); }',
      fixed: '.x { color: var(--fgColor-default, var(--color-fg-default)); }',
      message: `Variable --color-fg-default is deprecated for property color. Please use the replacement --fgColor-default. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { border-right: $border-width $border-style var(--color-border-muted); }',
      fixed: '.x { border-right: $border-width $border-style var(--borderColor-muted, var(--color-border-muted)); }',
      message: `Variable --color-border-muted is deprecated for property border-right. Please use the replacement --borderColor-muted. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { border-color: var(--color-primer-border-contrast); }',
      fixed: '.x { border-color: var(--borderColor-muted, var(--color-primer-border-contrast)); }',
      message: `Variable --color-primer-border-contrast is deprecated for property border-color. Please use the replacement --borderColor-muted. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { background-color: var(--color-canvas-default-transparent); }',
      fixed: '.x { background-color: var(--bgColor-transparent, var(--color-canvas-default-transparent)); }',
      message: `Variable --color-canvas-default-transparent is deprecated for property background-color. Please use the replacement --bgColor-transparent. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { border: var(--borderWidth-thin) solid var(--color-border-default); }',
      fixed: '.x { border: var(--borderWidth-thin) solid var(--borderColor-default, var(--color-border-default)); }',
      message: `Variable --color-border-default is deprecated for property border. Please use the replacement --borderColor-default. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { border-color: var(--color-canvas-default-transparent); }',
      fixed: '.x { border-color: var(--borderColor-transparent, var(--color-canvas-default-transparent)); }',
      message: `Variable --color-canvas-default-transparent is deprecated for property border-color. Please use the replacement --borderColor-transparent. (primer/no-deprecated-colors)`,
      line: 1,
      column: 6,
    },
    {
      code: '.x { border: 1px solid var(--color-neutral-emphasis); .foo { background-color: var(--color-neutral-emphasis); } }',
      fixed:
        '.x { border: 1px solid var(--borderColor-neutral-emphasis, var(--color-neutral-emphasis)); .foo { background-color: var(--bgColor-neutral-emphasis, var(--color-neutral-emphasis)); } }',
      config: [
        true,
        {
          deprecatedFile: path.join(__dirname, '../plugins/lib/primitives-v8.json'),
          inlineFallback: false,
        },
      ],
      warnings: [
        {
          message:
            'Variable --color-neutral-emphasis is deprecated for property border. Please use the replacement --borderColor-neutral-emphasis. (primer/no-deprecated-colors)',
          line: 1,
          column: 6,
        },
        {
          message:
            'Variable --color-neutral-emphasis is deprecated for property background-color. Please use the replacement --bgColor-neutral-emphasis. (primer/no-deprecated-colors)',
          line: 1,
          column: 62,
        },
      ],
    },
  ],
})
