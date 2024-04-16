import {ruleName} from '../plugins/new-color-vars-have-fallback.js'

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/new-color-vars-have-fallback'],
  customSyntax: 'postcss-scss',
  ruleName,
  config: [true],
  accept: [
    {
      code: '.x { color: var(--fgColor-default, var(--color-fg-default)); }',
      description: 'Variable has fallback',
    },
  ],
  reject: [
    {
      code: '.x { color: var(--fgColor-default); }',
      message:
        'Expected a fallback value for CSS variable --fgColor-default. New color variables fallbacks, check primer.style/primitives to find the correct value (primer/new-color-vars-have-fallback)',
      line: 1,
      column: 6,
    },
  ],
})
