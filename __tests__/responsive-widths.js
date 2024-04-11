import {ruleName} from '../plugins/responsive-widths'

// eslint-disable-next-line no-undef
testRule({
  plugins: ['./plugins/responsive-widths'],
  customSyntax: 'postcss-scss',
  ruleName,
  config: [true],
  accept: [
    {
      code: '.x { width: 319px; }',
      description: 'Width is less than small viewport.',
    },
    {
      code: '.x { width: 100vw; }',
      description: 'Width is 100vw or less.',
    },
    {
      code: '.x { min-width: 319px; }',
      description: 'Min-width is less than small viewport.',
    },
    {
      code: '.x { max-width: 1000px; }',
      description: 'Max-width larger than small viewport.',
    },
    {
      code: '.x { width: calc(10px + 10px); }',
      description: 'Max-width larger than small viewport.',
    },
    {
      code: '.x { @include breakpoint(md) { width: 500px; } }',
      description: 'Ignore widths inside breakpoint.',
    },
  ],
  reject: [
    {
      code: '.x { width: 325px; }',
      message:
        'A value larger than the smallest viewport could break responsive pages. Use a width value smaller than 325px. https://primer.style/css/support/breakpoints (primer/responsive-widths)',
      line: 1,
      column: 13,
      description: 'Errors on width greater than minimum size.',
    },
    {
      code: '.x { min-width: 325px; }',
      message:
        'A value larger than the smallest viewport could break responsive pages. Use a width value smaller than 325px. https://primer.style/css/support/breakpoints (primer/responsive-widths)',
      line: 1,
      column: 17,
      description: 'Errors on min-width greater than minimum size.',
    },
    {
      code: '.x { width: 300vw; }',
      message:
        'A value larger than the smallest viewport could break responsive pages. Use a width value smaller than 300vw. https://primer.style/css/support/breakpoints (primer/responsive-widths)',
      line: 1,
      column: 13,
      description: 'Errors on viewport width greater than 100.',
    },
  ],
})
