'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, registerGSAP } from '../lib/gsapInit'
import { useLocale } from '../context/LocaleContext'
import styles from './HowItWorks.module.css'

export default function HowItWorks() {
  const { t } = useLocale()
  const sectionRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    registerGSAP()
    const section = sectionRef.current
    const gridSvg = gridRef.current
    if (!section || !gridSvg) return

    // Perspective grid that reacts to scroll
    const drawGrid = () => {
      const w = section.clientWidth
      const h = section.clientHeight
      gridSvg.style.width = `${w}px`
      gridSvg.style.height = `${h}px`

      const vLines = 12, hLines = 8
      const gapX = w / vLines, gapY = h / hLines
      let d = ''
      for (let i = 0; i <= vLines; i++) {
        d += `M ${gapX * i} 0 L ${gapX * i} ${h} `
      }
      for (let j = 0; j <= hLines; j++) {
        d += `M 0 ${gapY * j} L ${w} ${gapY * j} `
      }
      gridSvg.querySelector('path').setAttribute('d', d)
    }

    drawGrid()
    window.addEventListener('resize', drawGrid)

    // Steps reveal — colored mask sweep + content slide
    const steps = section.querySelectorAll(`.${styles.step}`)
    steps.forEach((step, i) => {
      const mask = step.querySelector(`.${styles.stepMask}`)
      const inner = step.querySelector(`.${styles.stepInner}`)
      const fromLeft = i % 2 === 0

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: step,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      })

      // Colored mask sweeps IN from one side (reveals the step behind it)
      if (mask) {
        tl.fromTo(mask,
          { scaleX: 0, transformOrigin: fromLeft ? '0% 50%' : '100% 50%' },
          { scaleX: 1, duration: 0.5, ease: 'power4.inOut' }
        )
        // Then sweeps OUT the other direction
        tl.to(mask, {
          scaleX: 0,
          transformOrigin: fromLeft ? '100% 50%' : '0% 50%',
          duration: 0.5,
          ease: 'power4.inOut',
        })
      }

      // Content fades in as mask sweeps out
      if (inner) {
        tl.fromTo(inner,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          '-=0.4'
        )
      }
    })

    return () => window.removeEventListener('resize', drawGrid)
  }, [])

  const steps = [
    { num: '01', titleKey: 'how.step1.title', descKey: 'how.step1.desc' },
    { num: '02', titleKey: 'how.step2.title', descKey: 'how.step2.desc' },
    { num: '03', titleKey: 'how.step3.title', descKey: 'how.step3.desc' },
    { num: '04', titleKey: 'how.step4.title', descKey: 'how.step4.desc' },
  ]

  return (
    <section id="how-it-works" ref={sectionRef} className={styles.section}>
      <svg ref={gridRef} className={styles.grid}>
        <path className={styles.gridPath} d="" />
      </svg>

      <div className={styles.container}>
        <span className={styles.label}>{t('how.label')}</span>
        <h2 className={styles.title}>{t('how.title')}</h2>
        <p className={styles.subtitle}>{t('how.subtitle')}</p>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div key={i} className={`${styles.step} ${i % 2 === 0 ? styles.stepLeft : styles.stepRight}`}>
              <div className={styles.stepMask} />
              <div className={styles.stepInner}>
                <span className={styles.stepNum}>{step.num}</span>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{t(step.titleKey)}</h3>
                  <p className={styles.stepDesc}>{t(step.descKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
