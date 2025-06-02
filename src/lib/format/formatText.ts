import fastDiff from 'fast-diff'
import { decode } from 'html-entities'
import sanitizeHtml from 'sanitize-html'
import type { TypografPrefs } from 'typograf'
import Typograf from 'typograf'

import type { FormatMode, FormatResult } from '@/types/typoTypes'

type DiffResultType = 'code' | 'preview'

const codeHighlightSanitizeConfig = {
  allowedTags: ['span'],
  allowedAttributes: {
    span: ['class'],
  },
}

const previewSanitizeConfig = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'hr',
    'b',
    'i',
    'em',
    'strong',
    'a',
    'ul',
    'ol',
    'li',
    'blockquote',
    'img',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'div',
    'span',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
}

const typografInstances: Record<FormatMode, Typograf> = (() => {
  const instances = {} as Record<FormatMode, Typograf>

  const modes: FormatMode[] = ['name', 'digit', 'symbol']
  modes.forEach((mode) => {
    const tpConfig: TypografPrefs = {
      locale: ['ru', 'en-US'],
      htmlEntity: {
        type: mode === 'name' ? 'name' : mode === 'digit' ? 'digit' : undefined,
      },
    }

    const tp = new Typograf(tpConfig)
    instances[mode] = tp
  })

  return instances
})()

export function sanitizeCodeHighlightHtml(input: string): string {
  return sanitizeHtml(input, codeHighlightSanitizeConfig)
}

export function sanitizePreviewDisplayHtml(input: string): string {
  return sanitizeHtml(input, previewSanitizeConfig)
}

const diffClasses = {
  code: 'text-green-600',
  preview: 'bg-green-100',
}

function createDiffHighlighted(oldText: string, newText: string, diffType: DiffResultType): string {
  const diffs = fastDiff(oldText, newText)
  const fragments: string[] = []

  for (const [type, text] of diffs) {
    if (type === fastDiff.EQUAL) {
      fragments.push(text)
      continue
    }

    if (type === fastDiff.INSERT) {
      const className = diffClasses[diffType]
      fragments.push(`<span class="${className}">${text}</span>`)
    }
  }

  return fragments.join('')
}

function decodeHtmlEntities(html: string): string {
  return decode(html)
}

function escapeHtmlForDisplay(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const formatTextCache = new Map<string, FormatResult>()

export function formatText(sourceText: string, formatMode: FormatMode): FormatResult {
  const cacheKey = `${formatMode}:${sourceText}`

  if (formatTextCache.has(cacheKey)) {
    return formatTextCache.get(cacheKey)!
  }

  const tp = typografInstances[formatMode]
  const typografResult = tp.execute(sourceText)

  const escapedSourceText = escapeHtmlForDisplay(sourceText)
  const escapedTypografResult = escapeHtmlForDisplay(typografResult)

  const codeHighlighted = sanitizeCodeHighlightHtml(
    createDiffHighlighted(escapedSourceText, escapedTypografResult, 'code')
  )

  const decodedTypografResult = decodeHtmlEntities(typografResult)
  const previewResult = sanitizePreviewDisplayHtml(decodedTypografResult)

  const decodedSourceText = decodeHtmlEntities(sourceText)
  const sanitizedDecodedSourceText = sanitizePreviewDisplayHtml(decodedSourceText)

  const rawPreviewHighlighted = createDiffHighlighted(sanitizedDecodedSourceText, previewResult, 'preview')
  const previewHighlighted = sanitizePreviewDisplayHtml(rawPreviewHighlighted)

  const finalResult: FormatResult = {
    code: typografResult,
    codeHighlighted,
    previewResult: previewResult,
    previewHighlighted: previewHighlighted,
  }

  formatTextCache.set(cacheKey, finalResult)

  return finalResult
}
