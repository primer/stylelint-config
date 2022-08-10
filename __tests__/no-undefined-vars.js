const path = require('path')
const {messages, ruleName} = require('../plugins/no-undefined-vars')

// eslint-disable-next-line no-undef
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
    {
      code: '@include color-variables(\n  (\n    (feature-bg-color, (light: var(--color-scale-blue-1), dark: var(--color-scale-blue-2)))));'
    },
    {
      code: `
        .x {
          --color-foo: #ffeeee;
        }
      `
    },
    {
      code: `
        .x {
          --color-foo: #ffeeee;
          color: var(--color-foo);
        }
      `
    },
    {
      code: `
        :root {
          --color-foo: #ffeeee;
        }
        .x {
          color: var(--color-foo);
        }
      `
    },
    {
      code: `
        :host {
          --color-foo: #ffeeee;
        }
        .x {
          color: var(--color-foo);
        }
      `
    },
    {
      code: `
        :root {
          --color-foo: #ffeeee;
        }
        .x {
          --color-bar: var(--color-foo);
          color: var(--color-bar);
        }
      `
    },
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
      code: '.x { --color-bar: #000000; } .y { color: var(--color-bar); }',
      message: messages.rejected('--color-bar'),
      line: 1,
      column: 35
    },
    {
      code: '.x { --color-foo: #000000; color: var(--color-bar); }',
      message: messages.rejected('--color-bar'),
      line: 1,
      column: 28
    },
    {
      code: ':root { --color-foo: #000000 } .x { color: var(--color-bar); }',
      message: messages.rejected('--color-bar'),
      line: 1,
      column: 37
    },
    {
      code: ':host { --color-foo: #000000 } .x { color: var(--color-bar); }',
      message: messages.rejected('--color-bar'),
      line: 1,
      column: 37
    },
    {
      code: '@include color-variables(\n  (\n    (feature-bg-color, (light: var(--color-scale-blue-1), dark: var(--color-fake-2)))));',
      message: messages.rejected('--color-fake-2'),
      line: 1,
      column: 1
    }
  ]
})
