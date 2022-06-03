const path = require('path')
const {ruleName} = require('../plugins/no-unused-css-vars')

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/no-unused-css-vars.js'],
  customSyntax: 'postcss-scss',
  ruleName,
  config: [
    true,
    {
      designTokens: path.join(__dirname, '__fixtures__/no-unused-css-vars.scss')
    }
  ],
  accept: [
    {
      code: '.x { background: var(--color-page-header-bg); }',
      description: 'Uses CSS var'
    }
  ],
  reject: [
    {
      code: '.x { background: #f6f8fa; }',
      message:
        'Do not use experimental variable `var(--base-size-4)`. Experimental variables are undergoing testing, see https://github.com/github/primer/issues/889 for more details. (primer/no-experimental-vars)',
      line: 1,
      column: 13,
      description: 'CSS var is never used'
    }
  ]
})
