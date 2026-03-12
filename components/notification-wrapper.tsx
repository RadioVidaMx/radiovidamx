"use client"

import { NotificationAPIProvider } from "@notificationapi/react"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export function NotificationWrapper({ children }: Props) {
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
