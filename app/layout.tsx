import React from "react"
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });
const _inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const viewport: Viewport = {
  themeColor: '#E63946',
}

export const metadata: Metadata = {
  title: 'Radio Vida Mx - La estación que da Vida',
  description: 'Estación de radio cristiana 24/7 con música de adoración, prédicas inspiradoras y programas que edifican tu fe.',
  keywords: 'radio cristiana, música cristiana, adoración, palabra de Dios, fe',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Radio Vida Mx",
  },
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
import { PushNotificationManager } from "@/components/push-notification-manager"
import { NotificationWrapper } from "@/components/notification-wrapper"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${_playfair.variable} ${_inter.variable} font-sans antialiased`}>
        <NotificationWrapper>
          <PlayerProvider>
            {children}
            <RadioPlayer />
            <PushNotificationManager />
            <Toaster position="top-center" />
          </PlayerProvider>
        </NotificationWrapper>
        <Analytics />
      </body>
    </html>
  )
}
