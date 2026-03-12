"use client"

import { useEffect, useState } from "react"
import { Bell, BellOff, Loader2 } from "lucide-react"
import notificationapi from "notificationapi-js-client-sdk"
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
      // Inicializar el cliente de NotificationAPI
      notificationapi.init({
        clientId: CLIENT_ID,
        userId: "all_users", // Usamos un ID genérico para visitantes anónimos
      })

      // Pedir permiso y suscribir
      await notificationapi.askForWebPushPermission()
      
      setStatus(Notification.permission as any)
      
      if (Notification.permission === "granted") {
        toast.success("¡Notificaciones activadas correctamente!")
      } else {
        toast.error("No se concedieron permisos para notificaciones")
      }
    } catch (error) {
      console.error("Error al activar notificaciones:", error)
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
