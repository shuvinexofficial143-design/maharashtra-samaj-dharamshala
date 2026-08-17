export type ClipboardDependencies = {
  clipboard?: { writeText: (text: string) => Promise<void> }
  document?: Document
}

export async function copyText(text: string, dependencies?: ClipboardDependencies): Promise<boolean> {
  if (!text) return false
  const clipboard = dependencies?.clipboard ?? (typeof navigator !== 'undefined' ? navigator.clipboard : undefined)
  if (clipboard?.writeText) {
    try {
      await clipboard.writeText(text)
      return true
    } catch {
      // Continue to the selection-based fallback.
    }
  }
  const currentDocument = dependencies?.document ?? (typeof document !== 'undefined' ? document : undefined)
  if (!currentDocument?.body || typeof currentDocument.execCommand !== 'function') return false
  const textarea = currentDocument.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  currentDocument.body.appendChild(textarea)
  textarea.select()
  try {
    return currentDocument.execCommand('copy')
  } catch {
    return false
  } finally {
    textarea.remove()
  }
}
