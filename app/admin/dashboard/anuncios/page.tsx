"use client"

import { useEffect, useState } from "react"
import { supabase, type Announcement } from "@/lib/supabase"
import {
    Layout,
    Plus,
    Trash2,
    Search,
    ExternalLink,
    Type,
    Link as LinkIcon,
    Save,
    Loader2,
    Eye,
    AlignLeft,
    CheckCircle2,
    XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

export default function AnnouncementsAdminPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image_url: "",
        link_url: "",
        display_order: 0,
        active: true
    })

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("display_order", { ascending: true })

        if (error) {
            console.error("Error fetching announcements:", error)
        } else {
            setAnnouncements(data || [])
        }
        setLoading(false)
    }

    const handleOpenDialog = (announcement: Announcement | null = null) => {
        if (announcement) {
            setEditingAnnouncement(announcement)
            setFormData({
                title: announcement.title || "",
                description: announcement.description || "",
                image_url: announcement.image_url,
                link_url: announcement.link_url || "",
                display_order: announcement.display_order,
                active: announcement.active
            })
        } else {
            setEditingAnnouncement(null)
            setFormData({
                title: "",
                description: "",
                image_url: "",
                link_url: "",
                display_order: announcements.length + 1,
                active: true
            })
        }
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!formData.image_url) {
            alert("Por favor ingresa la URL de la imagen")
            return
        }

        setSaving(true)
        try {
            if (editingAnnouncement) {
                const { error } = await supabase
                    .from("announcements")
                    .update(formData)
                    .eq("id", editingAnnouncement.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from("announcements")
                    .insert([formData])
                if (error) throw error
            }

            setIsDialogOpen(false)
            fetchAnnouncements()
        } catch (error: any) {
            alert("Error al guardar anuncio: " + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este anuncio del banner?")) return

        const { error } = await supabase
            .from("announcements")
            .delete()
            .eq("id", id)

        if (error) {
            alert("Error al eliminar")
        } else {
            setAnnouncements(announcements.filter(a => a.id !== id))
        }
    }

    const filteredAnnouncements = announcements.filter(a =>
        (a.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Gestión de Anuncios (Banner)</h1>
                    <p className="text-muted-foreground">Administra las imágenes y mensajes que aparecen en el banner principal de inicio.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Anuncio
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar anuncios por título o descripción..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Announcements Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : filteredAnnouncements.length > 0 ? (
                    filteredAnnouncements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className={`bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-md transition-all ${!announcement.active ? 'opacity-60' : ''}`}
                        >
                            {/* Image Preview */}
                            <div className="relative aspect-video bg-muted group-hover:opacity-90 transition-opacity cursor-pointer" onClick={() => handleOpenDialog(announcement)}>
                                <img
                                    src={announcement.image_url}
                                    alt={announcement.title || "Imagen de anuncio"}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center text-white shadow-lg">
                                        <Eye className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded-md backdrop-blur-sm">
                                    Orden: {announcement.display_order}
                                </div>
                                {!announcement.active && (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-destructive text-destructive-foreground text-[10px] rounded-md backdrop-blur-sm font-bold">
                                        Inactivo
                                    </div>
                                )}
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <h3 className="font-bold text-foreground line-clamp-1">{announcement.title || "Sin título"}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">{announcement.description || "Sin descripción"}</p>
                                </div>

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        {announcement.active ? (
                                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <XCircle className="w-3 h-3 text-destructive" />
                                        )}
                                        {announcement.active ? 'Visible' : 'Oculto'}
                                    </span>
                                    {announcement.link_url && (
                                        <span className="flex items-center gap-1">
                                            <LinkIcon className="w-3 h-3" /> Con enlace
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-border">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(announcement)}>
                                        Editar
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={() => handleDelete(announcement.id)}>
                                        Eliminar
                                    </Button>
                                    <a
                                        href={announcement.image_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-muted rounded-md transition-colors"
                                        title="Ver imagen original"
                                    >
                                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-2xl">
                        <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-foreground">No hay anuncios configurados</h3>
                        <p className="text-muted-foreground">Agrega imágenes para promocionar eventos, publicidad o noticias importantes.</p>
                    </div>
                )}
            </div>

            {/* Edit/Add Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAnnouncement ? "Editar Anuncio" : "Agregar Nuevo Anuncio"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium">Estado del Anuncio</Label>
                                <p className="text-xs text-muted-foreground">Activa para mostrarlo en el sitio público.</p>
                            </div>
                            <Switch
                                checked={formData.active}
                                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2 text-sm">
                                <Type className="w-4 h-4 text-primary" /> Título
                            </Label>
                            <Input
                                id="title"
                                placeholder="Ej: Concierto de Aniversario"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_url" className="flex items-center gap-2 text-sm">
                                <LinkIcon className="w-4 h-4 text-primary" /> URL de la Imagen
                            </Label>
                            <Input
                                id="image_url"
                                placeholder="https://ejemplo.com/flyer-evento.jpg"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-2 text-sm">
                                <AlignLeft className="w-4 h-4 text-primary" /> Descripción Breve
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Breve mensaje publicitario..."
                                rows={2}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="link_url" className="text-sm">Enlace (Opcional)</Label>
                                <Input
                                    id="link_url"
                                    placeholder="https://wa.me/..."
                                    value={formData.link_url}
                                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order" className="text-sm">Orden</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        {formData.image_url && (
                            <div className="rounded-lg overflow-hidden border border-border bg-muted/30 p-2">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2 px-1">Vista Previa:</p>
                                <img
                                    src={formData.image_url}
                                    className="w-full aspect-video object-cover rounded shadow-sm"
                                    onError={(e) => (e.currentTarget.src = "https://placehold.co/640x360?text=URL+de+Imagen+Invalida")}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground min-w-[100px]">
                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {editingAnnouncement ? "Actualizar" : "Guardar"}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
