'use client'

import { useEffect, useRef } from 'react'
import styles from './BinarySeparator.module.css'

function textToBinary(strings) {
  return strings.map(s =>
    s.split('').map(c => c.charCodeAt(0).toString(2)).join(' ')
  )
}

export default function BinarySeparator({ strings = ['GMV', 'Bot', '.ai'] }) {
  const ref = useRef(null)

  useEffect(() => {
    const chars = ref.current?.querySelectorAll(`.${styles.char}`)
    if (!chars?.length) return

    let paused = false
    let frame

    const observer = new IntersectionObserver(([entry]) => {
      paused = !entry.isIntersecting
    }, { threshold: 0 })

    observer.observe(ref.current)

    const tick = () => {
      if (!paused) {
        chars.forEach(ch => {
          if (ch.dataset.type === 'blank' || Math.random() > 0.08) return
          const val = Math.random() > 0.5 ? '1' : '0'
          ch.dataset.value = val
        })
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  const binaries = textToBinary(strings)

  return (
    <div ref={ref} className={styles.separator}>
      <span className={styles.triangle} />
      <span className={styles.binaries}>
        {binaries.map((bin, i) => (
          <span key={i} className={styles.segment}>
            <span className={styles.code}>
              {bin.split('').map((c, j) => (
                <span
                  key={j}
                  className={styles.char}
                  data-type={c === ' ' ? 'blank' : 'bit'}
                  data-value={c}
                >
                  {c}
                </span>
              ))}
            </span>
            {i < binaries.length - 1 && (
              <span className={styles.stripes}>{'//////////'.repeat(3)}</span>
            )}
          </span>
        ))}
      </span>
      <span className={styles.triangle} />
    </div>
  )
}
