import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

import { Button, type ButtonProps } from './button'

export interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: ReactNode
}

export function SubmitButton({
  isLoading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      {...props}
      type={props.type ?? 'submit'}
      disabled={isLoading || disabled}
      className={className}
    >
      <span className='flex items-center justify-center gap-2'>
        {isLoading ? (
          <>
            <Loader2 className='h-4 w-4 animate-spin' aria-hidden />
            {loadingText ?? 'Submitting...'}
          </>
        ) : (
          children
        )}
      </span>
    </Button>
  )
}

