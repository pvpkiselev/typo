'use client'

import { useState } from 'react'

type CopyStatusType = 'idle' | 'loading' | 'error' | 'success'

export function useCopyToClipboard() {
  const [copyStatus, setCopyStatus] = useState<CopyStatusType>('idle')

  const copyToClipboard = async (text: string) => {
    if (!text) {
      return
    }

    setCopyStatus('loading')

    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('success')
    } catch (error: unknown) {
      console.error('Failed to copy text to clipboard', error)
      setCopyStatus('error')
    } finally {
      setTimeout(() => {
        setCopyStatus('idle')
      }, 1000)
    }
  }

  return { copyStatus, copyToClipboard }
}
