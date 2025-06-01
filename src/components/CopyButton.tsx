'use client'

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { cn } from '@/lib/utils'

import { Icons } from './Icons'
import type { ButtonSize, ButtonVariant } from './ui/button'
import { Button } from './ui/button'

interface Props {
  textToCopy: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function CopyButton(props: Props) {
  const { textToCopy, variant, size, className } = props
  const { copyStatus, copyToClipboard } = useCopyToClipboard()

  return (
    <Button
      onClick={() => copyToClipboard(textToCopy)}
      size={size || 'default'}
      variant={
        copyStatus === 'success' ? 'positive' : copyStatus === 'error' ? 'destructive' : variant ? variant : 'default'
      }
      className={cn('gap-2', className)}
    >
      {copyStatus === 'success' ? (
        <Icons.Check className="h-4 w-4" />
      ) : copyStatus === 'error' ? (
        <Icons.Cross className="h-4 w-4" />
      ) : (
        <Icons.Copy className="h-4 w-4" />
      )}
      {copyStatus === 'success' ? 'Copied!' : copyStatus === 'error' ? 'Error' : 'Copy Result'}
    </Button>
  )
}
