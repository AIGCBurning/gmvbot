'use client'

import { useLocale } from '../context/LocaleContext'
import styles from './LanguageToggle.module.css'

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <button
      className={styles.toggle}
      onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
      aria-label="Toggle language"
    >
      <span className={locale === 'en' ? styles.active : ''}>EN</span>
      <span className={styles.divider}>/</span>
      <span className={locale === 'zh' ? styles.active : ''}>中文</span>
    </button>
  )
}
