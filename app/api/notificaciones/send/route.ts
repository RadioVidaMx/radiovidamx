import { NextResponse } from "next/server"

const PINGRAM_API_KEY = process.env.PINGRAM_API_KEY

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

        if (!PINGRAM_API_KEY) {
            return NextResponse.json(
                { message: "La API Key de Pingram no está configurada en el servidor" },
                { status: 500 }
            )
        }

        // El endpoint de NotificationAPI/Pingram para enviar notificaciones
        // Usamos Bearer Token con la Secret Key
        const response = await fetch("https://api.pingram.io/v1/send", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${PINGRAM_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "broadcast", // O un ID de notificación configurado en el panel
                to: {
                    id: "all_users", // Identificador para enviar a todos los suscritos
                },
                mobile_push: {
                    title: title,
                    message: message
                },
                web_push: {
                    title: title,
                    message: message,
                    url: url || "https://radiovidamx.com",
                    icon: "https://radiovidamx.com/logo-radiovida.png"
                },
                inapp: {
                    title: title,
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
