const path = require('path')
const {messages, ruleName} = require('../plugins/no-undefined-vars')

testRule({
  plugins: ['./plugins/no-undefined-vars.js'],
  ruleName,
  config: [
    true,
    {
      files: [
        path.join(__dirname, '__fixtures__/color-vars.scss'),
        path.join(__dirname, '__fixtures__/defines-new-color-vars.scss'),
        path.join(__dirname, '__fixtures__/spacing-vars.scss')
      ]
    }
  ],

  accept: [
    {code: '.x { color: var(--color-text-primary); }'},
    {code: '.x { color: var(--color-text-primary, #000000); }'},
    {code: '.x { background-color: var(--color-counter-bg); }'},
    {code: '.x { color: var(--color-my-first-feature); }'},
    {code: '.x { color: var(--color-my-second-feature); }'},
    {code: '.x { margin: var(--spacing-spacer-1); }'},
    {code: '@include color-mode-var("feature", var(--color-scale-blue-1), var(--color-scale-blue-2))'}
  ],

  reject: [
    {
      code: '.x { color: var(--color-foo); }',
      message: messages.rejected('--color-foo'),
      line: 1,
      column: 6
    },
    // checks to ensure other declarations with a double-dash
    // aren't accidentally parsed as CSS variables
    {
      code: '.x { color: var(--light); }',
      message: messages.rejected('--light'),
      line: 1,
      column: 6
    },
    {
      code: '.x { color: var(--color-my-commented-color); }',
      message: messages.rejected('--color-my-commented-color'),
      line: 1,
      column: 6
    },
    {
      code: '.x { color: var(--color-my-other-commented-color); }',
      message: messages.rejected('--color-my-other-commented-color'),
      line: 1,
      column: 6
    },
    {
      code: '.x { color: var(--color-bar, #000000); }',
      message: messages.rejected('--color-bar'),
      line: 1,
      column: 6
    },
    {
      code: '@include color-mode-var(feature, var(--color-scale-blue-1), var(--color-fake-2))',
      message: messages.rejected('--color-fake-2'),
      line: 1,
      column: 1
    }
  ]
})
