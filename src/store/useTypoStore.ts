import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { FormatMode } from '@/types/typoTypes'

export type FormatResult = {
  result: string
  highlighted: string
}

interface TypoState {
  isHighlightingResult: boolean
  formatMode: FormatMode
  setViewMode: (isHighlightingResult: boolean) => void
  setFormatMode: (mode: FormatMode) => void
  result: FormatResult
  setResult: (res: { result: string; highlighted: string }) => void
}

export const useTypoStore = create<TypoState>()(
  immer((set) => ({
    isHighlightingResult: false,
    formatMode: 'symbol',
    result: { result: '', highlighted: '' },

    setViewMode: (mode) =>
      set((state) => {
        state.isHighlightingResult = mode
      }),

    setFormatMode: (mode) =>
      set((state) => {
        state.formatMode = mode
      }),

    setResult: (res) =>
      set((state) => {
        state.result = res
      }),
  }))
)
