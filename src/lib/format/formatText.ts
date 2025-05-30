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

function escapeHtml(str: string): string {
  return str
    .replace(/&(?!(#[0-9]+|#x[0-9a-f]+|[a-z]+);)/gi, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
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
  }

  const tp = new Typograf(tpConfig)
  tp.enableRule('common/html/escape')

  const result = tp.execute(sourceText)

  const diff = diffWordsWithSpace(sourceText, result)
  const fragments: string[] = []

  for (const part of diff) {
    const safeText = escapeHtml(part.value)

    if (part.added) {
      fragments.push(`<span class="bg-green-100">${safeText}</span>`)
    } else if (!part.removed) {
      fragments.push(safeText)
    }
  }

  const highlighted = fragments.join('')

  const safeHighlighted = sanitizeHtml(highlighted)

  return {
    result,
    highlighted: safeHighlighted,
  }
}
