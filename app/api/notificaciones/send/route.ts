import { NextResponse } from "next/server"

// NOTA: Para que esto funcione, debes añadir estas variables a tu archivo .env.local
const PINGRAM_CLIENT_ID = process.env.PINGRAM_CLIENT_ID
const PINGRAM_CLIENT_SECRET = process.env.PINGRAM_CLIENT_SECRET

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, message, url } = body

        if (!title || !message) {
            return NextResponse.json(
                { message: "Título y mensaje son requeridos" },
                { status: 400 }
            )
        }

        if (!PINGRAM_CLIENT_ID || !PINGRAM_CLIENT_SECRET) {
            return NextResponse.json(
                { message: "Las credenciales de Pingram (Client ID/Secret) no están configuradas en el servidor" },
                { status: 500 }
            )
        }

        // Configuración de la petición a Pingram.io (NotificationAPI)
        // Usamos Basic Auth con Client ID y Secret
        const authHeader = Buffer.from(`${PINGRAM_CLIENT_ID}:${PINGRAM_CLIENT_SECRET}`).toString('base64')

        // El endpoint estándar de NotificationAPI para enviar notificaciones
        // Si tienes un ID de notificación específico en Pingram, puedes usarlo. 
        // Aquí usamos una configuración genérica para enviar a todos los suscritos.
        const response = await fetch(`https://api.notificationapi.com/v1/${PINGRAM_CLIENT_ID}/sender`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${authHeader}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                notificationId: "notificacion_general", // Este ID debe existir o configurarse en Pingram
                user: {
                    id: "all_users", // O la lógica que Pingram use para broadcast
                },
                mergeVariables: {
                    title: title,
                    message: message,
                    url: url || "https://radiovidamx.com"
                }
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("Pingram API Error:", data)
            return NextResponse.json(
                { message: data.message || "Error al comunicarse con Pingram" },
                { status: response.status }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Notificación enviada correctamente",
            data
        })

    } catch (error: any) {
        console.error("Internal Server Error (Notifications):", error)
        return NextResponse.json(
            { message: "Error interno del servidor al procesar la notificación" },
            { status: 500 }
        )
    }
}
