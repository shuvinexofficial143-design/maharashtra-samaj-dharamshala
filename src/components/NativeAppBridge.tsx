import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app'
import { AppLauncher } from '@capacitor/app-launcher'
import { Browser } from '@capacitor/browser'
import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { getNativeLinkMode } from '../services/nativeLinks'

async function openOutsideApp(url: URL, mode: 'app' | 'browser') {
  if (mode === 'app') {
    await AppLauncher.openUrl({ url: url.href })
    return
  }

  await Browser.open({ url: url.href, presentationStyle: 'popover' })
}

export function NativeAppBridge() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    document.body.classList.add('capacitor-native')
    void SystemBars.setStyle({ style: SystemBarsStyle.Light })
    void SystemBars.show()
    void SplashScreen.hide()

    return () => document.body.classList.remove('capacitor-native')
  }, [])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    let disposed = false
    let removeListener: (() => Promise<void>) | undefined

    void CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (location.pathname !== '/') {
        if (canGoBack) navigate(-1)
        else navigate('/', { replace: true })
        return
      }

      void CapacitorApp.minimizeApp()
    }).then(handle => {
      if (disposed) void handle.remove()
      else removeListener = () => handle.remove()
    })

    return () => {
      disposed = true
      if (removeListener) void removeListener()
    }
  }, [location.pathname, navigate])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const handleExternalLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target
      const anchor = target instanceof Element ? target.closest<HTMLAnchorElement>('a[href]') : null
      if (!anchor || anchor.hasAttribute('download')) return

      const rawHref = anchor.getAttribute('href')
      if (!rawHref || rawHref.startsWith('#')) return

      const url = new URL(anchor.href, window.location.href)
      const mode = getNativeLinkMode(url, window.location.origin)
      if (!mode) return

      event.preventDefault()
      void openOutsideApp(url, mode).catch(() => {
        // The WebView remains on the current screen if Android has no matching app.
      })
    }

    document.addEventListener('click', handleExternalLink, true)
    return () => document.removeEventListener('click', handleExternalLink, true)
  }, [])

  return null
}
