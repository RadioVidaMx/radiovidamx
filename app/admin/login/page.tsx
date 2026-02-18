"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Radio, Lock, Mail, AlertCircle, User, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
    const router = useRouter()
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            if (mode === 'login') {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (signInError) throw signInError

                // Sync session to cookies
                const { session, user } = data
                if (session) {
                    document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax`
                }

                // Fetch user role for redirection
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user?.id)
                    .single()

                if (profileError) console.error("Login profile fetch error:", profileError)

                // Redirect based on role
                const urlParams = new URLSearchParams(window.location.search)
                const next = urlParams.get('next')

                if (profile?.role === 'reader' || !profile) {
                    // Si es reader o no tiene perfil todavía, al sitio público
                    router.push("/articulos")
                } else {
                    // Admin, writer, asist, galery van al dashboard
                    router.push(next || "/admin/dashboard")
                }
            } else {
                // Register
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName
                        }
                    }
                })

                if (signUpError) throw signUpError

                if (data.user) {
                    // Create profile with 'reader' role by default
                    const { error: profileError } = await supabase.from("profiles").insert([
                        {
                            id: data.user.id,
                            full_name: fullName,
                            role: 'reader'
                        }
                    ])
                    if (profileError) console.error("Profile creation error:", profileError)

                    // If email confirmation is disabled, we might have a session already
                    if (data.session) {
                        setSuccess("¡Cuenta creada exitosamente! Redirigiendo...")
                        // Sync session to cookies
                        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax`

                        setTimeout(() => {
                            router.push("/articulos")
                        }, 1500)
                    } else {
                        setSuccess("¡Registro exitoso! Ya puedes iniciar sesión (asegúrate de haber confirmado tu correo si es necesario).")
                    }
                }
            }
        } catch (err: any) {
            console.error("Auth Error:", err)
            setError(err.message || "Ocurrió un error inesperado.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4 pb-24">
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
                        {mode === 'login' ? "Iniciar Sesión" : "Crear Cuenta"}
                    </h1>
                    <p className="text-muted-foreground">
                        Radio Vida Hermosillo
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-primary">{success}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleAuth} className="space-y-4">
                        {mode === 'register' && (
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-sm font-medium">
                                    Nombre Completo
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="fullName"
                                        placeholder="Tu nombre"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        )}

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
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || success !== ""}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Procesando...
                                </>
                            ) : (
                                mode === 'login' ? "Iniciar Sesión" : "Registrarse"
                            )}
                        </Button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setMode(mode === 'login' ? 'register' : 'login')
                                setError("")
                                setSuccess("")
                            }}
                            className="text-sm text-primary hover:underline font-medium"
                        >
                            {mode === 'login'
                                ? "¿No tienes cuenta? Regístrate aquí"
                                : "¿Ya tienes cuenta? Inicia sesión"}
                        </button>
                    </div>
                </div>

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        ← Volver al sitio web
                    </Link>
                </div>
            </div>
        </div>
    )
}
