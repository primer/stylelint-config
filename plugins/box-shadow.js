const {createVariableRule} = require('./lib/variable-rules')

module.exports = createVariableRule(
  'primer/box-shadow',
  {
    'box shadow': {
      expects: 'a box-shadow variable',
      props: 'box-shadow',
      values: [
        '$box-shadow*',
        '$*-shadow',
        'none',
        // Match variables in any of the following formats: --color-shadow-*, --color-*-shadow-*, --color-*-shadow, --shadow-*, *shadow*
        /var\(--color-(.+-)*shadow(-.+)*\)/,
        /var\(--shadow(-.+)*\)/,
        /var\((.+-)*shadow(-.+)*\)/,
      ],
      singular: true,
    },
  },
  'https://primer.style/css/utilities/box-shadow',
)
