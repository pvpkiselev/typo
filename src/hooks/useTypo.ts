'use client'

import { useState } from 'react'

import { useTypoStore } from '@/store/useTypoStore'

export function useTypo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { currentInput, setCurrentInput, formatMode, setResult, setDisplayMode } = useTypoStore()

  const format = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/format', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceText: currentInput, formatMode }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to format text')
      }

      const data = await res.json()

      setResult(data)
      setDisplayMode('codeHighlighted')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown Error')
    } finally {
      setLoading(false)
    }
  }

  return { input: currentInput, setInput: setCurrentInput, format, loading, error }
}
