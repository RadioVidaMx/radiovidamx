import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });
const _inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Radio Vida - La estación que da Vida',
  description: 'Estación de radio cristiana 24/7 con música de adoración, prédicas inspiradoras y programas que edifican tu fe.',
  keywords: 'radio cristiana, música cristiana, adoración, palabra de Dios, fe',
  icons: {
    icon: [
      {
        url: '/logo-radiovida.png',
      },
    ],
    apple: '/logo-radiovida.png',
  },
  generator: 'v0.app'
}

import { PlayerProvider } from "@/contexts/player-context"
import { RadioPlayer } from "@/components/radio-player"

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
          <RadioPlayer />
        </PlayerProvider>
        <Analytics />
      </body>
    </html>
  )
}
