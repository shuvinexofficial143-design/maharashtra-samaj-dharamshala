import { describe, expect, it } from 'vitest'
import { getNativeLinkMode } from './nativeLinks'

const appOrigin = 'https://localhost'

describe('getNativeLinkMode', () => {
  it('keeps React routes inside the app', () => {
    expect(getNativeLinkMode(new URL('https://localhost/booking'), appOrigin)).toBeNull()
  })

  it('opens phone links with an Android app', () => {
    expect(getNativeLinkMode(new URL('tel:+919724268494'), appOrigin)).toBe('app')
  })

  it('opens WhatsApp links with an Android app when available', () => {
    expect(getNativeLinkMode(new URL('https://wa.me/919724268494'), appOrigin)).toBe('app')
  })

  it('opens Google Maps links with an Android app when available', () => {
    expect(getNativeLinkMode(new URL('https://www.google.com/maps/search/?api=1&query=Ujjain'), appOrigin)).toBe('app')
  })

  it('opens other external HTTPS links in the system browser', () => {
    expect(getNativeLinkMode(new URL('https://example.com/help'), appOrigin)).toBe('browser')
  })

  it('does not opt cleartext links into the native bridge', () => {
    expect(getNativeLinkMode(new URL('http://example.com'), appOrigin)).toBeNull()
  })
})
