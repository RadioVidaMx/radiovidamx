"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Radio, Lock, Mail, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            console.log("Attempting login for:", email)
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) {
                console.error("Supabase Login Error Detail:", signInError)
                setError(`Error: ${signInError.message} (Status: ${signInError.status || 'unknown'})`)
                setLoading(false)
                return
            }

            console.log("Login success for:", data.user?.email)

            // Sync session to cookies for middleware/server-side checks
            const { session } = data
            if (session) {
                document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax`
            }

            if (data.user) {
                // Use router.push for smooth navigation that preserves audio player state
                router.push("/admin/dashboard")
            }
        } catch (err: any) {
            console.error("Catch Error:", err)
            setError(`Error inesperado: ${err.message || "Por favor intenta de nuevo."}`)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="relative w-48 h-24 flex items-center justify-center">
                            <Image
                                src="/logo-radiovida.png"
                                alt="Radio Vida Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                        Panel de Administración
                    </h1>
                    <p className="text-muted-foreground">
                        Radio Vida Hermosillo
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                            Iniciar Sesión
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Ingresa tus credenciales para acceder
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Correo Electrónico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10"
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                    Iniciando sesión...
                                </>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </Button>
                    </form>

                    {/* Diagnostic Info (Only shown on error) */}
                    {error && (
                        <div className="mt-6 p-3 bg-muted rounded-lg text-[10px] font-mono break-all opacity-70">
                            <p className="font-bold mb-1 uppercase tracking-wider">Detalles Técnicos:</p>
                            <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
                            <p>Key Length: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length} chars</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-xs text-center text-muted-foreground">
                            ¿Problemas para acceder? Contacta al administrador del sistema.
                        </p>
                    </div>
                </div>

                {/* Back to Site */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        ← Volver al sitio web
                    </Link>
                </div>
            </div>
        </div>
    )
}
