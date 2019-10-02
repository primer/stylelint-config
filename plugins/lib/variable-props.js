const SPACER_VARS = ['$spacer-*']

const ALLOWED_COLOR_VALUES = ['currentColor', 'inherit', 'none', 'transparent']
const ALLOWED_SPACE_VALUES = ['0']

module.exports = {
  'background{,-color}': {
    name: 'background color',
    values: ['$bg-*', 'transparent', 'none']
  },
  border: {
    values: ['$border'],
    components: ['border-width', 'border-style', 'border-color']
  },
  ['border{,-top,-right,-bottom,-left}-color']: {
    name: 'border color',
    values: ['$border-*'].concat(ALLOWED_COLOR_VALUES)
  },
  ['border{,-top,-right,-bottom,-left}-style']: {
    name: 'border style',
    values: ['$border-style']
  },
  color: {
    name: 'color (text)',
    values: ['$text-*'].concat(ALLOWED_COLOR_VALUES)
  },
  [`margin{,-top,-right,-bottom,-left}`]: {
    name: 'margin',
    values: SPACER_VARS.concat(ALLOWED_SPACE_VALUES)
  },
  [`padding{,-top,-right,-bottom,-left}`]: {
    name: 'padding',
    values: SPACER_VARS.concat(ALLOWED_SPACE_VALUES)
  },
  [`border{,-top,-right,-bottom,-left}-width`]: {
    name: 'border width',
    values: ['$border-width*', '0', 'none']
  },
  'font-size': {
    values: ['$h[1-6]', '$font-size-*', '1', '1em', 'inherit']
  },
  'font-weight': {
    values: ['$font-weight-*', 'inherit']
  },
  'line-height': {
    values: ['$lh-*', '0', '1', '1em', 'inherit']
  }
}
