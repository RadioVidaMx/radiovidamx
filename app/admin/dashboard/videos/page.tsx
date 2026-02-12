"use client"

import { useEffect, useState } from "react"
import { supabase, type Video } from "@/lib/supabase"
import {
    Video as VideoIcon,
    Plus,
    Trash2,
    Search,
    ExternalLink,
    Play,
    Type,
    Link as LinkIcon,
    Save,
    Loader2
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

export default function VideosAdminPage() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingVideo, setEditingVideo] = useState<Video | null>(null)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        youtube_id: "",
    })

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("videos")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching videos:", error)
        } else {
            setVideos(data || [])
        }
        setLoading(false)
    }

    const handleOpenDialog = (video: Video | null = null) => {
        if (video) {
            setEditingVideo(video)
            setFormData({
                title: video.title || "",
                youtube_id: video.youtube_id,
            })
        } else {
            setEditingVideo(null)
            setFormData({
                title: "",
                youtube_id: "",
            })
        }
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        if (!formData.title || !formData.youtube_id) {
            alert("Por favor completa todos los campos")
            return
        }

        setSaving(true)
        try {
            if (editingVideo) {
                const { error } = await supabase
                    .from("videos")
                    .update(formData)
                    .eq("id", editingVideo.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from("videos")
                    .insert([formData])
                if (error) throw error
            }

            setIsDialogOpen(false)
            fetchVideos()
        } catch (error: any) {
            alert("Error al guardar video: " + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este video de la lista?")) return

        const { error } = await supabase
            .from("videos")
            .delete()
            .eq("id", id)

        if (error) {
            alert("Error al eliminar")
        } else {
            setVideos(videos.filter(v => v.id !== id))
        }
    }

    const filteredVideos = videos.filter(video =>
        (video.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getThumbnail = (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Gestión de Videos</h1>
                    <p className="text-muted-foreground">Administra los videos de YouTube que aparecen en el carrusel.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Video
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar videos por título..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Videos Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : filteredVideos.length > 0 ? (
                    filteredVideos.map((video) => (
                        <div
                            key={video.id}
                            className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-md transition-all"
                        >
                            {/* Thumbnail Preview */}
                            <div className="relative aspect-video bg-muted group-hover:opacity-90 transition-opacity cursor-pointer" onClick={() => handleOpenDialog(video)}>
                                <img
                                    src={getThumbnail(video.youtube_id)}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center text-white shadow-lg">
                                        <Play className="w-6 h-6 fill-current ml-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <h3 className="font-bold text-foreground line-clamp-1">{video.title}</h3>
                                    <p className="text-xs text-muted-foreground font-mono mt-1">ID: {video.youtube_id}</p>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-border">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(video)}>
                                        Editar
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive" onClick={() => handleDelete(video.id)}>
                                        Eliminar
                                    </Button>
                                    <a
                                        href={`https://youtube.com/watch?v=${video.youtube_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-muted rounded-md transition-colors"
                                        title="Ver en YouTube"
                                    >
                                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-2xl">
                        <VideoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-foreground">No hay videos en la lista</h3>
                        <p className="text-muted-foreground">Agrega videos de YouTube para mostrarlos en el sitio web.</p>
                    </div>
                )}
            </div>

            {/* Edit/Add Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingVideo ? "Editar Video" : "Agregar Nuevo Video"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2 text-sm">
                                <Type className="w-4 h-4 text-primary" /> Título del Video
                            </Label>
                            <Input
                                id="title"
                                placeholder="Ej: Mensaje del Pastor - Domingo"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="youtube_id" className="flex items-center gap-2 text-sm">
                                <LinkIcon className="w-4 h-4 text-primary" /> ID de YouTube
                            </Label>
                            <Input
                                id="youtube_id"
                                placeholder="Ej: dQw4w9WgXcQ"
                                value={formData.youtube_id}
                                onChange={(e) => setFormData({ ...formData, youtube_id: e.target.value })}
                            />
                            <p className="text-[10px] text-muted-foreground p-1">
                                Ingresa solo el ID final del video (lo que aparece después de v= en la URL).
                            </p>
                        </div>

                        {formData.youtube_id && (
                            <div className="rounded-lg overflow-hidden border border-border bg-muted/30 p-2">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2 px-1">Vista Previa:</p>
                                <img
                                    src={getThumbnail(formData.youtube_id)}
                                    className="w-full aspect-video object-cover rounded shadow-sm"
                                    onError={(e) => (e.currentTarget.src = "https://placehold.co/640x360?text=ID+Inválido")}
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
                                    {editingVideo ? "Actualizar" : "Guardar"}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
