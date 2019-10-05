const {createVariableRule, reverseAssignments} = require('./lib/variable-rules')

module.exports = createVariableRule('primer/borders', {
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
    values: ['$border-*', 'transparent', 'currentColor'],
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
  }
})
