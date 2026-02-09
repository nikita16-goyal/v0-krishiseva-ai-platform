import React from "react"
import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'

import './globals.css'

const _dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const _playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Krishiseva - AI-Powered Agricultural Intelligence',
  description: 'Analyze soil parameters, weather data, and get AI-powered crop recommendations for maximum yield.',
}

export const viewport: Viewport = {
  themeColor: '#1a5c2a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
