"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
    ArrowLeft,
    Save,
    Calendar,
    MapPin,
    Clock,
    Type,
    AlignLeft,
    Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function NewEventPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        featured: false,
        image_url: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from("events")
                .insert([formData])

            if (error) throw error

            router.push("/admin/dashboard/eventos")
            router.refresh()
        } catch (error: any) {
            alert("Error al guardar el evento: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/dashboard/eventos">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Nuevo Evento</h1>
                    <p className="text-muted-foreground">Crea un nuevo evento para la audiencia.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="flex items-center gap-2">
                            <Type className="w-4 h-4" /> Título del Evento
                        </Label>
                        <Input
                            id="title"
                            placeholder="Ej: Concierto de Alabanza"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Date */}
                        <div className="space-y-2">
                            <Label htmlFor="date" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Fecha
                            </Label>
                            <Input
                                id="date"
                                placeholder="Ej: 15 de Marzo, 2026"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        {/* Time */}
                        <div className="space-y-2">
                            <Label htmlFor="time" className="flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Hora
                            </Label>
                            <Input
                                id="time"
                                placeholder="Ej: 7:00 PM"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Ubicación
                        </Label>
                        <Input
                            id="location"
                            placeholder="Ej: Auditorio Central"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="flex items-center gap-2">
                            <AlignLeft className="w-4 h-4" /> Descripción
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Escribe los detalles del evento..."
                            className="min-h-[120px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    {/* Image URL (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="image_url" className="flex items-center gap-2">
                            Foto del Evento (Link opcional)
                        </Label>
                        <Input
                            id="image_url"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        />
                    </div>

                    {/* Featured */}
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
                        />
                        <Label
                            htmlFor="featured"
                            className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1.5"
                        >
                            <Star className={`w-4 h-4 ${formData.featured ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                            Destacar este evento (Aparecerá con estrella en la lista)
                        </Label>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link href="/admin/dashboard/eventos">
                        <Button variant="ghost" type="button">Cancelar</Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Evento
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
