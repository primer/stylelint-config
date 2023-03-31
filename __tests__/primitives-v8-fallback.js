const path = require('path')
const {ruleName} = require('../plugins/primitives-v8-fallback')

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/primitives-v8-fallback.js'],
  customSyntax: 'postcss-scss',
  ruleName,
  config: [
    true,
    {
      designTokens: path.join(__dirname, '__fixtures__/design-tokens.json')
    }
  ],
  accept: [
    {
      code: '.x { color: var(--fgColor-default, var(--color-fg-default)); }',
      description: 'New token has a fallback'
    }
  ],
  reject: [
    {
      code: '.x { color: var(--fgColor-default); }',
      message:
        '`var(--fgColor-default)`. requires a fallback value of the deprecated token. See https://primer.style/primitives/storybook/?path=/story/migration-tables to find the correct token.',
      line: 1,
      column: 15,
      unfixable: true,
      description: 'Errors on experimental var.'
    }
  ]
})
