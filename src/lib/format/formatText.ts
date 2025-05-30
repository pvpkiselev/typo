import { diffWordsWithSpace } from 'diff'
import type { TypografPrefs } from 'typograf'
import Typograf from 'typograf'

import { FormatMode } from '@/types/typoTypes'

type FormatResult = {
  result: string
  highlighted: string
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
    if (part.added) {
      fragments.push(`<span class="bg-green-100">${escapeHtml(part.value, formatMode)}</span>`)
    } else if (!part.removed) {
      fragments.push(escapeHtml(part.value, formatMode))
    }
  }

  return {
    result,
    highlighted: fragments.join(''),
  }
}

function escapeHtml(str: string, formatMode: FormatMode): string {
  if (formatMode === 'symbol') {
    return str
  }

  let escaped = str.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  escaped = escaped.replace(/&(?!([a-z]+|#[0-9]+|#x[0-9a-f]+);)/gi, '&amp;')

  return escaped
}
