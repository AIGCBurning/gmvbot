import { Inter_Tight } from 'next/font/google'
import './globals.css'

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
})

export const metadata = {
  title: 'GMVBot.ai — AI Agent Platform for One-Person Companies',
  description:
    'Build, deploy, and monetize AI agent teams. Turn your one-person company into a revenue machine with GMVBot.',
  keywords: ['AI agents', 'OPC', 'one-person company', 'GMV', 'automation', 'revenue'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={interTight.variable}>
      <body style={{ fontFamily: 'var(--font-inter-tight), Inter, system-ui, sans-serif' }}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  )
}
