const {createVariableRule, reverseAssignments} = require('./lib/variable-rules')

module.exports = createVariableRule('primer/colors', {
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
  'text color': {
    props: 'color',
    values: ['$text-*'],
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
  }
})
