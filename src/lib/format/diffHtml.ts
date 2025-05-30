import { diffWordsWithSpace } from 'diff'

export function diffHtml(oldText: string, newText: string): string[] {
  const diff = diffWordsWithSpace(oldText, newText)

  return diff
    .filter((part) => !part.removed)
    .map((part) =>
      part.added ? `<ins class="text-green-600 bg-green-100 no-underline">${part.value}</ins>` : part.value
    )
}
