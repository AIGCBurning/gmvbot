'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { useLocale } from '../context/LocaleContext'
import styles from './AlphaModal.module.css'

export default function AlphaModal({ open, onClose }) {
  const { t } = useLocale()
  const overlayRef = useRef(null)
  const modalRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [form, setForm] = useState({
    name: '',
    email: '',
    teamSize: '',
    industry: '',
    aiLevel: '',
    willPay: '',
    usedVirtualEmployee: '',
    message: '',
  })

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  // GSAP enter/exit
  useEffect(() => {
    const overlay = overlayRef.current
    const modal = modalRef.current
    if (!overlay || !modal) return

    if (open) {
      gsap.set(overlay, { display: 'flex' })
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.fromTo(modal, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out', delay: 0.05 })
    } else {
      gsap.to(modal, { scale: 0.95, opacity: 0, duration: 0.2, ease: 'power2.in' })
      gsap.to(overlay, { opacity: 0, duration: 0.25, ease: 'power2.in', delay: 0.05, onComplete: () => gsap.set(overlay, { display: 'none' }) })
    }
  }, [open])

  // ESC to close
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Reset form + scroll when modal opens, lock body scroll
  useEffect(() => {
    if (open) {
      setStatus('idle')
      setForm({ name: '', email: '', teamSize: '', industry: '', aiLevel: '', willPay: '', usedVirtualEmployee: '', message: '' })
      // Reset modal scroll to top
      if (modalRef.current) modalRef.current.scrollTop = 0
      // Pause Lenis & lock body scroll so fixed overlay centers correctly
      document.body.style.overflow = 'hidden'
      window.lenis?.stop()
    } else {
      document.body.style.overflow = ''
      window.lenis?.start()
    }
    return () => {
      document.body.style.overflow = ''
      window.lenis?.start()
    }
  }, [open])

  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) onClose()
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/alpha-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('fail')
      setStatus('success')
      setTimeout(() => onClose(), 2000)
    } catch {
      setStatus('error')
    }
  }

  const teamSizeOptions = [
    { value: '1', label: t('alpha.teamSize.1') },
    { value: '2-5', label: t('alpha.teamSize.2-5') },
    { value: '6-20', label: t('alpha.teamSize.6-20') },
    { value: '20+', label: t('alpha.teamSize.20+') },
  ]

  const industryOptions = [
    { value: 'tech', label: t('alpha.industry.tech') },
    { value: 'ecommerce', label: t('alpha.industry.ecommerce') },
    { value: 'finance', label: t('alpha.industry.finance') },
    { value: 'education', label: t('alpha.industry.education') },
    { value: 'healthcare', label: t('alpha.industry.healthcare') },
    { value: 'other', label: t('alpha.industry.other') },
  ]

  const aiLevelOptions = [
    { value: 'beginner', label: t('alpha.aiLevel.beginner') },
    { value: 'familiar', label: t('alpha.aiLevel.familiar') },
    { value: 'proficient', label: t('alpha.aiLevel.proficient') },
    { value: 'expert', label: t('alpha.aiLevel.expert') },
  ]

  const willPayOptions = [
    { value: 'yes', label: t('alpha.willPay.yes') },
    { value: 'no', label: t('alpha.willPay.no') },
    { value: 'maybe', label: t('alpha.willPay.maybe') },
  ]

  const usedVEOptions = [
    { value: 'yes', label: t('alpha.usedVE.yes') },
    { value: 'no', label: t('alpha.usedVE.no') },
  ]

  const allFilled = form.name && form.email && form.teamSize && form.industry && form.aiLevel && form.willPay && form.usedVirtualEmployee

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={handleOverlayClick} style={{ display: 'none' }}>
      <div ref={modalRef} className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">&times;</button>

        <h2 className={styles.title}>
          {t('alpha.title.before')}
          <span className={styles.titleAlpha}>{t('alpha.title.alpha')}</span>
          {t('alpha.title.after')}
        </h2>

        {status === 'success' ? (
          <p className={styles.success}>{t('alpha.success')}</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Name */}
            <div className={styles.field}>
              <label className={styles.label}>{t('alpha.field.name')}</label>
              <input className={styles.input} type="text" required value={form.name} onChange={e => set('name', e.target.value)} placeholder={t('alpha.field.name.placeholder')} />
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label}>{t('alpha.field.email')}</label>
              <input className={styles.input} type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder={t('alpha.field.email.placeholder')} />
            </div>

            {/* Team Size */}
            <div className={styles.field}>
              <label className={styles.label}>{t('alpha.field.teamSize')}</label>
              <select className={styles.select} required value={form.teamSize} onChange={e => set('teamSize', e.target.value)}>
                <option value="" disabled>{t('alpha.field.teamSize.placeholder')}</option>
                {teamSizeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Industry */}
            <div className={styles.field}>
              <label className={styles.label}>{t('alpha.field.industry')}</label>
              <select className={styles.select} required value={form.industry} onChange={e => set('industry', e.target.value)}>
                <option value="" disabled>{t('alpha.field.industry.placeholder')}</option>
                {industryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* AI Level */}
            <div className={styles.field}>
              <label className={styles.label}>{t('alpha.field.aiLevel')}</label>
              <select className={styles.select} required value={form.aiLevel} onChange={e => set('aiLevel', e.target.value)}>
                <option value="" disabled>{t('alpha.field.aiLevel.placeholder')}</option>
                {aiLevelOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Will Pay */}
            <div className={styles.field}>
              <label className={styles.label}>{t('alpha.field.willPay')}</label>
              <div className={styles.radioGroup}>
                {willPayOptions.map(o => (
                  <label key={o.value} className={styles.radioLabel}>
                    <input type="radio" name="willPay" value={o.value} checked={form.willPay === o.value} onChange={e => set('willPay', e.target.value)} required />
                    {o.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Used Virtual Employee */}
            <div className={styles.field}>
              <label className={styles.label}>{t('alpha.field.usedVirtualEmployee')}</label>
              <div className={styles.radioGroup}>
                {usedVEOptions.map(o => (
                  <label key={o.value} className={styles.radioLabel}>
                    <input type="radio" name="usedVE" value={o.value} checked={form.usedVirtualEmployee === o.value} onChange={e => set('usedVirtualEmployee', e.target.value)} required />
                    {o.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className={styles.field}>
              <label className={styles.label}>{t('alpha.field.message')}</label>
              <textarea className={styles.textarea} maxLength={500} rows={4} value={form.message} onChange={e => set('message', e.target.value)} placeholder={t('alpha.field.message.placeholder')} />
              <span className={styles.charCount}>{form.message.length}/500</span>
            </div>

            {status === 'error' && <p className={styles.error}>{t('alpha.error')}</p>}

            <button className={styles.submitBtn} type="submit" disabled={status === 'submitting' || !allFilled}>
              {status === 'submitting' ? t('alpha.submitting') : t('alpha.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
