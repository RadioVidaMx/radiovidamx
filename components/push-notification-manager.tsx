"use client"

import { NotificationLauncher, NotificationPopup } from "@notificationapi/react"
import "@notificationapi/react/dist/styles.css"

export function PushNotificationManager() {
  return (
    <div className="fixed bottom-24 right-6 z-50">
      <NotificationLauncher />
      <NotificationPopup 
        popupPosition="topLeft"
      />
    </div>
  )
}
