"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Calendar, Tv, Video, TrendingUp, Image as ImageIcon, FileText, Plus, Megaphone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
    const [stats, setStats] = useState({
        events: 0,
        programs: 0,
        videos: 0,
        gallery: 0,
        articles: 0,
        announcements: 0,
    })
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Fetch User Profile first
                const { data: { user: authUser } } = await supabase.auth.getUser()
                if (authUser) {
                    const { data: userProfile } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", authUser.id)
                        .single()
                    setProfile(userProfile)
                }

                // Fetch Stats
                const [eventsCount, programsCount, videosCount, galleryCount, articlesCount, announcementsCount] = await Promise.all([
                    supabase.from("events").select("*", { count: "exact", head: true }),
                    supabase.from("programs").select("*", { count: "exact", head: true }),
                    supabase.from("videos").select("*", { count: "exact", head: true }),
                    supabase.from("gallery").select("*", { count: "exact", head: true }),
                    supabase.from("articles").select("*", { count: "exact", head: true }),
                    supabase.from("announcements").select("*", { count: "exact", head: true }),
                ])

                setStats({
                    events: eventsCount.count || 0,
                    programs: programsCount.count || 0,
                    videos: videosCount.count || 0,
                    gallery: galleryCount.count || 0,
                    articles: articlesCount.count || 0,
                    announcements: announcementsCount.count || 0,
                })
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const allStatCards = [
        {
            title: "Artículos",
            value: stats.articles,
            icon: FileText,
            href: "/admin/dashboard/articulos",
            color: "text-blue-600",
            bg: "bg-blue-600/10",
            roles: ["admin", "writer"]
        },
        {
            title: "Eventos",
            value: stats.events,
            icon: Calendar,
            href: "/admin/dashboard/eventos",
            color: "text-primary",
            bg: "bg-primary/10",
            roles: ["admin", "asist", "operator"]
        },
        {
            title: "Programas",
            value: stats.programs,
            icon: Tv,
            href: "/admin/dashboard/programacion",
            color: "text-secondary",
            bg: "bg-secondary/10",
            roles: ["admin", "asist", "operator"]
        },
        {
            title: "Videos",
            value: stats.videos,
            icon: Video,
            href: "/admin/dashboard/videos",
            color: "text-emerald-600",
            bg: "bg-emerald-600/10",
            roles: ["admin", "galery"]
        },
        {
            title: "Galería",
            value: stats.gallery,
            icon: ImageIcon,
            href: "/admin/dashboard/galeria",
            color: "text-orange-600",
            bg: "bg-orange-600/10",
            roles: ["admin", "galery"]
        },
        {
            title: "Anuncios",
            value: stats.announcements,
            icon: Megaphone,
            href: "/admin/dashboard/anuncios",
            color: "text-rose-600",
            bg: "bg-rose-600/10",
            roles: ["admin"]
        },
    ]

    const filteredStatCards = profile
        ? allStatCards.filter(card => card.roles.includes(profile.role))
        : []

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                    Bienvenido, {profile?.full_name || "Administrador"}
                </h1>
                <p className="text-muted-foreground">
                    Gestiona el contenido de Radio Vida Mx desde aquí.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(loading ? Array(4).fill(0) : filteredStatCards).map((stat, i) => (
                    stat === 0 ? (
                        <div key={i} className="h-32 bg-card border border-border rounded-2xl animate-pulse" />
                    ) : (
                        <Link
                            key={stat.title}
                            href={stat.href}
                            className="group"
                        >
                            <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-foreground">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                    Acciones Rápidas
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {profile?.role && ["admin", "writer"].includes(profile.role) && (
                        <>
                            <Link href="/admin/dashboard/articulos/nuevo">
                                <Button className="w-full justify-start bg-primary hover:bg-primary/90">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Artículo
                                </Button>
                            </Link>
                            <Link href="/admin/dashboard/articulos">
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Gestionar Artículos
                                </Button>
                            </Link>
                        </>
                    )}

                    {profile?.role && ["admin", "asist", "operator"].includes(profile.role) && (
                        <>
                            <Link href="/admin/dashboard/eventos/nuevo">
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Nuevo Evento
                                </Button>
                            </Link>
                            <Link href="/admin/dashboard/programacion">
                                <Button variant="outline" className="w-full justify-start">
                                    <Tv className="w-4 h-4 mr-2" />
                                    Editar Programación
                                </Button>
                            </Link>
                        </>
                    )}

                    {profile?.role && ["admin", "galery"].includes(profile.role) && (
                        <>
                            <Link href="/admin/dashboard/videos">
                                <Button variant="outline" className="w-full justify-start">
                                    <Video className="w-4 h-4 mr-2" />
                                    Agregar Video
                                </Button>
                            </Link>
                            <Link href="/admin/dashboard/galeria">
                                <Button variant="outline" className="w-full justify-start">
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Gestionar Galería
                                </Button>
                            </Link>
                        </>
                    )}

                    {profile?.role === "admin" && (
                        <Link href="/admin/dashboard/anuncios/nuevo">
                            <Button variant="outline" className="w-full justify-start">
                                <Megaphone className="w-4 h-4 mr-2" />
                                Nuevo Anuncio
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-2">
                    💡 Ayuda y Soporte
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Si tienes problemas o preguntas sobre cómo usar el panel de administración,
                    contacta al administrador del sistema.
                </p>
                <div className="flex gap-3">
                    <Link href="/" className="text-sm text-primary hover:underline">
                        Ver sitio web →
                    </Link>
                </div>
            </div>
        </div>
    )
}
