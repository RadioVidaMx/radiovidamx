import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });
const _inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Radio Vida - Música y Palabra que Transforma',
  description: 'Estación de radio cristiana 24/7 con música de adoración, prédicas inspiradoras y programas que edifican tu fe.',
  keywords: 'radio cristiana, música cristiana, adoración, palabra de Dios, fe',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  generator: 'v0.app'
}

import { PlayerProvider } from "@/contexts/player-context"

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${_playfair.variable} ${_inter.variable} font-sans antialiased`}>
        <PlayerProvider>
          {children}
        </PlayerProvider>
        <Analytics />
      </body>
    </html>
  )
}
