"use client"

import { NotificationAPIProvider } from "@notificationapi/react"
import { ReactNode, useEffect, useState } from "react"

interface Props {
  children: ReactNode
}

export function NotificationWrapper({ children }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Si no ha montado (SSR), solo renderizamos los hijos sin el provider
  // Esto evita que la librería intente acceder a localStorage durante el build
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NotificationAPIProvider
      clientId="0l1eqh9ut8ke6htt9bn296b028"
      userId="oyente_global"
      customServiceWorkerPath="/notificationapi-service-worker.js"
      webPushOptInMessage="AUTOMATIC"
    >
      {children}
    </NotificationAPIProvider>
  )
}
