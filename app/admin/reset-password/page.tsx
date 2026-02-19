"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import Image from "next/image"

export default function ResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        // Supabase maneja el hash en la URL automáticamente
        // Pero verificamos si hay una sesión activa (que Supabase Auth provee al hacer clic en el link)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                setError("El enlace de recuperación es inválido o ha expirado.")
            }
        }
        checkSession()
    }, [])

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.")
            return
        }

        setLoading(true)
        setError("")

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            })

            if (updateError) throw updateError

            setSuccess(true)
            setTimeout(() => {
                router.push("/admin/login")
            }, 3000)
        } catch (err: any) {
            console.error("Reset Error:", err)
            setError(err.message || "No se pudo actualizar la contraseña.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
            <div className="w-full max-w-md">
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
                        Nueva Contraseña
                    </h1>
                    <p className="text-muted-foreground">
                        Ingresa tu nueva clave de acceso
                    </p>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {success ? (
                        <div className="text-center space-y-4 py-4">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">¡Contraseña Actualizada!</h2>
                            <p className="text-muted-foreground">
                                Tu contraseña ha sido cambiada con éxito. Redirigiendo al inicio de sesión...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Nueva Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || error !== "" && !password}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Actualizando...
                                    </>
                                ) : (
                                    "Cambiar Contraseña"
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
