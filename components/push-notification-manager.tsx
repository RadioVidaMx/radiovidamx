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
      let userId = localStorage.getItem("radiovida_notification_userid")
      if (!userId) {
        userId = "user_" + Math.random().toString(36).substring(2, 15)
        localStorage.setItem("radiovida_notification_userid", userId)
      }

      console.log("Notificaciones: Inicializando para usuario:", userId)

      // Inicializar el cliente usando el constructor de la clase
      const notificationClient = new NotificationAPIClient({
        clientId: CLIENT_ID,
        userId: userId,
      })

      // Pedir permiso y suscribir
      console.log("Notificaciones: Solicitando permisos...")
      notificationClient.askForWebPushPermission()
      
      // El estado de permiso puede cambiar asíncronamente
      // Esperamos un poco o dejamos que el usuario vea el cambio nativo
      setTimeout(() => {
        const currentPermission = Notification.permission as any
        setStatus(currentPermission)
        if (currentPermission === "granted") {
          toast.success("¡Notificaciones activadas!")
        }
      }, 1000)

    } catch (error: any) {
      console.error("Error detallado al activar notificaciones:", error)
      
      // Mensaje más descriptivo
      let msg = "Hubo un problema al activar las notificaciones"
      if (error.message && error.message.includes("Service Worker")) {
        msg = "No se pudo registrar el Service Worker"
      } else if (location.protocol !== 'https:') {
        msg = "Las notificaciones requieren una conexión segura (HTTPS)"
      }
      
      toast.error(msg)
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
