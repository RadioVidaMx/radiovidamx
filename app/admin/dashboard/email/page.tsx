"use client"

import { useState } from "react"
import { Mail, Send, Loader2, User, Type, AlignLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function EmailPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
    const [formData, setFormData] = useState({
        email: "",
        subject: "",
        html: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        try {
            const response = await fetch("/api/comunicaciones/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Error al enviar el email")
            }

            setResult({ success: true, message: "Email enviado con éxito." })
            setFormData({ email: "", subject: "", html: "" })
            toast.success("¡Email enviado!")
        } catch (error: any) {
            console.error("Error sending email:", error)
            setResult({ success: false, message: error.message })
            toast.error("Error al enviar el email")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Mail className="w-6 h-6 text-primary" /> Enviar Correo Electrónico
                </h1>
                <p className="text-muted-foreground mt-1">
                    Redacta y envía un correo personalizado a través de Pingram.
                </p>
            </div>

            <div className="grid gap-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
                        {/* Recipient */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" /> Destinatario
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="flex items-center gap-2">
                                <Type className="w-4 h-4 text-primary" /> Asunto
                            </Label>
                            <Input
                                id="subject"
                                placeholder="Ej: Tu Palabra de Hoy 📖"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <Label htmlFor="html" className="flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-primary" /> Contenido (HTML)
                            </Label>
                            <Textarea
                                id="html"
                                placeholder="Escribe el contenido en formato HTML o texto plano..."
                                className="min-h-[200px] font-mono text-sm"
                                value={formData.html}
                                onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 rounded-xl shadow-lg transition-all"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Enviar Email
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Status Messages */}
                {result && (
                    <div className={`p-4 rounded-xl border flex gap-3 ${result.success
                            ? "bg-green-500/10 border-green-500/50 text-green-700"
                            : "bg-red-500/10 border-red-500/50 text-red-700"
                        }`}>
                        {result.success ? (
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 shrink-0" />
                        )}
                        <div>
                            <p className="font-bold text-sm">{result.success ? "¡Éxito!" : "Error en el envío"}</p>
                            <p className="text-sm opacity-90">{result.message}</p>
                        </div>
                    </div>
                )}
            </div>
            {/* Espaciador para el reproductor */}
            <div className="h-32" />
        </div>
    )
}
