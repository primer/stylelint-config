import {testIdProps} from '@github-ui/test-id-props'
import {AlertIcon, CheckCircleIcon, InfoIcon, StopIcon, XIcon} from '@primer/octicons-react'
import {Box, Octicon, sx, type SxProp, Text, themeGet} from '@primer/react'
import {useCallback, useEffect, useRef} from 'react'
import styled, {keyframes} from 'styled-components'

import {TOAST_ANIMATION_LENGTH, type ToastItem, ToastType} from './types'

type IToastCloseButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>

const StyledButton = styled.button`
  padding: 8px;
  margin: 8px 10px 8px 0px;
  border-radius: 3px;
  color: ${themeGet('colors.fg.onEmphasis')};
  border: 0;
  background: transparent;
  outline: none;
  cursor: pointer;

  /* can be removed if using Primer IconButton component */
  &:focus {
    box-shadow: 0 0 0 2px ${themeGet('colors.accent.fg')};
  }
`

const ToastCloseButton = (props: IToastCloseButtonProps) => (
  <StyledButton aria-label="Close" {...props}>
    <Octicon icon={XIcon} />
  </StyledButton>
)

/**
 * Lookup for converting toast types into Primer colors
 */
export const stateColorMap = {
  [ToastType.default]: 'accent.emphasis',
  [ToastType.success]: 'success.emphasis',
  [ToastType.warning]: 'attention.emphasis',
  [ToastType.error]: 'danger.emphasis',
}

const DefaultIcon = <Octicon icon={InfoIcon} sx={{color: 'fg.onEmphasis'}} />
const SuccessIcon = <Octicon icon={CheckCircleIcon} sx={{color: 'fg.onEmphasis'}} />
export const WarningIcon = <Octicon icon={AlertIcon} sx={{color: 'fg.onEmphasis'}} />
const ErrorIcon = <Octicon icon={StopIcon} sx={{color: 'fg.onEmphasis'}} />

const stateMap = {
  [ToastType.default]: DefaultIcon,
  [ToastType.success]: SuccessIcon,
  [ToastType.warning]: WarningIcon,
  [ToastType.error]: ErrorIcon,
}

const toastEnter = keyframes`
  from {
    transform: translateX(-400px);
  }
  to {
    transform: translateX(0);
  }
`

const toastLeave = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-460px);
  }

`

export const IconContainer = styled(Box)`
  flex-shrink: 0;
  padding: ${themeGet('space.3')};
`

export const StyledToast = styled.div`
  position: fixed;
  display: flex;
  gap: ${themeGet('space.2')};
  box-shadow: ${themeGet('shadows.shadow.large')};
  background-color: ${themeGet('colors.neutral.emphasisPlus')};
  border-radius: ${themeGet('radii.2')};
  align-items: stretch;
  box-sizing: border-box;
  overflow: hidden;
  max-width: 400px;
  bottom: 66px;
  left: 12px;z-index:99;

  animation: ${toastEnter} ${TOAST_ANIMATION_LENGTH}ms cubic-bezier(0.25, 1, 0.5, 1);

  &.toast-leave {
    animation: ${toastLeave} ${TOAST_ANIMATION_LENGTH}ms cubic-bezier(0.5, 0, 0.75, 0) forwards;
  }
`

export const ToastAction = styled.button<SxProp>`
  background-color: transparent;
  border: 0;
  font-weight: ${themeGet('fontWeights.bold')};
  margin-left: ${themeGet('space.2')};

  margin-top: ${themeGet('space.3')};
  margin-bottom: ${themeGet('space.3')};
  color: ${themeGet('colors.fg.onEmphasis')};
  font-size: ${themeGet('fontSizes.1')};
  font-family: inherit;
  outline: none;
  padding: 0;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    border-color: transparent;
    box-shadow: 0 0 0 3px ${themeGet('colors.border.default')};
  }
  ${sx}
`

interface ToastProps {
  removeToast: (id: number) => void
  startRemovingToast: (id: number) => void
  toast: ToastItem
}

/**
 * Component for rendering a toast within the application
 */
const Toast = (props: ToastProps) => {
  const {toast, startRemovingToast} = props
  const callToActionRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // eslint-disable-next-line @github-ui/ui-commands/no-manual-shortcut-logic
      if (callToActionRef.current && event.ctrlKey && event.key === 't') {
        callToActionRef.current.focus()
        toast.timeout?.cancel()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [toast])

  const toastIcon = toast.icon ? (
    <Octicon icon={toast.icon} sx={{color: 'fg.onEmphasis', m: 'auto'}} />
  ) : (
    stateMap[toast.type]
  )

  const handleActionClick = useCallback(() => {
    toast.action?.handleClick()
    startRemovingToast(toast.id)
  }, [toast, startRemovingToast])

  return (
    <StyledToast role="status" className={toast.className} {...testIdProps('toast')}>
      <IconContainer sx={{bg: stateColorMap[toast.type], display: 'flex', alignItems: 'center'}}>
        {toastIcon}
      </IconContainer>
      <Text sx={{fontSize: 1, mx: 2, my: 3, color: 'fg.onEmphasis'}}>{toast.message}</Text>
      {toast.action && (
        <ToastAction ref={callToActionRef} onClick={handleActionClick} {...testIdProps('toast-action')}>
          {toast.action.text}
        </ToastAction>
      )}
      <ToastCloseButton onClick={() => startRemovingToast(toast.id)} />
    </StyledToast>
  )
}

export default Toast