"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
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
    Link as LinkIcon,
    Loader2
} from "lucide-react"
import Link from "next/link"

import { RichTextEditor } from "@/components/ui/rich-text-editor"

export default function NewArticlePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author_name: "",
        image_url: "",
    })

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

        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                alert("Debes iniciar sesión para publicar artículos.")
                router.push("/admin/login")
                return
            }

            const slug = generateSlug(formData.title)

            const { error } = await supabase.from("articles").insert([
                {
                    ...formData,
                    slug,
                    author_id: user.id,
                    likes_count: 0
                }
            ])

            if (error) {
                if (error.code === '23505') {
                    alert("Ya existe un artículo con un título similar. Por favor intenta con otro título.")
                } else {
                    throw error
                }
                return
            }

            router.push("/admin/dashboard/articulos")
        } catch (error: any) {
            console.error("Error creating article:", error)
            alert("Error al guardar el artículo: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/dashboard/articulos">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-serif font-bold text-foreground">Nuevo Artículo</h1>
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
                        <Button variant="outline" type="button" disabled={loading}>
                            Cancelar
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 min-w-[150px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Publicar Artículo
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
