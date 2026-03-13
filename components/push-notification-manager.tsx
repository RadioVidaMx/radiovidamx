"use client"

import { NotificationLauncher, NotificationPopup } from "@notificationapi/react"
import "@notificationapi/react/dist/assets/style.css"
import { useEffect, useState } from "react"

export function PushNotificationManager() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed bottom-36 right-6 z-40">
      <NotificationLauncher />
      <NotificationPopup
        popoverPosition={{
          anchorOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
      />
    </div>
  )
}
