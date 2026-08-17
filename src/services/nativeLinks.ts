export type NativeLinkMode = 'app' | 'browser' | null

const nativeIntentSchemes = new Set(['geo:', 'market:', 'sms:', 'tel:', 'whatsapp:'])

export function isNativeIntentUrl(url: URL) {
  if (nativeIntentSchemes.has(url.protocol)) return true

  const hostname = url.hostname.toLowerCase()
  return hostname === 'wa.me'
    || hostname.endsWith('.whatsapp.com')
    || hostname === 'maps.app.goo.gl'
    || hostname === 'maps.google.com'
    || (hostname === 'www.google.com' && url.pathname.startsWith('/maps'))
}

export function getNativeLinkMode(url: URL, appOrigin: string): NativeLinkMode {
  if (isNativeIntentUrl(url)) return 'app'
  if (url.protocol === 'https:' && url.origin !== appOrigin) return 'browser'
  return null
}
