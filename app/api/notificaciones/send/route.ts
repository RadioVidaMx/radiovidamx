import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const PINGRAM_API_KEY = process.env.PINGRAM_API_KEY
    console.log("Notificaciones: Verificando PINGRAM_API_KEY...", PINGRAM_API_KEY ? "Detectada ✅" : "No detectada ❌")
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
                { message: "La API Key de Pingram no está configurada en el servidor (asegúrate de reiniciar el servidor dev)" },
                { status: 500 }
            )
        }

        // Usamos el endpoint y formato de la nueva API de Pingram.io
        // Autenticación por Bearer Token con la Secret Key
        const response = await fetch("https://api.pingram.io/v1/send", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${PINGRAM_API_KEY.trim()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "broadcast", // O el ID de notificación que tengas en el panel
                to: {
                    id: "all_users", 
                },
                mobile_push: {
                    title: title,
                    message: message
                },
                web_push: {
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
