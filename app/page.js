'use client'

import { useEffect, useState, useCallback } from 'react'
import Lenis from 'lenis'
import { LocaleProvider } from '../context/LocaleContext'
import Preloader from '../components/Preloader'
import CustomCursor from '../components/CustomCursor'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import BinarySeparator from '../components/BinarySeparator'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Community from '../components/Community'
import Footer from '../components/Footer'
import AlphaModal from '../components/AlphaModal'

export default function Home() {
  const [isReady, setIsReady] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const onPreloaderComplete = useCallback(() => {
    setIsReady(true)
  }, [])

  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })

    window.lenis = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      delete window.lenis
    }
  }, [])

  return (
    <LocaleProvider>
      <Preloader onComplete={onPreloaderComplete} />
      <CustomCursor />

      <Navbar isReady={isReady} onAction={openModal} />

      <main id="main-content">
        <Hero isReady={isReady} onAction={openModal} />
        <BinarySeparator strings={['GMV', 'Bot', '.ai', 'Agent', 'Revenue']} />
        <Features />
        <BinarySeparator strings={['Deploy', 'Scale', 'Earn']} />
        <HowItWorks />
        <BinarySeparator strings={['One', 'Person', 'Company']} />
        <Community />
        <Footer onAction={openModal} />
      </main>

      <AlphaModal open={modalOpen} onClose={closeModal} />
    </LocaleProvider>
  )
}
