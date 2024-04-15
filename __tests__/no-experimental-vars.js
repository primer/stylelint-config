import {ruleName} from '../plugins/no-experimental-vars.js'

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/no-experimental-vars'],
  customSyntax: 'postcss-scss',
  ruleName,
  config: [
    true
  ],
  accept: [
    {
      code: '.x { padding: 4px; }',
      description: 'Does not error on 4px.',
    },
    {
      code: '.x { padding: var(--base-size-4-foo); }',
      description: 'Does not error custom naming.',
    },
  ],
  reject: [
    {
      code: '.x { padding: var(--base-size-4); }',
      message:
        'Do not use experimental variable `var(--base-size-4)`. Experimental variables are undergoing testing, see https://github.com/github/primer/issues/889 for more details. (primer/no-experimental-vars)',
      line: 1,
      column: 15,
      description: 'Errors on experimental var.',
    },
    {
      code: '.x { padding: calc(var(--base-size-4) + 1); }',
      message:
        'Do not use experimental variable `var(--base-size-4)`. Experimental variables are undergoing testing, see https://github.com/github/primer/issues/889 for more details. (primer/no-experimental-vars)',
      line: 1,
      column: 15,
      description: 'Errors on variables inside calc.',
    },
    {
      code: '.x { padding: 4px; .y { padding: calc(var(--base-size-4) + 1); } }',
      message:
        'Do not use experimental variable `var(--base-size-4)`. Experimental variables are undergoing testing, see https://github.com/github/primer/issues/889 for more details. (primer/no-experimental-vars)',
      line: 1,
      column: 34,
      description: 'Errors on nested declaration.',
    },
    {
      code: '.x { padding: var(--base-size-4) var(--base-size-8); }',
      description: 'Errors on two variables used.',
      warnings: [
        {
          column: 15,
          line: 1,
          rule: 'primer/no-experimental-vars',
          severity: 'error',
          message:
            'Do not use experimental variable `var(--base-size-4)`. Experimental variables are undergoing testing, see https://github.com/github/primer/issues/889 for more details. (primer/no-experimental-vars)',
        },
        {
          column: 15,
          line: 1,
          rule: 'primer/no-experimental-vars',
          severity: 'error',
          message:
            'Do not use experimental variable `var(--base-size-8)`. Experimental variables are undergoing testing, see https://github.com/github/primer/issues/889 for more details. (primer/no-experimental-vars)',
        },
      ],
    },
  ],
})
