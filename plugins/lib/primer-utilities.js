// Meant as temp until we can move to primitives or css
const colorTypes = ['accent', 'success', 'attention', 'severe', 'danger', 'open', 'closed', 'done', 'sponsors']

module.exports = {
  color: [
    {
      value: 'var(--color-fg-default)',
      utilityClass: 'color-fg-default',
    },
    {
      value: 'var(--color-fg-muted)',
      utilityClass: 'color-fg-muted',
    },
    {
      value: 'var(--color-fg-subtle)',
      utilityClass: 'color-fg-subtle',
    },
  ].concat(
    colorTypes.map(type => {
      return {
        value: `var(--color-${type}-fg)`,
        utilityClass: `color-fg-${type}`,
      }
    }),
  ),
  'background-color': [
    {
      value: 'var(--color-canvas-default)',
      utilityClass: 'color-bg-default',
    },
    {
      value: 'var(--color-canvas-overlay)',
      utilityClass: 'color-bg-overlay',
    },
    {
      value: 'var(--color-canvas-inset)',
      utilityClass: 'color-bg-inset',
    },
    {
      value: 'var(--color-canvas-subtle)',
      utilityClass: 'color-bg-subtle',
    },
    {
      value: 'transparent',
      utilityClass: 'color-bg-transparent',
    },
  ]
    .concat(
      colorTypes.map(type => {
        return {
          value: `var(--color-${type}-subtle)`,
          utilityClass: `color-bg-${type}`,
        }
      }),
    )
    .concat(
      colorTypes.map(type => {
        return {
          value: `var(--color-${type}-emphasis)`,
          utilityClass: `color-bg-${type}-emphasis`,
        }
      }),
    ),
  'border-color': [
    {
      value: 'var(--color-border-default',
      utilityClass: 'color-border-default',
    },
    {
      value: 'var(--color-border-muted',
      utilityClass: 'color-border-muted',
    },
    {
      value: 'var(--color-border-subtle',
      utilityClass: 'color-border-subtle',
    },
  ]
    .concat(
      colorTypes.map(type => {
        return {
          value: `var(--color-${type}-muted)`,
          utilityClass: `color-border-${type}`,
        }
      }),
    )
    .concat(
      colorTypes.map(type => {
        return {
          value: `var(--color-${type}-emphasis)`,
          utilityClass: `color-border-${type}-emphasis`,
        }
      }),
    ),
  margin: Array.from(new Array(6)).map((_, i) => {
    return {
      value: `$spacer-${i + 1}`,
      utilityClass: `m-${i + 1}`,
    }
  }),
  'margin-top': Array.from(new Array(6)).map((_, i) => {
    return {
      value: `$spacer-${i + 1}`,
      utilityClass: `mt-${i + 1}`,
    }
  }),
  'margin-right': Array.from(new Array(6)).map((_, i) => {
    return {
      value: `$spacer-${i + 1}`,
      utilityClass: `mr-${i + 1}`,
    }
  }),
  'margin-bottom': Array.from(new Array(6)).map((_, i) => {
    return {
      value: `$spacer-${i + 1}`,
      utilityClass: `mb-${i + 1}`,
    }
  }),
  'margin-left': Array.from(new Array(6)).map((_, i) => {
    return {
      value: `$spacer-${i + 1}`,
      utilityClass: `ml-${i + 1}`,
    }
  }),
  padding: Array.from(new Array(6)).map((_, i) => {
    return {
      value: `$spacer-${i + 1}`,
      utilityClass: `p-${i + 1}`,
    }
  }),
  'padding-top': Array.from(new Array(6)).map((_, i) => {
    return {
      value: `$spacer-${i + 1}`,
      utilityClass: `pt-${i + 1}`,
    }
  }),
  'padding-right': Array.from(new Array(6)).map((_, i) => {
    return {
      value: `$spacer-${i + 1}`,
      utilityClass: `pr-${i + 1}`,
    }
  }),
  'padding-bottom': Array.from(new Array(6)).map((_, i) => {
    return {
      value: `$spacer-${i + 1}`,
      utilityClass: `pb-${i + 1}`,
    }
  }),
  'padding-left': Array.from(new Array(6)).map((_, i) => {
    return {
      value: `$spacer-${i + 1}`,
      utilityClass: `pl-${i + 1}`,
    }
  }),
  'line-height': [
    {
      value: '$lh-condensed-ultra',
      utilityClass: 'lh-condensed-ultra',
    },
    {
      value: '$lh-condensed',
      utilityClass: 'lh-condensed',
    },
    {
      value: '$lh-default',
      utilityClass: 'lh-default',
    },
    {
      value: '0',
      utilityClass: 'lh-0',
    },
  ],
  'text-align': [
    {
      value: 'left',
      utilityClass: 'text-left',
    },
    {
      value: 'right',
      utilityClass: 'text-right',
    },
    {
      value: 'center',
      utilityClass: 'text-center',
    },
  ],
  'font-style': [
    {
      value: 'italic',
      utilityClass: 'text-italic',
    },
  ],
  'text-transform': [
    {
      value: 'uppercase',
      utilityClass: 'text-uppercase',
    },
  ],
  'text-decoration': [
    {
      value: 'underline',
      utilityClass: 'text-underline',
    },
    {
      value: 'none',
      utilityClass: 'no-underline',
    },
  ],
  'white-space': [
    {
      value: 'nowrap',
      utilityClass: 'no-wrap',
    },
    {
      value: 'normal',
      utilityClass: 'ws-normal',
    },
  ],
  'word-break': [
    {
      value: 'break-all',
      utilityClass: 'wb-break-all',
    },
  ],
  width: [
    {
      value: '100%',
      utilityClass: 'width-full',
    },
    {
      value: 'auto%',
      utilityClass: 'width-auto',
    },
  ],
  overflow: [
    {
      value: 'visible',
      utilityClass: 'overflow-visible',
    },
    {
      value: 'hidden',
      utilityClass: 'overflow-hidden',
    },
    {
      value: 'auto',
      utilityClass: 'overflow-auto',
    },
    {
      value: 'scroll',
      utilityClass: 'overflow-scroll',
    },
  ],
  'overflow-x': [
    {
      value: 'visible',
      utilityClass: 'overflow-x-visible',
    },
    {
      value: 'hidden',
      utilityClass: 'overflow-x-hidden',
    },
    {
      value: 'auto',
      utilityClass: 'overflow-x-auto',
    },
    {
      value: 'scroll',
      utilityClass: 'overflow-x-scroll',
    },
  ],
  'overflow-y': [
    {
      value: 'visible',
      utilityClass: 'overflow-y-visible',
    },
    {
      value: 'hidden',
      utilityClass: 'overflow-y-hidden',
    },
    {
      value: 'auto',
      utilityClass: 'overflow-y-auto',
    },
    {
      value: 'scroll',
      utilityClass: 'overflow-y-scroll',
    },
  ],
  height: [
    {
      value: '100%',
      utilityClass: 'height-full',
    },
  ],
  'max-width': [
    {
      value: '100%',
      utilityClass: 'width-fit',
    },
  ],
  'max-height': [
    {
      value: '100%',
      utilityClass: 'height-fit',
    },
  ],
  'min-width': [
    {
      value: '0',
      utilityClass: 'min-width-0',
    },
  ],
  float: [
    {
      value: 'left',
      utilityClass: 'float-left',
    },
    {
      value: 'right',
      utilityClass: 'float-right',
    },
    {
      value: 'none',
      utilityClass: 'float-none',
    },
  ],
  'list-style': [
    {
      value: 'none',
      utilityClass: 'list-style-none',
    },
  ],
  'user-select': [
    {
      value: 'none',
      utilityClass: 'user-select-none',
    },
  ],
  visibility: [
    {
      value: 'hidden',
      utilityClass: 'v-hidden',
    },
    {
      value: 'visible',
      utilityClass: 'v-visible',
    },
  ],
  'vertical-align': [
    {
      value: 'middle',
      utilityClass: 'v-align-middle',
    },
    {
      value: 'top',
      utilityClass: 'v-align-top',
    },
    {
      value: 'bottom',
      utilityClass: 'v-align-bottom',
    },
    {
      value: 'text-top',
      utilityClass: 'v-align-text-top',
    },
    {
      value: 'text-bottom',
      utilityClass: 'v-align-text-bottom',
    },
    {
      value: 'text-baseline',
      utilityClass: 'v-align-baseline',
    },
  ],
  'font-weight': [
    {
      value: '$font-weight-normal',
      utilityClass: 'text-normal',
    },
    {
      value: '$font-weight-bold',
      utilityClass: 'text-bold',
    },
    {
      value: '$font-weight-semibold',
      utilityClass: 'text-semibold',
    },
    {
      value: '$font-weight-light',
      utilityClass: 'text-light',
    },
  ],
  top: [
    {
      value: '0',
      utilityClass: 'top-0',
    },
    {
      value: 'auto',
      utilityClass: 'top-auto',
    },
  ],
  right: [
    {
      value: '0',
      utilityClass: 'right-0',
    },
    {
      value: 'auto',
      utilityClass: 'right-auto',
    },
  ],
  bottom: [
    {
      value: '0',
      utilityClass: 'bottom-0',
    },
    {
      value: 'auto',
      utilityClass: 'bottom-auto',
    },
  ],
  left: [
    {
      value: '0',
      utilityClass: 'left-0',
    },
    {
      value: 'auto',
      utilityClass: 'left-auto',
    },
  ],
  position: [
    {
      value: 'static',
      utilityClass: 'position-static',
    },
    {
      value: 'relative',
      utilityClass: 'position-relative',
    },
    {
      value: 'absolute',
      utilityClass: 'position-absolute',
    },
    {
      value: 'fixed',
      utilityClass: 'position-fixed',
    },
    {
      value: 'sticky',
      utilityClass: 'position-sticky',
    },
  ],
  'box-shadow': [
    {
      value: 'none',
      utilityClass: 'box-shadow-none',
    },
    {
      value: 'var(--color-shadow-small)',
      utilityClass: 'box-shadow-small',
    },
    {
      value: 'var(--color-shadow-medium)',
      utilityClass: 'box-shadow-medium',
    },
    {
      value: 'var(--color-shadow-large)',
      utilityClass: 'box-shadow-large',
    },
    {
      value: 'var(--color-shadow-extra-large)',
      utilityClass: 'box-shadow-extra-large',
    },
  ],
  border: [
    {
      value: '$border',
      utilityClass: 'border',
    },
    {
      value: '0',
      utilityClass: 'border-0',
    },
  ],
  'border-top': [
    {
      value: '$border',
      utilityClass: 'border-top',
    },
    {
      value: '0',
      utilityClass: 'border-top-0',
    },
  ],
  'border-right': [
    {
      value: '$border',
      utilityClass: 'border-right',
    },
    {
      value: '0',
      utilityClass: 'border-right-0',
    },
  ],
  'border-bottom': [
    {
      value: '$border',
      utilityClass: 'border-bottom',
    },
    {
      value: '0',
      utilityClass: 'border-bottom-0',
    },
  ],
  'border-left': [
    {
      value: '$border',
      utilityClass: 'border-left',
    },
    {
      value: '0',
      utilityClass: 'border-left-0',
    },
  ],
}
