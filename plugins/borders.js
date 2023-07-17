const {createVariableRule} = require('./lib/variable-rules')

module.exports = createVariableRule(
  'primer/borders',
  {
    border: {
      expects: 'a border variable',
      props: 'border{,-top,-right,-bottom,-left}',
      values: ['$border', 'none', '0'],
      components: ['border-width', 'border-style', 'border-color'],
      replacements: {
        // because shorthand border properties ¯\_(ツ)_/¯
        '$border-width $border-style $border-gray': '$border',
        '$border-width $border-gray $border-style': '$border',
        '$border-style $border-width $border-gray': '$border',
        '$border-style $border-gray $border-width': '$border',
        '$border-gray $border-width $border-style': '$border',
        '$border-gray $border-style $border-width': '$border',
        '$border-width $border-style $border-color': '$border',
        '$border-width $border-color $border-style': '$border',
        '$border-style $border-width $border-color': '$border',
        '$border-style $border-color $border-width': '$border',
        '$border-color $border-width $border-style': '$border',
        '$border-color $border-style $border-width': '$border',
      },
    },
    'border color': {
      expects: 'a border color variable',
      props: 'border{,-top,-right,-bottom,-left}-color',
      values: [
        '$border-*',
        'transparent',
        'currentColor',
        // Match variables in any of the following formats: --color-border-*, --color-*-border-*, --color-*-border, --borderColor-, *borderColor*
        /var\(--color-(.+-)*border(-.+)*\)/,
        /var\(--color-[^)]+\)/,
        /var\(--borderColor-[^)]+\)/,
        /var\((.+-)*borderColor(-.+)*\)/,
      ],
      replacements: {
        '$border-gray': '$border-color',
      },
    },
    'border style': {
      expects: 'a border style variable',
      props: 'border{,-top,-right,-bottom,-left}-style',
      values: ['$border-style', 'none'],
    },
    'border width': {
      expects: 'a border width variable',
      props: 'border{,-top,-right,-bottom,-left}-width',
      values: ['$border-width*', '0'],
    },
    'border radius': {
      expects: 'a border radius variable',
      props: 'border{,-{top,bottom}-{left,right}}-radius',
      values: ['$border-radius', '0', '50%', 'inherit'],
      replacements: {
        '100%': '50%',
      },
    },
  },
  'https://primer.style/css/utilities/borders',
)
