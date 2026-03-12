import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const PINGRAM_CLIENT_ID = process.env.PINGRAM_CLIENT_ID
    const PINGRAM_CLIENT_SECRET = process.env.PINGRAM_CLIENT_SECRET

    console.log("Notificaciones: Iniciando proceso de envío...")

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
            console.error("Notificaciones: Faltan credenciales en el servidor")
            return NextResponse.json(
                { message: "Las credenciales (ID o Secret) no están configuradas en el servidor" },
                { status: 500 }
            )
        }

        // Generamos el Header de Basic Auth
        const authHeader = Buffer.from(`${PINGRAM_CLIENT_ID}:${PINGRAM_CLIENT_SECRET}`).toString('base64')

        // Endpoint oficial de NotificationAPI (motor de Pingram)
        const apiUrl = `https://api.notificationapi.com/v1/${PINGRAM_CLIENT_ID}/sender`

        console.log("Notificaciones: Enviando a API...")

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${authHeader}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                notificationId: "broadcast_notification",
                user: {
                    id: "all_users",
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
            console.error("Pingram API Response Error:", data)
            return NextResponse.json(
                { message: data.message || "Error al comunicarse con el servidor de notificaciones" },
                { status: response.status }
            )
        }

        console.log("Notificaciones: ¡Éxito!")
        return NextResponse.json({
            success: true,
            message: "Notificación enviada correctamente",
            data
        })

    } catch (error: any) {
        console.error("Internal Server Error (Notifications):", error)
        return NextResponse.json(
            { message: "Error interno en el servidor" },
            { status: 500 }
        )
    }
}
