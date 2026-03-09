'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, registerGSAP } from '../lib/gsapInit'
import { useLocale } from '../context/LocaleContext'
import styles from './Features.module.css'

const icons = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="11"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><rect x="1" y="18" width="6" height="4" rx="1"/><rect x="9" y="18" width="6" height="4" rx="1"/><rect x="17" y="18" width="6" height="4" rx="1"/><line x1="12" y1="6" x2="12" y2="14"/><line x1="4" y1="14" x2="20" y2="14"/><line x1="4" y1="14" x2="4" y2="18"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="20" y1="14" x2="20" y2="18"/></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
]

export default function Features() {
  const { t } = useLocale()
  const sectionRef = useRef(null)

  useEffect(() => {
    registerGSAP()
    const section = sectionRef.current
    if (!section) return

    // Reveal cards — purple mask sweep + slide up
    const cards = section.querySelectorAll(`.${styles.card}`)
    cards.forEach((card, i) => {
      const mask = card.querySelector(`.${styles.cardMask}`)
      const inner = card.querySelector(`.${styles.cardInner}`)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      // Purple mask sweeps in from top
      if (mask) {
        tl.fromTo(mask,
          { scaleY: 0, transformOrigin: '50% 0%' },
          { scaleY: 1, duration: 0.45, ease: 'power4.inOut', delay: i * 0.08 }
        )
        // Then sweeps out to bottom
        tl.to(mask, {
          scaleY: 0,
          transformOrigin: '50% 100%',
          duration: 0.45,
          ease: 'power4.inOut',
        })
      }

      // Content fades in as mask sweeps out
      if (inner) {
        tl.fromTo(inner,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          '-=0.35'
        )
      }
    })
  }, [])

  const cards = [
    { icon: icons[0], titleKey: 'features.card1.title', descKey: 'features.card1.desc' },
    { icon: icons[1], titleKey: 'features.card2.title', descKey: 'features.card2.desc' },
    { icon: icons[2], titleKey: 'features.card3.title', descKey: 'features.card3.desc' },
    { icon: icons[3], titleKey: 'features.card4.title', descKey: 'features.card4.desc' },
  ]

  return (
    <section id="features" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <span className={styles.label}>{t('features.label')}</span>
        <h2 className={styles.title}>{t('features.title')}</h2>
        <p className={styles.subtitle}>{t('features.subtitle')}</p>

        <div className={styles.grid}>
          {cards.map((card, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardMask} />
              <div className={styles.cardInner}>
                <div className={styles.iconWrap}>{card.icon}</div>
                <h3 className={styles.cardTitle}>{t(card.titleKey)}</h3>
                <p className={styles.cardDesc}>{t(card.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
