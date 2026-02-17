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
    Calendar
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
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="p-4 text-sm font-semibold">Artículo</th>
                                <th className="p-4 text-sm font-semibold text-center">Likes / Comentarios</th>
                                <th className="p-4 text-sm font-semibold">Fecha</th>
                                <th className="p-4 text-sm font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                        Cargando artículos...
                                    </td>
                                </tr>
                            ) : filteredArticles.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-muted-foreground">
                                        No se encontraron artículos.
                                    </td>
                                </tr>
                            ) : (
                                filteredArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {article.image_url ? (
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                                        <Image
                                                            src={article.image_url}
                                                            alt={article.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        <FileText className="w-6 h-6 text-primary" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-foreground line-clamp-1">{article.title}</p>
                                                    <p className="text-xs text-muted-foreground">Por: {article.author_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-4 text-sm">
                                                <div className="flex items-center gap-1 text-primary">
                                                    <ThumbsUp className="w-4 h-4" />
                                                    {article.likes_count}
                                                </div>
                                                <div className="flex items-center gap-1 text-secondary">
                                                    <MessageSquare className="w-4 h-4" />
                                                    {/* We could fetch comment count here or just show 0 for now */}
                                                    0
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/articulos/${article.slug}`} target="_blank">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/dashboard/articulos/${article.id}`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(article.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
