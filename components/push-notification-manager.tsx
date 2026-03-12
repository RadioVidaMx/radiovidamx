"use client"

import { useEffect, useState } from "react"
import { Bell, BellOff, Loader2 } from "lucide-react"
import NotificationAPIClient from "notificationapi-js-client-sdk"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function PushNotificationManager() {
  const [status, setStatus] = useState<"default" | "granted" | "denied">("default")
  const [isLoading, setIsLoading] = useState(false)

  const CLIENT_ID = "0l1eqh9ut8ke6htt9bn296b028"

  useEffect(() => {
    if ("Notification" in window) {
      setStatus(Notification.permission as any)
    }
  }, [])

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      toast.error("Tu navegador no soporta notificaciones push")
      return
    }

    setIsLoading(true)
    try {
      const userId = "oyente_global"

      console.log("Notificaciones: Inicializando para:", userId)

      // Inicializar el cliente con la ruta explícita del service worker
      const notificationClient = new NotificationAPIClient({
        clientId: CLIENT_ID,
        userId: userId,
        customServiceWorkerPath: "/notificationapi-service-worker.js"
      })

      // IMPORTANTE: Identificar al usuario
      await notificationClient.identify({
        id: userId
      })

      console.log("Notificaciones: Usuario identificado. Solicitando permisos...")

      // Pedir permiso y suscribir
      notificationClient.askForWebPushPermission()
      
      // Verificamos el estado después de un delay
      setTimeout(() => {
        const currentPermission = Notification.permission as any
        setStatus(currentPermission)
        if (currentPermission === "granted") {
          console.log("Notificaciones: ¡Permiso concedido y token registrado!")
          toast.success("¡Ya estás suscrito! Ahora recibirás nuestras alertas.")
        } else if (currentPermission === "denied") {
          toast.error("Has bloqueado las notificaciones. Por favor, actívalas en la configuración de tu navegador.")
        }
      }, 2500)

    } catch (error: any) {
      console.error("Error detallado al activar notificaciones:", error)
      toast.error("Hubo un problema al activar las notificaciones")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "granted") return null // No mostrar nada si ya están activas

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-bounce-slow">
      <Button
        onClick={enableNotifications}
        disabled={isLoading}
        className="rounded-full shadow-2xl h-14 px-6 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground group transition-all duration-300 hover:scale-105"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Bell className="h-5 w-5 group-hover:rotate-12 transition-transform" />
        )}
        <span className="font-semibold text-sm">
          {status === "denied" ? "Reactivar Alertas" : "Activar Notificaciones"}
        </span>
      </Button>
    </div>
  )
}
