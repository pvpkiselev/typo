export function highlightTextChanges(text: string, changes: Map<number, string>): string {
  if (changes.size === 0) {
    return escapeHtml(text)
  }

  const fragments = []
  let lastPos = 0
  const sortedChanges = Array.from(changes.entries()).sort((a, b) => a[0] - b[0])

  for (const [pos, replacement] of sortedChanges) {
    if (lastPos < pos) {
      fragments.push(escapeHtml(text.substring(lastPos, pos)))
    }

    fragments.push(`<span class="bg-green-100">${escapeHtml(replacement)}</span>`)
    lastPos = pos + replacement.length
  }

  if (lastPos < text.length) {
    fragments.push(escapeHtml(text.substring(lastPos)))
  }

  return fragments.join('')
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
