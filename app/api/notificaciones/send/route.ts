import { NextResponse } from "next/server"
import { Pingram } from 'pingram'

export async function POST(request: Request) {
    const PINGRAM_API_KEY = process.env.PINGRAM_API_KEY || process.env.PINGRAM_CLIENT_SECRET

    console.log("Notificaciones: Iniciando proceso con SDK...")

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
            console.error("Notificaciones: Faltan credenciales en el servidor")
            return NextResponse.json(
                { message: "La API Key (PINGRAM_API_KEY) no está configurada en el servidor" },
                { status: 500 }
            )
        }

        // Inicializamos el SDK oficial
        // Nota: El SDK maneja internamente las firmas AWS y los endpoints correctos
        const pingram = new Pingram({
            apiKey: PINGRAM_API_KEY.trim(),
            baseUrl: 'https://api.pingram.io'
        })

        console.log("Notificaciones: Enviando vía SDK...")

        const result = await pingram.send({
            type: 'broadcast_notification', // Asegúrate de tener este ID en tu panel o usa 'broadcast'
            to: {
                id: 'oyente_global'
            },
            mobile_push: {
                title: title,
                message: message
            },
            web_push: {
                title: title,
                message: message,
                icon: 'https://www.radiovidamx.com/logo-radiovida.png',
                url: url || 'https://www.radiovidamx.com/'
            },
            inapp: {
                title: `${title}: ${message}`,
                url: url || 'https://www.radiovidamx.com/'
            }
        })

        console.log("Notificaciones: Éxito con el SDK")

        return NextResponse.json({
            success: true,
            message: "Notificación enviada correctamente",
            result
        })

    } catch (error: any) {
        console.error("Pingram SDK Error:", error)

        // Manejo específico de errores del SDK
        const errorMessage = error.message || "Error al procesar la notificación con el SDK"

        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        )
    }
}
