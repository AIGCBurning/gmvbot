'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Preloader({ onComplete }) {
  const ref = useRef(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const el = ref.current
    const chars = el?.querySelectorAll('.preloader__char')
    if (!chars?.length) { onComplete?.(); return }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(el, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.5,
          ease: 'expo.inOut',
          onComplete,
        })
      },
    })

    // Faster: 0.6s in + 0.2s hold + 0.4s out + 0.5s wipe = 1.7s total
    tl.from(chars, {
      y: '110%',
      rotateX: 45,
      duration: 0.6,
      stagger: 0.03,
      ease: 'expo.out',
    })

    tl.to(chars, {
      y: '-110%',
      duration: 0.4,
      stagger: 0.015,
      ease: 'expo.in',
    }, '+=0.2')
  }, [onComplete])

  const parts = [
    { text: 'GMV', color: 'var(--text-primary)' },
    { text: 'Bot', color: 'var(--accent-cyan)' },
  ]

  return (
    <div ref={ref} className="preloader">
      <div className="preloader__text">
        {parts.map((part, pi) =>
          part.text.split('').map((c, ci) => (
            <span
              key={`${pi}-${ci}`}
              className="preloader__char"
              style={{ display: 'inline-block', color: part.color }}
            >
              {c}
            </span>
          ))
        )}
      </div>
    </div>
  )
}
