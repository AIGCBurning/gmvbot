'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -100, my = -100
    let rx = -100, ry = -100
    let isHover = false

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      // Dot follows instantly
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
    }

    const tick = () => {
      // Ring follows with lerp
      rx += (mx - rx) * 0.15
      ry += (my - ry) * 0.15
      const size = isHover ? 64 : 40
      const offset = size / 2
      ring.style.transform = `translate3d(${rx - offset}px, ${ry - offset}px, 0)`
      ring.style.width = `${size}px`
      ring.style.height = `${size}px`
      requestAnimationFrame(tick)
    }

    const onEnter = () => {
      isHover = true
      ring.style.borderColor = 'var(--accent-purple)'
    }
    const onLeave = () => {
      isHover = false
      ring.style.borderColor = ''
    }

    const bindHover = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    window.addEventListener('mousemove', onMove)
    requestAnimationFrame(tick)
    bindHover()

    const observer = new MutationObserver(bindHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor cursor__dot" />
      <div ref={ringRef} className="cursor cursor__ring" />
    </>
  )
}
