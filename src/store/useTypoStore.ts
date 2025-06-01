import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { DisplayMode, FormatMode, FormatResult } from '@/types/typoTypes'

interface TypoState {
  isHighlightingResult: boolean

  setViewMode: (isHighlightingResult: boolean) => void

  formatMode: FormatMode
  setFormatMode: (mode: FormatMode) => void

  displayMode: DisplayMode
  setDisplayMode: (mode: DisplayMode) => void

  currentInput: string
  setCurrentInput: (input: string) => void

  result: FormatResult
  setResult: (res: FormatResult) => void
}

export const useTypoStore = create<TypoState>()(
  immer((set) => ({
    currentInput: '',
    isHighlightingResult: false,
    formatMode: 'symbol',
    displayMode: 'original',
    result: { code: '', codeHighlighted: '', previewResult: '', previewHighlighted: '' },

    setViewMode: (mode) =>
      set((state) => {
        state.isHighlightingResult = mode
      }),

    setFormatMode: (mode) =>
      set((state) => {
        state.formatMode = mode
      }),

    setDisplayMode: (mode) =>
      set((state) => {
        state.displayMode = mode
      }),

    setResult: (res) =>
      set((state) => {
        state.result = res
      }),

    setCurrentInput: (input) =>
      set((state) => {
        state.currentInput = input
      }),
  }))
)
