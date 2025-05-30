'use client'

import { useState } from 'react'

import { useTypoStore } from '@/store/useTypoStore'

export function useTypo() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatMode = useTypoStore((state) => state.formatMode)
  const setResult = useTypoStore((state) => state.setResult)

  const format = async () => {
    if (!input.trim()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/format', {
        method: 'POST',
        body: JSON.stringify({
          sourceText: input,
          formatMode,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error')
      }

      setResult({ highlighted: data.highlighted, result: data.result })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown Error')
    } finally {
      setLoading(false)
    }
  }

  return { input, setInput, format, loading, error }
}
