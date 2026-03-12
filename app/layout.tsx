import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });
const _inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Radio Vida Mx - La estación que da Vida',
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
import { NotificationAPIProvider } from "@notificationapi/react"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${_playfair.variable} ${_inter.variable} font-sans antialiased`}>
        <NotificationAPIProvider
          clientId="0l1eqh9ut8ke6htt9bn296b028"
          userId="oyente_global"
          customServiceWorkerPath="/notificationapi-service-worker.js"
          webPushOptInMessage="AUTOMATIC"
        >
          <PlayerProvider>
            {children}
            <RadioPlayer />
            <Toaster position="top-center" />
          </PlayerProvider>
        </NotificationAPIProvider>
        <Analytics />
      </body>
    </html>
  )
}
