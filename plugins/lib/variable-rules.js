const matchAll = require('string.prototype.matchall')

const SPACE_VALUES = ['$spacer-*', '-$spacer-*', '0', 'auto', 'inherit']
const SPACE_FIXES = {
  '4px': '$spacer-1',
  // '5px': '$spacer-1',
  '8px': '$spacer-2',
  // '15px': '$spacer-3',
  '16px': '$spacer-3'
}
const COLOR_VALUES = ['currentColor', 'inherit', 'none', 'transparent']

module.exports = {
  'background color': {
    props: ['background-color'],
    values: ['$bg-*', 'transparent', 'none'],
    replacements: Object.assign(
      {
        // '#000': '$black',
        // 'black': '$black',
        '#fff': '$bg-white',
        white: '$bg-white'
      },
      reverseAssignments(`
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

        $black-fade-15:      rgba($black, 0.15) !default;
        $black-fade-30:      rgba($black, 0.3) !default;
        $black-fade-50:      rgba($black, 0.5) !default;
        $black-fade-70:      rgba($black, 0.7) !default;
        $black-fade-85:      rgba($black, 0.85) !default;
        $white-fade-15:      rgba($white, 0.15) !default;
        $white-fade-30:      rgba($white, 0.3) !default;
        $white-fade-50:      rgba($white, 0.5) !default;
        $white-fade-70:      rgba($white, 0.7) !default;
        $white-fade-85:      rgba($white, 0.85) !default;
      `)
    )
  },
  border: {
    props: 'border{,-top,-right,-bottom,-left}',
    values: ['$border', 'none', '0'],
    components: ['border-width', 'border-style', 'border-color'],
    replacements: {
      '$border-width $border-style $border-color': '$border',
      '$border-width $border-color $border-style': '$border'
    }
  },
  'border color': {
    props: 'border{,-top,-right,-bottom,-left}-color',
    values: ['$border-*'].concat(COLOR_VALUES),
    replacements: reverseAssignments(`
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

      $black-fade-15:      rgba($black, 0.15) !default;
      $black-fade-30:      rgba($black, 0.3) !default;
      $black-fade-50:      rgba($black, 0.5) !default;
      $black-fade-70:      rgba($black, 0.7) !default;
      $black-fade-85:      rgba($black, 0.85) !default;
      $white-fade-15:      rgba($white, 0.15) !default;
      $white-fade-30:      rgba($white, 0.3) !default;
      $white-fade-50:      rgba($white, 0.5) !default;
      $white-fade-70:      rgba($white, 0.7) !default;
      $white-fade-85:      rgba($white, 0.85) !default;
    `)
  },
  'border style': {
    props: 'border{,-top,-right,-bottom,-left}-style',
    values: ['$border-style', 'none'],
    replacements: {solid: '$border-style'}
  },
  'border width': {
    props: 'border{,-top,-right,-bottom,-left}-width',
    values: ['$border-width*', '0', 'none'],
    replacements: {'1px': '$border-width'}
  },
  'border radius': {
    props: 'border{,-{top,bottom}-{left,right}}-radius',
    values: ['$border-radius', '0', '100%'],
    replacements: {'3px': '$border-radius'}
  },
  'box shadow': {
    props: 'box-shadow',
    values: ['$box-shadow*', '0'],
    replacements: reverseAssignments(`
      $box-shadow: 0 1px 1px rgba($black, 0.1) !default;
      $box-shadow-medium: 0 1px 5px $black-fade-15 !default;
      $box-shadow-large: 0 1px 15px $black-fade-15 !default;
      $box-shadow-extra-large: 0 10px 50px rgba($black, 0.07) !default;
    `)
  },
  'text color': {
    props: 'color',
    values: ['$text-*'].concat(COLOR_VALUES),
    replacements: Object.assign(
      {
        '#fff': '$text-white',
        white: '$text-white',
        '#000': '$text-gray-dark',
        black: '$text-gray-dark'
      },
      reverseAssignments(`
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
    )
  },
  margin: {
    props: 'margin{,-top,-right,-bottom,-left}',
    values: SPACE_VALUES,
    replacements: SPACE_FIXES
  },
  padding: {
    props: 'padding{,-top,-right,-bottom,-left}',
    values: SPACE_VALUES,
    replacements: SPACE_FIXES
  },
  'font-size': {
    props: 'font-size',
    values: ['$h{00,0,1,2,3,4,5,6}-size', '$h{00,0,1,2,3,4,5,6}-size-mobile', '$font-size-*', '1', '1em', 'inherit'],
    replacements: reverseAssignments(`
      // XXX should we include h*-size-mobile??
      $h00-size: 48px !default;
      $h0-size: 40px !default;
      $h1-size: 32px !default;
      $h2-size: 24px !default;
      $h3-size: 20px !default;
      $h4-size: 16px !default;
      $h5-size: 14px !default;
      $h6-size: 12px !default;
      $font-size-small: 12px !default;
    `)
  },
  'font-weight': {
    props: 'font-weight',
    values: ['$font-weight-*', 'inherit'],
    replacements: Object.assign(
      {
        bold: '$font-weight-bold',
        normal: '$font-weight-normal'
      },
      reverseAssignments(`
        $font-weight-bold: 600 !default;
        $font-weight-semibold: 500 !default;
        $font-weight-normal: 400 !default;
        $font-weight-light: 300 !default;
      `)
    )
  },
  'line-height': {
    props: 'line-height',
    values: ['$lh-*', '0', '1', '1em', 'inherit'],
    replacements: reverseAssignments(`
      $lh-condensed-ultra: 1 !default;
      $lh-condensed: 1.25 !default;
      $lh-default: 1.5 !default;
    `)
  }
}

function reverseAssignments(css) {
  const map = {}
  // eslint-disable-next-line no-unused-vars
  for (const [_, left, right] of matchAll(css, /(\$[-\w]+):\s+([^!]+) !default;/g)) {
    map[right] = left
  }
  return map
}
