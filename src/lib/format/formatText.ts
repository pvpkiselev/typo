import { diffWordsWithSpace } from 'diff'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import type { TypografPrefs } from 'typograf'
import Typograf from 'typograf'

import { FormatMode } from '@/types/typoTypes'

type FormatResult = {
  result: string
  highlighted: string
}

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ['span'],
    ALLOWED_ATTR: ['class'],
  })
}

export function formatText(sourceText: string, formatMode: FormatMode): FormatResult {
  const tpConfig: TypografPrefs = {
    locale: ['ru', 'en-US'],
    htmlEntity: {},
  }

  switch (formatMode) {
    case 'name':
      tpConfig.htmlEntity = { type: 'name' }
      break
    case 'digit':
      tpConfig.htmlEntity = { type: 'digit' }
      break
    case 'symbol':
      tpConfig.htmlEntity = { type: undefined }
      break
    default:
      console.warn(`Unknown formatMode: ${formatMode}. Defaulting to symbol-like behavior with escape.`)
      tpConfig.htmlEntity = { type: undefined }
      break
  }

  const tp = new Typograf(tpConfig)

  tp.enableRule('common/html/escape')

  const result = tp.execute(sourceText)

  const diff = diffWordsWithSpace(sourceText, result)
  const fragments: string[] = []

  for (const part of diff) {
    if (part.added) {
      fragments.push(`<span class="bg-green-100">${part.value}</span>`)
    } else if (!part.removed) {
      fragments.push(part.value)
    }
  }

  const highlighted = fragments.join('')
  const safeHighlighted = sanitizeHtml(highlighted)

  return {
    result,
    highlighted: safeHighlighted,
  }
}
