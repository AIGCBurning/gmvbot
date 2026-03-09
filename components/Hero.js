'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap, ScrollTrigger, registerGSAP } from '../lib/gsapInit'
import { useLocale } from '../context/LocaleContext'
import Noise from '../lib/Noise'
import styles from './Hero.module.css'

function WavesSVG() {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const stateRef = useRef({
    noise: new Noise(Math.random()),
    lines: [],
    paths: [],
    mouse: { x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false },
    bounding: { left: 0, top: 0, width: 0, height: 0 },
    paused: false,
  })

  useEffect(() => {
    const container = containerRef.current
    const svg = svgRef.current
    if (!container || !svg) return

    const state = stateRef.current

    const setSize = () => {
      const b = container.getBoundingClientRect()
      state.bounding = { left: b.left, top: b.top + window.scrollY, width: container.clientWidth, height: container.clientHeight }
      svg.style.width = `${state.bounding.width}px`
      svg.style.height = `${state.bounding.height}px`
    }

    const setLines = () => {
      const { width, height } = state.bounding
      state.lines = []
      state.paths.forEach(p => p.remove())
      state.paths = []

      const xGap = 12, yGap = 28
      const oW = width + 200, oH = height + 30
      const totalLines = Math.ceil(oW / xGap)
      const totalPoints = Math.ceil(oH / yGap)
      const xStart = (width - xGap * totalLines) / 2
      const yStart = (height - yGap * totalPoints) / 2

      for (let i = 0; i <= totalLines; i++) {
        const points = []
        for (let j = 0; j <= totalPoints; j++) {
          points.push({ x: xStart + xGap * i, y: yStart + yGap * j, wave: { x: 0, y: 0 }, cursor: { x: 0, y: 0, vx: 0, vy: 0 } })
        }
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('class', styles.waveLine)
        svg.appendChild(path)
        state.paths.push(path)
        state.lines.push(points)
      }
    }

    const movePoints = (time) => {
      const { lines, mouse, noise } = state
      lines.forEach(points => {
        points.forEach(p => {
          const move = noise.perlin2((p.x + time * 0.015) * 0.002, (p.y + time * 0.006) * 0.0015) * 12
          p.wave.x = Math.cos(move) * 28
          p.wave.y = Math.sin(move) * 14

          const dx = p.x - mouse.sx, dy = p.y - mouse.sy
          const d = Math.hypot(dx, dy)
          const l = Math.max(175, mouse.vs)
          if (d < l) {
            const s = 1 - d / l
            const f = Math.cos(d * 0.001) * s
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065
          }
          p.cursor.vx += (0 - p.cursor.x) * 0.005
          p.cursor.vy += (0 - p.cursor.y) * 0.005
          p.cursor.vx *= 0.925; p.cursor.vy *= 0.925
          p.cursor.x += p.cursor.vx * 2; p.cursor.y += p.cursor.vy * 2
          p.cursor.x = Math.min(100, Math.max(-100, p.cursor.x))
          p.cursor.y = Math.min(100, Math.max(-100, p.cursor.y))
        })
      })
    }

    const moved = (point) => ({
      x: Math.round((point.x + point.wave.x + point.cursor.x) * 10) / 10,
      y: Math.round((point.y + point.wave.y + point.cursor.y) * 10) / 10,
    })

    const drawLines = () => {
      state.lines.forEach((points, li) => {
        let d = ''
        points.forEach((pt, pi) => {
          const p = moved(pt)
          d += pi === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`
        })
        state.paths[li]?.setAttribute('d', d)
      })
    }

    const onMouseMove = (e) => {
      const m = state.mouse
      m.x = e.clientX - state.bounding.left
      m.y = e.clientY - state.bounding.top + window.scrollY
      if (!m.set) { m.sx = m.x; m.sy = m.y; m.lx = m.x; m.ly = m.y; m.set = true }
    }

    let frame
    const tick = (time) => {
      if (state.paused) { frame = requestAnimationFrame(tick); return }
      const m = state.mouse
      m.sx += (m.x - m.sx) * 0.1; m.sy += (m.y - m.sy) * 0.1
      const dx = m.x - m.lx, dy = m.y - m.ly
      m.v = Math.hypot(dx, dy); m.vs += (m.v - m.vs) * 0.1; m.vs = Math.min(100, m.vs)
      m.lx = m.x; m.ly = m.y; m.a = Math.atan2(dy, dx)
      movePoints(time); drawLines()
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([e]) => { state.paused = !e.isIntersecting }, { threshold: 0 })

    setSize(); setLines()
    observer.observe(container)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', () => { setSize(); setLines() })
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.wavesContainer}>
      <svg ref={svgRef} className={styles.wavesSvg} />
    </div>
  )
}

export default function Hero({ isReady, onAction }) {
  const { t } = useLocale()
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const borderRef = useRef(null)

  useEffect(() => {
    if (!isReady) return
    registerGSAP()

    const content = contentRef.current
    const border = borderRef.current
    if (!content) return

    const chars = content.querySelectorAll(`.${styles.char}`)
    const subtitle = content.querySelector(`.${styles.subtitle}`)
    const ctas = content.querySelectorAll(`.${styles.btn}`)

    const tl = gsap.timeline()

    // Border wipe
    if (border) {
      tl.fromTo(border, { scaleY: 1 }, { scaleY: 0.02, y: -content.clientHeight, duration: 1, ease: 'expo.inOut' }, 0)
      tl.to(border, { scaleY: 1, y: 0, duration: 1, ease: 'expo.inOut' }, 1)
    }

    // Content clip reveal
    tl.fromTo(content,
      { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
      { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1, ease: 'expo.inOut' },
      0.8
    )

    // Chars fly in
    if (chars.length) {
      tl.fromTo(chars, { y: '-200%' }, { y: '0%', duration: 1.8, ease: 'expo.inOut', stagger: 0.025 }, 0.5)
    }

    // Subtitle + CTAs
    if (subtitle) {
      tl.from(subtitle, { y: 40, opacity: 0, duration: 1, ease: 'expo.out' }, 1.8)
    }
    if (ctas.length) {
      tl.from(ctas, { y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'expo.out' }, 2)
    }

    // Random char shuffle (like wodniack.dev)
    let shuffleFrame
    const directions = ['to-top', 'to-right', 'to-bottom', 'to-left']
    const shuffleTick = () => {
      if (Math.random() < 0.01 && chars.length) {
        const c = chars[Math.floor(Math.random() * chars.length)]
        const dir = directions[Math.floor(Math.random() * 4)]
        if (!c.dataset.animating) {
          c.dataset.animating = '1'
          // Animate out
          c.style.animation = `${dir} 0.6s cubic-bezier(0.86,0,0.07,1) forwards`
          setTimeout(() => {
            // Reset and animate back in
            c.style.animation = ''
            gsap.fromTo(c, { y: '100%' }, { y: '0%', duration: 0.6, ease: 'expo.out', onComplete: () => { delete c.dataset.animating } })
          }, 800)
        }
      }
      shuffleFrame = requestAnimationFrame(shuffleTick)
    }
    const startShuffle = setTimeout(() => { shuffleFrame = requestAnimationFrame(shuffleTick) }, 3000)

    // Parallax
    if (sectionRef.current) {
      const wavesEl = sectionRef.current.querySelector(`.${styles.wavesContainer}`)
      if (wavesEl) {
        gsap.to(wavesEl, {
          y: -100,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      }
    }

    return () => { cancelAnimationFrame(shuffleFrame); clearTimeout(startShuffle) }
  }, [isReady])

  const lines = [
    { key: 'hero.title.line1', accent: false },
    { key: 'hero.title.line2', accent: false },
    { key: 'hero.title.line3', accent: true },
  ]

  return (
    <section ref={sectionRef} className={styles.hero}>
      <WavesSVG />

      <div ref={contentRef} className={styles.content}>
        <h1 className={styles.title}>
          {lines.map((line, li) => (
            <span key={li} className={`${styles.titleLine} ${line.accent ? styles.titleAccent : ''}`}>
              {t(line.key).split('').map((c, ci) => (
                c === ' ' ? (
                  <span key={ci} className={styles.charSpace}>&nbsp;</span>
                ) : (
                  <span key={ci} className={styles.charWrap}>
                    <span className={styles.char} data-letter={c.toUpperCase()}>
                      {c}
                    </span>
                  </span>
                )
              ))}
            </span>
          ))}
        </h1>

        <p className={styles.subtitle}>{t('hero.subtitle')}</p>

        <div className={styles.ctas}>
          <button onClick={onAction} className={`${styles.btn} ${styles.btnPrimary}`} data-cursor-hover>
            {t('hero.cta.primary')}
          </button>
          <button onClick={onAction} className={`${styles.btn} ${styles.btnSecondary}`} data-cursor-hover>
            {t('hero.cta.secondary')}
          </button>
        </div>
      </div>

      <div ref={borderRef} className={styles.border} />
    </section>
  )
}
