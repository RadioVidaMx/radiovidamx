"use client"

import { NotificationLauncher, NotificationPopup } from "@notificationapi/react"
import "@notificationapi/react/dist/styles.css"

export function PushNotificationManager() {
  return (
    <div className="fixed bottom-32 right-6 z-[9999]">
      <NotificationLauncher />
      <NotificationPopup 
        popupPosition="topLeft"
      />
    </div>
  )
}
