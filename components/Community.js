'use client'

import { useEffect, useRef } from 'react'
import { gsap, registerGSAP } from '../lib/gsapInit'
import { useLocale } from '../context/LocaleContext'
import styles from './Community.module.css'

export default function Community() {
  const { t } = useLocale()
  const sectionRef = useRef(null)

  useEffect(() => {
    registerGSAP()
    const section = sectionRef.current
    if (!section) return

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

      // Green mask sweeps in from top
      if (mask) {
        tl.fromTo(mask,
          { scaleY: 0, transformOrigin: '50% 0%' },
          { scaleY: 1, duration: 0.45, ease: 'power4.inOut', delay: i * 0.1 }
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

  const companies = [
    { nameKey: 'community.company1.name', taglineKey: 'community.company1.tagline', agentsKey: 'community.company1.agents', gmvKey: 'community.company1.gmv' },
    { nameKey: 'community.company2.name', taglineKey: 'community.company2.tagline', agentsKey: 'community.company2.agents', gmvKey: 'community.company2.gmv' },
    { nameKey: 'community.company3.name', taglineKey: 'community.company3.tagline', agentsKey: 'community.company3.agents', gmvKey: 'community.company3.gmv' },
  ]

  return (
    <section id="community" ref={sectionRef} className={styles.section}>
      <div className={styles.dots} />
      <div className={styles.container}>
        <span className={styles.label}>{t('community.label')}</span>
        <h2 className={styles.title}>{t('community.title')}</h2>
        <p className={styles.subtitle}>{t('community.subtitle')}</p>

        <div className={styles.grid}>
          {companies.map((co, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardMask} />
              <div className={styles.cardInner}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatar}>{t(co.nameKey).charAt(0)}</div>
                  <div>
                    <h3 className={styles.cardName}>{t(co.nameKey)}</h3>
                    <p className={styles.cardTagline}>{t(co.taglineKey)}</p>
                  </div>
                </div>
                <div className={styles.cardStats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{t(co.agentsKey)}</span>
                    <span className={styles.statLabel}>Active</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{t(co.gmvKey)}</span>
                    <span className={styles.statLabel}>GMV</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
