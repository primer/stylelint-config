const matchAll = require('string.prototype.matchall')

const SPACER_VARS = ['$spacer-*']
const SPACER_FIXES = {
  '4px': '$spacer-1',
  // '5px': '$spacer-1',
  '8px': '$spacer-2',
  // '15px': '$spacer-3',
  '16px': '$spacer-3'
}
const ALLOWED_COLOR_VALUES = ['currentColor', 'inherit', 'none', 'transparent']
const ALLOWED_SPACE_VALUES = ['0']

module.exports = {
  'background color': {
    props: ['background', 'background-color'],
    values: ['$bg-*', 'transparent', 'none'],
    fixes: reverseAssignments(`
      $bg-blue-light:     $blue-000 !default;
      $bg-blue:           $blue-500 !default;
      $bg-gray-dark:      $gray-900 !default;
      $bg-gray-light:     $gray-000 !default;
      $bg-gray:           $gray-100 !default;
      $bg-green:          $green-500 !default;
      $bg-green-light:    $green-100 !default;
      $bg-orange:         $orange-700 !default;
      $bg-purple:         $purple-500 !default;
      $bg-purple-light:   $purple-000 !default;
      $bg-pink:           $pink-500 !default;
      $bg-red:            $red-500 !default;
      $bg-red-light:      $red-100 !default;
      $bg-white:          $white !default;
      $bg-yellow:         $yellow-500 !default;
      $bg-yellow-light:   $yellow-200 !default;
      $bg-yellow-dark:    $yellow-700 !default;
    `)
  },
  border: {
    props: 'border',
    values: ['$border', 'none'],
    components: ['border-width', 'border-style', 'border-color'],
    fixes: {
      '$border-width $border-style $border-color': '$border',
      '$border-width $border-color $border-style': '$border'
    }
  },
  'border color': {
    props: 'border{,-top,-right,-bottom,-left}-color',
    values: ['$border-*'].concat(ALLOWED_COLOR_VALUES),
    fixes: reverseAssignments(`
      $border-black-fade:  $black-fade-15 !default;
      $border-white-fade:  $white-fade-15 !default;
      $border-blue:        $blue-500 !default;
      $border-blue-light:  $blue-200 !default;
      $border-green:       $green-400 !default;
      $border-green-light: desaturate($green-300, 40%) !default;
      $border-purple:      $purple !default;
      $border-red:         $red !default;
      $border-red-light:   desaturate($red-300, 60%) !default;
      $border-yellow:      desaturate($yellow-300, 60%) !default;
      $border-gray-dark:   $gray-300 !default;
      $border-gray-darker: $gray-700 !default;
      $border-gray-light:  lighten($gray-200, 3%) !default;
      $border-gray:        $gray-200 !default;
    `)
  },
  'border style': {
    props: 'border{,-top,-right,-bottom,-left}-style',
    values: ['$border-style'],
    fixes: {solid: '$border-style'}
  },
  'border width': {
    props: 'border{,-top,-right,-bottom,-left}-width',
    values: ['$border-width*', '0', 'none'],
    fixes: {'1px': '$border-width'}
  },
  'border radius': {
    props: 'border{,-{top,bottom}-{left,right}}-radius',
    values: ['$border-radius'],
    fixes: {'3px': '$border-radius'}
  },
  'color (text)': {
    props: 'color',
    values: ['$text-*'].concat(ALLOWED_COLOR_VALUES),
    fixes: reverseAssignments(`
      $text-blue:         $blue-500 !default;
      $text-gray-dark:    $gray-900 !default;
      $text-gray-light:   $gray-500 !default;
      $text-gray:         $gray-600 !default;
      $text-green:        $green-500 !default;
      $text-orange:       $orange-900 !default;
      $text-orange-light: $orange-600 !default;
      $text-purple:       $purple !default;
      $text-pink:         $pink-500 !default;
      $text-red:          $red-600 !default;
      $text-white:        $white !default;
      $text-yellow:       $yellow-800 !default;
    `)
  },
  marign: {
    props: 'margin{,-top,-right,-bottom,-left}',
    values: SPACER_VARS.concat(ALLOWED_SPACE_VALUES),
    fixes: SPACER_FIXES
  },
  padding: {
    props: 'padding{,-top,-right,-bottom,-left}',
    values: SPACER_VARS.concat(ALLOWED_SPACE_VALUES),
    fixes: SPACER_FIXES
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

function reverseAssignments(css) {
  const map = {}
  for (const [_, left, right] of matchAll(css, /(\$[-\w]+):\s+([^\!]+) !default;/g)) {
    map[right] = left
  }
  return map
}
