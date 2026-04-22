import type { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

export const metadata: Metadata = {
  title: 'BU Support Analyser',
  description: 'AI-powered Kayako ticket analysis for BU Support',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="#3b82f6" height={3} showSpinner={false} />
        {children}
      </body>
    </html>
  )
}
