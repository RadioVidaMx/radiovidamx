"use client"

import { useState } from "react"
import { Bell, Send, Loader2, Type, AlignLeft, Link as LinkIcon, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function NotificationsPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        url: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        try {
            const response = await fetch("/api/notificaciones/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Error al enviar la notificación")
            }

            setResult({ success: true, message: "Notificación enviada con éxito a todos los dispositivos." })
            setFormData({ title: "", message: "", url: "" })
            toast.success("¡Notificación enviada!")
        } catch (error: any) {
            console.error("Error sending notification:", error)
            setResult({ success: false, message: error.message })
            toast.error("Error al enviar la notificación")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Bell className="w-6 h-6 text-primary" /> Enviar Notificación Push
                </h1>
                <p className="text-muted-foreground mt-1">
                    Este mensaje llegará instantáneamente a los dispositivos Android e iOS de tus oyentes.
                </p>
            </div>

            <div className="grid gap-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2">
                                <Type className="w-4 h-4 text-primary" /> Título
                            </Label>
                            <Input
                                id="title"
                                placeholder="Ej: ¡Estamos Al Aire! 🎙️"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Breve y llamativo</p>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <Label htmlFor="message" className="flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-primary" /> Mensaje
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Escribe el contenido de la notificación..."
                                className="min-h-[100px]"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>

                        {/* URL (Optional) */}
                        <div className="space-y-2">
                            <Label htmlFor="url" className="flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-primary" /> Enlace de acción (Opcional)
                            </Label>
                            <Input
                                id="url"
                                placeholder="https://radiovidamx.com/evento/..."
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">URL a la que abrir cuando el usuario toque la notificación.</p>
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
                                    Enviar Notificación
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Status Messages */}
                {result && (
                    <div className={`p-4 rounded-xl border flex gap-3 ${
                        result.success 
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

                {/* Info Card */}
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                    <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
                        💡 Consejos para mejores notificaciones
                    </h3>
                    <ul className="text-sm text-foreground/70 space-y-2 list-disc pl-5">
                        <li>Usa **emojis** para captar la atención.</li>
                        <li>Mantén el mensaje **corto y directo** (menos de 150 caracteres es ideal).</li>
                        <li>No envíes demasiadas notificaciones seguidas para evitar que los usuarios las desactiven.</li>
                        <li>Asegúrate de que el enlace de acción sea válido y comience con **https://**.</li>
                    </ul>
                </div>
            </div>
            {/* Espaciador para el reproductor */}
            <div className="h-32" />
        </div>
    )
}
