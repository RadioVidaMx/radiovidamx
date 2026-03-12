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

        // El ID de cuenta extraído del token del usuario
        const PINGRAM_ACCOUNT_ID = "0l1eqh9ut8ke6htt9bn296b028"
        
        // Limpiamos la llave por si tiene espacios o el prefijo 'Bearer ' accidental
        const cleanKey = PINGRAM_API_KEY.replace(/Bearer\s+/i, '').trim()
        
        // Autenticación Basic obligatoria para el endpoint directo de NotificationAPI
        const authHeader = Buffer.from(`${PINGRAM_ACCOUNT_ID}:${cleanKey}`).toString('base64')

        // Usamos el endpoint de NotificationAPI que es el motor real de Pingram
        // Esto evita los problemas de enrutamiento y firmas AWS del dominio pingram.io
        const response = await fetch(`https://api.notificationapi.com/v1/${PINGRAM_ACCOUNT_ID}/sender`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${authHeader}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                notificationId: "broadcast_notification", // ID genérico
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
