"use client"

import { useEffect, useState } from "react"
import { supabase, type GalleryImage } from "@/lib/supabase"
import {
    Image as ImageIcon,
    Plus,
    Trash2,
    Search,
    ExternalLink,
    Type,
    Link as LinkIcon,
    Save,
    Loader2,
    Eye,
    AlignLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

export default function GalleryAdminPage() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        src: "",
        alt: "",
        display_order: 0
    })

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .order("display_order", { ascending: true })

        if (error) {
            console.error("Error fetching gallery:", error)
        } else {
            setImages(data || [])
        }
        setLoading(false)
    }

    const handleOpenDialog = (image: GalleryImage | null = null) => {
        if (image) {
            setEditingImage(image)
            setFormData({
                title: image.title || "",
                src: image.src,
                alt: image.alt || "",
                display_order: image.display_order
            })
        } else {
            setEditingImage(null)
            setFormData({
                title: "",
                src: "",
                alt: "",
                display_order: images.length + 1
            })
        }
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!formData.src) {
            alert("Por favor ingresa la URL de la imagen")
            return
        }

        setSaving(true)
        try {
            if (editingImage) {
                const { error } = await supabase
                    .from("gallery")
                    .update(formData)
                    .eq("id", editingImage.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from("gallery")
                    .insert([formData])
                if (error) throw error
            }

            setIsDialogOpen(false)
            fetchImages()
        } catch (error: any) {
            alert("Error al guardar imagen: " + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta imagen de la galería?")) return

        const { error } = await supabase
            .from("gallery")
            .delete()
            .eq("id", id)

        if (error) {
            alert("Error al eliminar")
        } else {
            setImages(images.filter(img => img.id !== id))
        }
    }

    const filteredImages = images.filter(img =>
        (img.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.alt || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Gestión de Galería</h1>
                    <p className="text-muted-foreground">Administra las imágenes que aparecen en la sección de Galería.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Imagen
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar imágenes por título o descripción..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : filteredImages.length > 0 ? (
                    filteredImages.map((image) => (
                        <div
                            key={image.id}
                            className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-md transition-all"
                        >
                            {/* Image Preview */}
                            <div className="relative aspect-[4/3] bg-muted group-hover:opacity-90 transition-opacity cursor-pointer" onClick={() => handleOpenDialog(image)}>
                                <img
                                    src={image.src}
                                    alt={image.alt || image.title || "Imagen de galería"}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center text-white shadow-lg">
                                        <Eye className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded-md backdrop-blur-sm">
                                    Orden: {image.display_order}
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <h3 className="font-bold text-foreground line-clamp-1">{image.title || "Sin título"}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{image.alt || "Sin descripción"}</p>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-border">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(image)}>
                                        Editar
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={() => handleDelete(image.id)}>
                                        Eliminar
                                    </Button>
                                    <a
                                        href={image.src}
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
                        <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-foreground">No hay imágenes en la galería</h3>
                        <p className="text-muted-foreground">Agrega fotos de tus eventos o del equipo para mostrarlas en el sitio web.</p>
                    </div>
                )}
            </div>

            {/* Edit/Add Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingImage ? "Editar Imagen" : "Agregar Nueva Imagen"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2 text-sm">
                                <Type className="w-4 h-4 text-primary" /> Título (Visible al pasar el mouse)
                            </Label>
                            <Input
                                id="title"
                                placeholder="Ej: Equipo de locutores en cabina"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="src" className="flex items-center gap-2 text-sm">
                                <LinkIcon className="w-4 h-4 text-primary" /> URL de la Imagen
                            </Label>
                            <Input
                                id="src"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                value={formData.src}
                                onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="alt" className="flex items-center gap-2 text-sm">
                                <AlignLeft className="w-4 h-4 text-primary" /> Descripción Alt (Accesibilidad)
                            </Label>
                            <Input
                                id="alt"
                                placeholder="Describe lo que se ve en la foto"
                                value={formData.alt}
                                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order" className="flex items-center gap-2 text-sm">
                                Orden de Aparición
                            </Label>
                            <Input
                                id="order"
                                type="number"
                                value={formData.display_order}
                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        {formData.src && (
                            <div className="rounded-lg overflow-hidden border border-border bg-muted/30 p-2">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2 px-1">Vista Previa:</p>
                                <img
                                    src={formData.src}
                                    className="w-full aspect-video object-cover rounded shadow-sm"
                                    onError={(e) => (e.currentTarget.src = "https://placehold.co/640x480?text=URL+Inválida")}
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
                                    {editingImage ? "Actualizar" : "Guardar"}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
