/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang, LocalText } from '../types'

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  tx: (text: LocalText) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getStoredLanguage(): Lang {
  if (typeof window === 'undefined') return 'hi'
  try {
    const stored = window.localStorage.getItem('msd-language')
    return stored === 'en' || stored === 'hi' ? stored : 'hi'
  } catch {
    return 'hi'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getStoredLanguage)
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const setLang = (next: Lang) => {
    setLangState(next)
    try { window.localStorage.setItem('msd-language', next) } catch { /* Storage can be unavailable in private/restricted browsers. */ }
  }
  const value = useMemo(() => ({ lang, setLang, tx: (text: LocalText) => text[lang] }), [lang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider')
  return value
}
