"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { supabase, type Article } from "@/lib/supabase"
import {
    Calendar,
    User,
    MessageSquare,
    ThumbsUp,
    ArrowRight,
    Loader2,
    Search
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchArticles = async () => {
            try {
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

        fetchArticles()
    }, [])

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background flex flex-col pt-20">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-muted/30 py-16 md:py-24 border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
                            Blog y Reflexiones
                        </span>
                        <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
                            Artículos de Radio Vida
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                            Encuentra inspiración, enseñanzas y noticias de nuestra comunidad cristiana.
                        </p>

                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Buscar artículos por título o autor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 bg-card shadow-sm text-lg rounded-2xl"
                            />
                        </div>
                    </div>
                </section>

                {/* Articles Grid */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                <p className="text-muted-foreground">Cargando inspiración...</p>
                            </div>
                        ) : filteredArticles.length === 0 ? (
                            <div className="text-center py-20">
                                <h3 className="text-2xl font-semibold mb-2">No se encontraron artículos</h3>
                                <p className="text-muted-foreground">Prueba con otros términos de búsqueda.</p>
                                <Button
                                    variant="outline"
                                    className="mt-6"
                                    onClick={() => setSearchQuery("")}
                                >
                                    Ver todos los artículos
                                </Button>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredArticles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/articulos/${article.slug}`}
                                        className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all flex flex-col"
                                    >
                                        {article.image_url ? (
                                            <div className="relative aspect-[16/9] overflow-hidden">
                                                <Image
                                                    src={article.image_url}
                                                    alt={article.title.replace(/<[^>]*>/g, '')}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative aspect-[16/9] bg-primary/5 flex items-center justify-center">
                                                <FileText className="w-12 h-12 text-primary/20" />
                                            </div>
                                        )}

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </div>

                                            <h3
                                                className="font-serif text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors"
                                                dangerouslySetInnerHTML={{ __html: article.title }}
                                            />

                                            <div className="flex items-center gap-2 text-sm text-foreground/70 mb-4">
                                                <User className="w-4 h-4 text-primary" />
                                                <span>{article.author_name}</span>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-muted-foreground">
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <ThumbsUp className="w-4 h-4" />
                                                        {article.likes_count}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageSquare className="w-4 h-4" />
                                                        {article.comments_count || 0}
                                                    </span>
                                                </div>
                                                <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:underline">
                                                    Leer más
                                                    <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

function FileText({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    )
}
