"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
    ArrowLeft,
    Save,
    Calendar,
    MapPin,
    Clock,
    Type,
    AlignLeft,
    Star,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

export default function EditEventPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        featured: false,
        image_url: "",
        link: "",
        display_order: 0,
        city: "Hermosillo" as "Hermosillo" | "Obregón"
    })

    useEffect(() => {
        fetchEvent()
    }, [id])

    const fetchEvent = async () => {
        try {
            const { data, error } = await supabase
                .from("events")
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            if (data) {
                setFormData({
                    title: data.title,
                    date: data.date,
                    time: data.time,
                    location: data.location,
                    description: data.description,
                    featured: data.featured,
                    image_url: data.image_url || "",
                    link: data.link || "",
                    display_order: data.display_order || 0,
                    city: data.city || "Hermosillo"
                })
            }
        } catch (error: any) {
            alert("Error al cargar el evento: " + error.message)
            router.push("/admin/dashboard/eventos")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const { error } = await supabase
                .from("events")
                .update(formData)
                .eq("id", id)

            if (error) throw error

            router.push("/admin/dashboard/eventos")
            router.refresh()
        } catch (error: any) {
            alert("Error al actualizar el evento: " + error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
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
                    <h1 className="text-2xl font-bold text-foreground">Editar Evento</h1>
                    <p className="text-muted-foreground">Modifica los detalles del evento.</p>
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

                    {/* City Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="city" className="flex items-center gap-2">
                            Ciudad del Evento
                        </Label>
                        <Select
                            value={formData.city}
                            onValueChange={(val: any) => setFormData({ ...formData, city: val })}
                        >
                            <SelectTrigger id="city">
                                <SelectValue placeholder="Selecciona Ciudad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Hermosillo">Hermosillo</SelectItem>
                                <SelectItem value="Obregón">Obregón</SelectItem>
                            </SelectContent>
                        </Select>
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

                    {/* Link (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="link" className="flex items-center gap-2">
                            Más Información (URL opcional)
                        </Label>
                        <Input
                            id="link"
                            placeholder="https://facebook.com/eventos/..."
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />
                    </div>

                    {/* Display Order */}
                    <div className="space-y-2">
                        <Label htmlFor="display_order" className="flex items-center gap-2">
                            Orden de Despliegue
                        </Label>
                        <Input
                            id="display_order"
                            type="number"
                            placeholder="Ej: 1"
                            value={formData.display_order}
                            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        />
                        <p className="text-xs text-muted-foreground">Indica la posición en la lista (números más bajos aparecen primero).</p>
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
                        disabled={saving}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 border-t-transparent animate-spin mr-2" />
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
