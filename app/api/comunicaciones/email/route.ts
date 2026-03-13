import { NextResponse } from "next/server"
import { Pingram } from 'pingram'

export async function POST(request: Request) {
    const PINGRAM_API_KEY = process.env.PINGRAM_API_KEY || process.env.PINGRAM_CLIENT_SECRET

    try {
        const body = await request.json()
        const { email, subject, html } = body

        if (!email || !subject || !html) {
            return NextResponse.json(
                { message: "Email, asunto y contenido son requeridos" },
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
            apiKey: PINGRAM_API_KEY.trim()
        })

        const result = await pingram.send({
            type: 'broadcast_notification',
            to: {
                id: email,
                email: email
            },
            email: {
                subject: subject,
                html: html
            }
        })

        return NextResponse.json({
            success: true,
            message: "Email enviado correctamente",
            result
        })

    } catch (error: any) {
        console.error("Pingram Email Error:", error)
        return NextResponse.json(
            { message: error.message || "Error al enviar Email" },
            { status: 500 }
        )
    }
}
