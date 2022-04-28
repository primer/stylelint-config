const {ruleName} = require('../plugins/utilities')

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/utilities.js'],
  customSyntax: 'postcss-scss',
  ruleName,
  config: [true],
  accept: [
    {
      code: '.x { padding: 1px; }',
      description: 'Padding is a custom value.'
    },
    {
      code: '.x { padding: $spacer-1 12px; }',
      description: 'Padding is multiple values.'
    }
  ],
  reject: [
    {
      code: '.x { padding: $spacer-4; }',
      message:
        "Consider using the Primer utility '.p-4' instead of the selector '.x' in your html. https://primer.style/css/utilities (primer/utilities)",
      line: 1,
      column: 1,
      description: 'Errors on spacer utility.'
    },
    {
      code: '.x { padding: $spacer-4 !important; }',
      message:
        "Consider using the Primer utility '.p-4' instead of the selector '.x' in your html. https://primer.style/css/utilities (primer/utilities)",
      line: 1,
      column: 1,
      description: 'Errors on spacer utility with !important.'
    }
  ]
})
