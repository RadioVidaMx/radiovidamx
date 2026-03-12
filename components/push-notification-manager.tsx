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
      // Para Radio Vida, usamos un ID global para que todos los oyentes
      // reciban las mismas notificaciones de "Broadcast" (Aviso General)
      const userId = "oyente_global"

      console.log("Notificaciones: Inicializando para:", userId)

      // Inicializar el cliente
      const notificationClient = new NotificationAPIClient({
        clientId: CLIENT_ID,
        userId: userId,
      })

      // IMPORTANTE: Identificar al usuario para preparar el enlace de tokens
      await notificationClient.identify({
        id: userId
      })

      // Pedir permiso y suscribir
      console.log("Notificaciones: Solicitando permisos...")
      notificationClient.askForWebPushPermission()
      
      // Verificamos el estado después de un breve delay
      setTimeout(() => {
        const currentPermission = Notification.permission as any
        setStatus(currentPermission)
        if (currentPermission === "granted") {
          toast.success("¡Ya estás suscrito a las notificaciones!")
        }
      }, 2000)

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
