"use client"

import { useState, useEffect } from "react"
import { supabase, type Article } from "@/lib/supabase"
import {
    Plus,
    Search,
    FileText,
    Edit,
    Trash2,
    Eye,
    ThumbsUp,
    MessageSquare,
    Loader2,
    Calendar,
    User
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function ArticlesAdminPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("articles")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setArticles(data || [])
        } catch (error) {
            console.error("Error fetching articles:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este artículo?")) return

        try {
            const { error } = await supabase
                .from("articles")
                .delete()
                .eq("id", id)

            if (error) throw error
            setArticles(articles.filter(a => a.id !== id))
        } catch (error) {
            console.error("Error deleting article:", error)
            alert("No se pudo eliminar el artículo.")
        }
    }

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-1">Artículos</h1>
                    <p className="text-muted-foreground">Gestiona los blogs y reflexiones de los colaboradores.</p>
                </div>
                <Link href="/admin/dashboard/articulos/nuevo">
                    <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Artículo
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por título o autor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Articles List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-shadow"
                        >
                            {/* Article Info */}
                            <div className="flex-1 flex gap-4 min-w-0">
                                {article.image_url ? (
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted border border-border/50">
                                        <Image
                                            src={article.image_url}
                                            alt={article.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                                        <FileText className="w-8 h-8 text-primary" />
                                    </div>
                                )}

                                <div className="space-y-1 min-w-0">
                                    <h3
                                        className="font-bold text-lg text-foreground line-clamp-1"
                                        dangerouslySetInnerHTML={{ __html: article.title }}
                                    />
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5 text-foreground/70">
                                            <User className="w-3.5 h-3.5" />
                                            {article.author_name}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ThumbsUp className="w-3.5 h-3.5 text-primary" />
                                            {article.likes_count}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/articulos/${article.slug}`} target="_blank">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Ver
                                    </Link>
                                </Button>

                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/dashboard/articulos/${article.id}`}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDelete(article.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-2xl">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-foreground">No se encontraron artículos</h3>
                        <p className="text-muted-foreground">Prueba otra búsqueda o crea un nuevo artículo.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
