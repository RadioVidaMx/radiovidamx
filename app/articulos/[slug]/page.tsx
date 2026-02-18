"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { supabase, type Article, type Comment, type Profile } from "@/lib/supabase"
import {
    Calendar,
    User,
    MessageSquare,
    ThumbsUp,
    Share2,
    ArrowLeft,
    Loader2,
    Send,
    Lock
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ArticleDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [article, setArticle] = useState<Article | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasLiked, setHasLiked] = useState(false)

    useEffect(() => {
        if (params.slug) {
            fetchArticle()
            checkUser()
        }
    }, [params.slug])

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }

    const fetchArticle = async () => {
        try {
            setLoading(true)
            // Fetch article
            const { data: articleData, error: articleError } = await supabase
                .from("articles")
                .select("*")
                .eq("slug", params.slug)
                .single()

            if (articleError) throw articleError
            setArticle(articleData)

            // Fetch comments with profiles
            const { data: commentsData, error: commentsError } = await supabase
                .from("comments")
                .select(`
                    *,
                    profiles:user_id (
                        full_name,
                        avatar_url
                    )
                `)
                .eq("article_id", articleData.id)
                .order("created_at", { ascending: true })

            if (commentsError) throw commentsError
            setComments(commentsData || [])

            // Check if user has liked
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: likeData } = await supabase
                    .from("article_likes")
                    .select("id")
                    .eq("article_id", articleData.id)
                    .eq("user_id", user.id)
                    .single()

                if (likeData) setHasLiked(true)
            }

        } catch (error) {
            console.error("Error fetching article:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            alert("Inicia sesión para indicar que te gusta este artículo.")
            router.push("/admin/login")
            return
        }

        if (hasLiked) return

        try {
            const { error: likeError } = await supabase
                .from("article_likes")
                .insert([{ article_id: article?.id, user_id: user.id }])

            if (likeError) throw likeError

            // No necesitamos actualizar manual el contador en DB, el Trigger SQL se encarga.
            // Pero actualizamos el estado local para feedback inmediato.
            setHasLiked(true)
            setArticle(prev => prev ? { ...prev, likes_count: prev.likes_count + 1 } : null)
        } catch (error) {
            console.error("Error liking article:", error)
        }
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article?.title,
                text: `Lee este artículo de Radio Vida: ${article?.title}`,
                url: window.location.href
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert("Enlace copiado al portapapeles")
        }
    }

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !user || !article) return

        setIsSubmitting(true)
        try {
            const { data, error } = await supabase
                .from("comments")
                .insert([
                    {
                        article_id: article.id,
                        user_id: user.id,
                        content: newComment.trim()
                    }
                ])
                .select(`
                    *,
                    profiles:user_id (
                        full_name,
                        avatar_url
                    )
                `)
                .single()

            if (error) throw error

            setComments([...comments, data])
            setNewComment("")
        } catch (error) {
            console.error("Error posting comment:", error)
            alert("No se pudo publicar el comentario.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
                <Header />
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <Footer />
            </div>
        )
    }

    if (!article) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
                <Header />
                <h1 className="text-2xl font-bold">Artículo no encontrado</h1>
                <Link href="/articulos" className="mt-4 text-primary hover:underline">
                    Volver al blog
                </Link>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-20">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                {/* Back to Blog */}
                <Link
                    href="/articulos"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Volver a Artículos
                </Link>

                {/* Article Header */}
                <article className="space-y-8">
                    <div className="space-y-4">
                        <h1
                            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                            dangerouslySetInnerHTML={{ __html: article.title }}
                        />

                        <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-b border-border pb-6">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                <span className="text-foreground font-medium">{article.author_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{new Date(article.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                <span>{article.comments_count || 0} comentarios</span>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    {article.image_url && (
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src={article.image_url}
                                alt={article.title.replace(/<[^>]*>/g, '')}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div
                        className="prose prose-lg max-w-none text-foreground/90 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Engagement Buttons */}
                    <div className="flex items-center justify-between border-y border-border py-6 my-12">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${hasLiked
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted hover:bg-muted/80 text-foreground"
                                    }`}
                            >
                                <ThumbsUp className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} />
                                <span className="font-semibold">{article.likes_count}</span>
                                <span className="hidden sm:inline">Me gusta</span>
                            </button>

                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-full transition-all"
                            >
                                <Share2 className="w-5 h-5" />
                                <span className="hidden sm:inline">Compartir</span>
                            </button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <section id="comentarios" className="space-y-10">
                        <h2 className="text-2xl font-serif font-bold text-foreground">
                            Comentarios ({comments.length})
                        </h2>

                        {/* Comments List */}
                        <div className="space-y-6">
                            {comments.length === 0 ? (
                                <p className="text-muted-foreground italic bg-muted/30 p-8 rounded-2xl text-center">
                                    Aún no hay comentarios. ¡Sé el primero en compartir tu reflexión!
                                </p>
                            ) : (
                                comments.map((comment: any) => (
                                    <div key={comment.id} className="flex gap-4 p-6 bg-card border border-border rounded-2xl">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            {comment.profiles?.avatar_url ? (
                                                <Image
                                                    src={comment.profiles.avatar_url}
                                                    alt={comment.profiles.full_name || "Usuario"}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <User className="w-6 h-6 text-primary" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-foreground">
                                                    {comment.profiles?.full_name || "Lector Anónimo"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(comment.created_at).toLocaleDateString()} a las {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-foreground/80 leading-relaxed text-sm">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Post Comment Form */}
                        <div className="bg-muted/30 rounded-3xl p-8 border border-border/50">
                            {user ? (
                                <form onSubmit={handleSubmitComment} className="space-y-4">
                                    <Label htmlFor="comment" className="text-lg font-semibold block mb-2">
                                        Deja un comentario
                                    </Label>
                                    <Textarea
                                        id="comment"
                                        placeholder="Escribe tu comentario aquí..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="bg-card border-border min-h-[120px] focus:ring-primary rounded-xl"
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !newComment.trim()}
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px]"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            ) : (
                                                <Send className="w-4 h-4 mr-2" />
                                            )}
                                            Publicar Comentario
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center py-6 space-y-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold">Inicia sesión para comentar</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        Te invitamos a ser parte de la conversación registrándote como lector.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                                        <Link href="/admin/login">
                                            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                                                Iniciar Sesión / Registrarse
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </article>
            </main>

            <Footer />
        </div>
    )
}
