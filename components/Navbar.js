'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useLocale } from '../context/LocaleContext'
import LanguageToggle from './LanguageToggle'
import styles from './Navbar.module.css'

const consoleMessages = [
  'Initializing agent swarm…',
  'Deploying revenue protocols',
  'Mapping market opportunities…',
  'Syncing neural pathways',
  'Calibrating OPC framework…',
  'Loading agent personalities',
  'Scanning for alpha…',
  'Compiling business logic',
  'Optimizing GMV calculations…',
  'Building your AI company',
]

export default function Navbar({ isReady, onAction }) {
  const { t } = useLocale()
  const navRef = useRef(null)
  const consoleRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Typewriter console
  useEffect(() => {
    if (!isReady) return
    const el = consoleRef.current
    if (!el) return

    let msg = '', queue = '', lastTime = 0, delay = 1500, frame
    const getMsg = () => consoleMessages[Math.floor(Math.random() * consoleMessages.length)]

    const tick = (time) => {
      if (time - lastTime < delay) { frame = requestAnimationFrame(tick); return }
      if (queue === '') {
        queue = getMsg()
        delay = 1200
        el.textContent += '\n'
      } else {
        const ch = queue.charAt(0)
        queue = queue.substring(1)
        el.textContent += ch
        delay = ch === '…' ? 300 : ch === ' ' ? 80 : 30
      }
      // Keep last 3 lines
      el.textContent = el.textContent.split('\n').slice(-3).join('\n')
      lastTime = time
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isReady])

  // Intro animation
  useEffect(() => {
    if (!isReady) return
    const el = navRef.current
    if (!el) return

    gsap.from(el, { y: '-100%', duration: 1.2, ease: 'expo.inOut', delay: 0 })

    const items = el.querySelectorAll(`.${styles.navItem}, .${styles.logoWrap}`)
    gsap.from(items, { y: '-100%', opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.4 })
  }, [isReady])

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: t('nav.features'), href: '#features' },
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: t('nav.community'), href: '#community' },
  ]

  const scrollTo = (e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) window.lenis?.scrollTo(el, { duration: 1.5 })
  }

  return (
    <header
      ref={navRef}
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.inner}>
        <a href="#" onClick={e => e.preventDefault()} className={`${styles.logoWrap}`} data-cursor-hover>
          <span className={styles.logo}>GMV<span className={styles.logoCyan}>Bot</span></span>
        </a>

        <div className={styles.console}>
          <pre ref={consoleRef} className={styles.consoleText} />
        </div>

        <nav className={styles.nav}>
          <ul className={styles.list}>
            {links.map(l => (
              <li key={l.href} className={styles.navItem}>
                <a href={l.href} onClick={e => scrollTo(e, l.href)} className={styles.link} data-cursor-hover>
                  <span className={styles.linkArrow} />
                  <span className={styles.linkText}>{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <LanguageToggle />
          <button onClick={onAction} className={styles.ctaBtn} data-cursor-hover>
            {t('nav.getStarted')}
          </button>
        </div>

        <button
          className={`${styles.burger} ${mobileOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        {links.map(l => (
          <a key={l.href} href={l.href} onClick={e => scrollTo(e, l.href)} className={styles.mobileLink}>
            {l.label}
          </a>
        ))}
        <div className={styles.mobileActions}>
          <LanguageToggle />
          <button onClick={onAction} className={styles.ctaBtn}>
            {t('nav.getStarted')}
          </button>
        </div>
      </div>
    </header>
  )
}
