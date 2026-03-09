'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import en from '../locales/en.json'
import zh from '../locales/zh.json'

const messages = { en, zh }

const LocaleContext = createContext(null)

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('gmvbot-locale')
    if (saved && messages[saved]) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = useCallback((l) => {
    setLocaleState(l)
    localStorage.setItem('gmvbot-locale', l)
  }, [])

  const t = useCallback(
    (key) => messages[locale]?.[key] ?? key,
    [locale]
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
