import { NextResponse } from "next/server"
import { Pingram } from 'pingram'

export async function POST(request: Request) {
    const PINGRAM_API_KEY = process.env.PINGRAM_API_KEY || process.env.PINGRAM_CLIENT_SECRET

    try {
        const body = await request.json()
        const { phone, message, email } = body

        if (!phone || !message) {
            return NextResponse.json(
                { message: "Teléfono y mensaje son requeridos" },
                { status: 400 }
            )
        }

        if (!PINGRAM_API_KEY) {
            return NextResponse.json(
                { message: "API Key de Pingram no configurada" },
                { status: 500 }
            )
        }

        const pingram = new Pingram({
            apiKey: PINGRAM_API_KEY.trim(),
            baseUrl: 'https://api.pingram.io'
        })

        const result = await pingram.send({
            type: 'broadcast_notification',
            to: {
                id: phone,
                number: phone,
                ...(email ? { email } : {})
            },
            call: {
                message: message,
                language: 'es',
                voiceId: 'lucia-mexican-accent'
            } as any,
            // Forzamos el canal CALL (Llamada)
            forceChannels: ['CALL' as any]
        })

        console.log("Pingram Call Result:", JSON.stringify(result, null, 2))

        return NextResponse.json({
            success: true,
            message: "Llamada iniciada correctamente",
            result
        })

    } catch (error: any) {
        console.error("Pingram Call Error:", error)
        return NextResponse.json(
            { message: error.message || "Error al iniciar llamada" },
            { status: 500 }
        )
    }
}
