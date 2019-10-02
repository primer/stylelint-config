const SPACER_VARS = ['$spacer-*']
const ALLOWED_COLOR_VALUES = ['currentColor', 'inherit', 'none', 'transparent']
const ALLOWED_SPACE_VALUES = ['0']

module.exports = {
  'background color': {
    props: ['background', 'background-color'],
    values: ['$bg-*', 'transparent', 'none']
  },
  border: {
    props: 'border',
    values: ['$border', 'none'],
    components: ['border-width', 'border-style', 'border-color']
  },
  'border color': {
    props: 'border{,-top,-right,-bottom,-left}-color',
    values: ['$border-*'].concat(ALLOWED_COLOR_VALUES)
  },
  'border style': {
    props: 'border{,-top,-right,-bottom,-left}-style',
    values: ['$border-style']
  },
  'color (text)': {
    props: 'color',
    values: ['$text-*'].concat(ALLOWED_COLOR_VALUES)
  },
  marign: {
    props: `margin{,-top,-right,-bottom,-left}`,
    values: SPACER_VARS.concat(ALLOWED_SPACE_VALUES)
  },
  padding: {
    props: `padding{,-top,-right,-bottom,-left}`,
    values: SPACER_VARS.concat(ALLOWED_SPACE_VALUES)
  },
  'border width': {
    props: `border{,-top,-right,-bottom,-left}-width`,
    values: ['$border-width*', '0', 'none']
  },
  'font-size': {
    props: 'font-size',
    values: ['$h[1-6]', '$font-size-*', '1', '1em', 'inherit']
  },
  'font-weight': {
    props: 'font-weight',
    values: ['$font-weight-*', 'inherit']
  },
  'line-height': {
    props: 'line-height',
    values: ['$lh-*', '0', '1', '1em', 'inherit']
  }
}
