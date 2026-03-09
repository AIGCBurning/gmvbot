'use client'

import { useEffect, useRef } from 'react'
import { gsap, registerGSAP } from '../lib/gsapInit'
import { useLocale } from '../context/LocaleContext'
import styles from './Footer.module.css'

export default function Footer({ onAction }) {
  const { t } = useLocale()
  const ctaRef = useRef(null)
  const gridRef = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    registerGSAP()
    const cta = ctaRef.current
    const gridSvg = gridRef.current
    if (!cta || !gridSvg) return

    // CTA grid
    const drawGrid = () => {
      const w = cta.clientWidth
      const h = cta.clientHeight
      gridSvg.style.width = `${w}px`
      gridSvg.style.height = `${h}px`

      const vLines = 12, gapX = w / vLines
      const hLines = 8, gapY = h / hLines
      let d = ''
      for (let i = 0; i <= vLines; i++) d += `M ${gapX * i} 0 L ${gapX * i} ${h} `
      for (let j = 0; j <= hLines; j++) d += `M 0 ${gapY * j} L ${w} ${gapY * j} `
      gridSvg.querySelector('path').setAttribute('d', d)
    }
    drawGrid()
    window.addEventListener('resize', drawGrid)

    // CTA title clip-path reveal
    const title = cta.querySelector(`.${styles.ctaTitle}`)
    if (title) {
      gsap.fromTo(title,
        { clipPath: 'inset(0 50% 0 50%)' },
        {
          clipPath: 'inset(0 0% 0 0%)',
          duration: 1.2,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: cta, start: 'top 80%', once: true },
        }
      )
    }

    // Button pulse
    const btn = btnRef.current
    if (btn) {
      const pulse = gsap.timeline({ repeat: -1, repeatDelay: 1 })
      pulse.fromTo(btn, { scale: 0.95 }, { scale: 1.05, duration: 2, ease: 'power2.in' })
      pulse.to(btn, { scale: 0.95, duration: 0.15, ease: 'power4.out' })
    }

    return () => window.removeEventListener('resize', drawGrid)
  }, [])

  const footerLinks = [
    { title: t('footer.product'), links: [t('footer.product.features'), t('footer.product.pricing'), t('footer.product.docs'), t('footer.product.changelog')] },
    { title: t('footer.company'), links: [t('footer.company.about'), t('footer.company.blog'), t('footer.company.careers'), t('footer.company.press')] },
    { title: t('footer.connect'), links: [t('footer.connect.twitter'), t('footer.connect.discord'), t('footer.connect.github'), t('footer.connect.email')] },
  ]

  return (
    <>
      <section id="cta" ref={ctaRef} className={styles.cta}>
        <svg ref={gridRef} className={styles.grid}>
          <path className={styles.gridPath} d="" />
        </svg>

        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            {t('cta.title.before')}
            <span className={styles.ctaButtonAlpha}>{t('cta.title.alpha')}</span>
            {t('cta.title.after')}
          </h2>
          <p className={styles.ctaSubtitle}>{t('cta.subtitle')}</p>

          <div ref={btnRef} className={styles.ctaButtonWrap}>
            <button onClick={onAction} className={styles.ctaButton} data-cursor-hover>
              <span className={styles.ctaButtonText}>
                {t('cta.button.before')}
                <span className={styles.ctaButtonAlpha}>{t('cta.button.alpha')}</span>
                {t('cta.button.after')}
              </span>
            </button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <a href="#" onClick={e => e.preventDefault()} className={styles.footerLogo}>
              GMV<span className={styles.footerLogoCyan}>Bot</span>
            </a>
            <p className={styles.footerTagline}>AI Agent platform for one-person companies.</p>
          </div>
          {footerLinks.map(col => (
            <div key={col.title} className={styles.footerCol}>
              <h4 className={styles.footerColTitle}>{col.title}</h4>
              <ul className={styles.footerList}>
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" onClick={e => { e.preventDefault(); onAction() }} className={styles.footerLink} data-cursor-hover>
                      <span className={styles.footerLinkArrow} />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.footerBottom}>
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </>
  )
}
