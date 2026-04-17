import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BU Support Analyser',
  description: 'AI-powered Kayako ticket analysis for BU Support',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
