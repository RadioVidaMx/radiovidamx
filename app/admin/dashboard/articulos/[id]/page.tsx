"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase, type Article } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowLeft,
    Save,
    FileText,
    Image as ImageIcon,
    User,
    Trash2,
    Loader2
} from "lucide-react"
import Link from "next/link"

import { RichTextEditor } from "@/components/ui/rich-text-editor"

export default function EditArticlePage() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author_name: "",
        image_url: "",
    })

    useEffect(() => {
        if (params.id) {
            fetchArticle()
        }
    }, [params.id])

    const fetchArticle = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("articles")
                .select("*")
                .eq("id", params.id)
                .single()

            if (error) throw error
            if (data) {
                setFormData({
                    title: data.title,
                    content: data.content,
                    author_name: data.author_name,
                    image_url: data.image_url || "",
                })
            }
        } catch (error) {
            console.error("Error fetching article:", error)
            alert("No se pudo cargar el artículo.")
            router.push("/admin/dashboard/articulos")
        } finally {
            setLoading(false)
        }
    }

    const generateSlug = (titleHtml: string) => {
        // Strip HTML tags for slug
        const plainTitle = titleHtml.replace(/<[^>]*>/g, '')
        return plainTitle
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title.trim() || formData.title === "<p></p>") {
            alert("Por favor ingresa un título.")
            return
        }

        if (!formData.content.trim() || formData.content === "<p></p>") {
            alert("Por favor ingresa el contenido del artículo.")
            return
        }

        setSaving(true)

        try {
            const slug = generateSlug(formData.title)

            const { error } = await supabase
                .from("articles")
                .update({
                    ...formData,
                    slug,
                    updated_at: new Date().toISOString()
                })
                .eq("id", params.id)

            if (error) throw error

            router.push("/admin/dashboard/articulos")
        } catch (error: any) {
            console.error("Error updating article:", error)
            alert("Error al actualizar el artículo: " + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar este artículo?")) return

        try {
            setSaving(true)
            const { error } = await supabase
                .from("articles")
                .delete()
                .eq("id", params.id)

            if (error) throw error
            router.push("/admin/dashboard/articulos")
        } catch (error) {
            console.error("Error deleting article:", error)
            alert("No se pudo eliminar el artículo.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard/articulos">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Editar Artículo</h1>
                </div>
                <Button
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleDelete}
                    disabled={saving}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Artículo
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Título del Artículo (opcional: negrita, cursiva)
                        </Label>
                        <RichTextEditor
                            value={formData.title}
                            onChange={(val) => setFormData({ ...formData, title: val })}
                            placeholder="Título con estilo..."
                        />
                    </div>

                    {/* Author Name */}
                    <div className="space-y-2">
                        <Label htmlFor="author_name" className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Nombre del Autor
                        </Label>
                        <Input
                            id="author_name"
                            placeholder="Tu nombre completo o seudónimo"
                            value={formData.author_name}
                            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <Label htmlFor="image_url" className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            URL de la Imagen (Opcional)
                        </Label>
                        <Input
                            id="image_url"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Esta imagen se mostrará en el encabezado del artículo.</p>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content" className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Contenido del Artículo
                        </Label>
                        <RichTextEditor
                            value={formData.content}
                            onChange={(val) => setFormData({ ...formData, content: val })}
                        />
                        <p className="text-xs text-muted-foreground italic text-right">El editor soporta negrita, cursiva, subrayado y listas.</p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pb-20">
                    <Link href="/admin/dashboard/articulos">
                        <Button variant="outline" type="button" disabled={saving}>
                            Cancelar
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-primary hover:bg-primary/90 min-w-[150px]"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Guardando...
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
