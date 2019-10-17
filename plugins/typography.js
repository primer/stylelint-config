const {createVariableRule, reverseAssignments} = require('./lib/variable-rules')

module.exports = createVariableRule('primer/typography', {
  'font-size': {
    expects: 'a font-size variable',
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
})
