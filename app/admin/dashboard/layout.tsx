"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
    LayoutDashboard,
    Calendar,
    Tv,
    Video,
    Image as ImageIcon,
    LogOut,
    Menu,
    X,
    FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Artículos", href: "/admin/dashboard/articulos", icon: FileText },
    { name: "Eventos", href: "/admin/dashboard/eventos", icon: Calendar },
    { name: "Programación", href: "/admin/dashboard/programacion", icon: Tv },
    { name: "Videos", href: "/admin/dashboard/videos", icon: Video },
    { name: "Galería", href: "/admin/dashboard/galeria", icon: ImageIcon },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/admin/login")
            } else {
                setUser(user)
            }
        }
        getUser()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/admin/login")
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-[60] h-full w-64 bg-secondary text-secondary-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0 pb-24 lg:pb-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-secondary-foreground/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-serif text-xl font-bold">Radio Vida</h1>
                                <p className="text-sm text-secondary-foreground/70">Panel Admin</p>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-2 hover:bg-secondary-foreground/10 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-secondary-foreground/80 hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Info & Logout */}
                    <div className="p-4 border-t border-secondary-foreground/10">
                        <div className="mb-3 px-4 py-2">
                            <p className="text-xs text-secondary-foreground/60">Conectado como:</p>
                            <p className="text-sm font-medium truncate">{user.email}</p>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-start border border-sky-400/20 text-sky-400 bg-sky-400/5 hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-card border-b border-border px-4 py-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-muted rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-foreground">
                                {navigation.find(item => pathname === item.href || pathname?.startsWith(item.href + "/"))?.name || "Dashboard"}
                            </h2>
                        </div>
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Ver sitio web →
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8 pb-32 lg:pb-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
