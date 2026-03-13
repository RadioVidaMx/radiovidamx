"use client"

import { useState } from "react"
import { PhoneCall, Phone, Play, Loader2, AlignLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function AutomatedCallsPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string; raw?: any } | null>(null)
    const [showDebug, setShowDebug] = useState(false)
    const [formData, setFormData] = useState({
        phone: "",
        email: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validación básica de formato E.164
        if (!formData.phone.startsWith('+')) {
            toast.error("El número debe incluir el código de país y empezar con +")
            return
        }

        setLoading(true)
        setResult(null)

        try {
            const response = await fetch("/api/comunicaciones/llamada", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                const errorMsg = data.result?.message || data.message || "Error al iniciar la llamada"
                setResult({ success: false, message: errorMsg, raw: data })
                throw new Error(errorMsg)
            }

            setResult({
                success: true,
                message: "Solicitud enviada a Pingram correctamente.",
                raw: data
            })
            setFormData({ ...formData, message: "" })
            toast.success("¡Llamada iniciada!")
        } catch (error: any) {
            console.error("Error starting call:", error)
            toast.error(error.message || "Error al iniciar la llamada")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <PhoneCall className="w-6 h-6 text-primary" /> Llamada Automatizada (TTS)
                </h1>
                <p className="text-muted-foreground mt-1">
                    Realiza una llamada de voz automatizada que leerá tu mensaje al oyente.
                </p>
            </div>

            <div className="grid gap-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" /> Número de Teléfono
                            </Label>
                            <Input
                                id="phone"
                                placeholder="Ej: +526623583562"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Formato: +[código país][número]</p>
                        </div>

                        {/* Email (Optional) */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-primary" /> Email del Oyente (Opcional)
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ej: oyente@correo.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Identificador sugerido por Pingram/Supabase</p>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <Label htmlFor="message" className="flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-primary" /> Mensaje de Voz
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Escribe el mensaje que será leído por la voz sintética..."
                                className="min-h-[120px]"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                maxLength={500}
                            />
                            <div className="flex justify-end">
                                <span className="text-[10px] text-muted-foreground">{formData.message.length}/500 caracteres</span>
                            </div>
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
                                    Llamando...
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5 mr-2" />
                                    Iniciar Llamada
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Status Messages */}
                {result && (
                    <div className="space-y-4">
                        <div className={`p-4 rounded-xl border flex gap-3 ${result.success
                            ? "bg-green-500/10 border-green-500/50 text-green-700"
                            : "bg-red-500/10 border-red-500/50 text-red-700"
                            }`}>
                            {result.success ? (
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 shrink-0" />
                            )}
                            <div className="flex-1">
                                <p className="font-bold text-sm">{result.success ? "¡Solicitud aceptada!" : "Error en la llamada"}</p>
                                <p className="text-sm opacity-90">{result.message}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDebug(!showDebug)}
                                className="text-xs h-7 px-2"
                            >
                                {showDebug ? "Ocultar detalles" : "Ver detalles"}
                            </Button>
                        </div>

                        {showDebug && result.raw && (
                            <div className="p-4 bg-slate-900 rounded-xl overflow-hidden shadow-inner">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Respuesta de la API</p>
                                    <span className="text-[10px] text-slate-500 font-mono">JSON Format</span>
                                </div>
                                <pre className="text-[11px] font-mono text-green-400 overflow-auto max-h-[250px] custom-scrollbar">
                                    {JSON.stringify(result.raw, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {/* Info Card */}
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                    <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
                        🎙️ ¿Cómo funciona?
                    </h3>
                    <p className="text-sm text-foreground/70">
                        El sistema realizará una llamada telefónica al número indicado. Al contestar, una voz automatizada (Text-to-Speech) leerá el mensaje que has redactado. Es ideal para avisos urgentes o códigos de verificación.
                    </p>
                </div>
            </div>
            {/* Espaciador para el reproductor */}
            <div className="h-32" />
        </div>
    )
}
