import {ruleName} from '../plugins/utilities.js'

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/utilities'],
  customSyntax: 'postcss-scss',
  ruleName,
  config: [true],
  accept: [
    {
      code: '.x { padding: 1px; }',
      description: 'Padding is a custom value.',
    },
    {
      code: '.x { padding: $spacer-1 12px; }',
      description: 'Padding is multiple values.',
    },
    {
      code: '.x:hover { padding: $spacer-4; }',
      description: 'Selector is a pseudo selector.',
    },
  ],
  reject: [
    {
      code: '.x { padding: $spacer-4; }',
      message:
        "Consider using the Primer utility '.p-4' instead of the selector '.x' in your html. https://primer.style/css/utilities (primer/utilities)",
      line: 1,
      column: 1,
      description: 'Errors on spacer utility.',
    },
    {
      code: '.x { padding: 1px; &:hover { padding:2px; } } .x { padding: $spacer-4; }',
      message:
        "Consider using the Primer utility '.p-4' instead of the selector '.x' in your html. https://primer.style/css/utilities (primer/utilities)",
      line: 1,
      column: 47,
      description: 'Errors on spacer utility with hover ampersand.',
    },
    {
      code: '.x { padding: $spacer-4 !important; }',
      message:
        "Consider using the Primer utility '.p-4' instead of the selector '.x' in your html. https://primer.style/css/utilities (primer/utilities)",
      line: 1,
      column: 1,
      description: 'Errors on spacer utility with !important.',
    },
  ],
})
