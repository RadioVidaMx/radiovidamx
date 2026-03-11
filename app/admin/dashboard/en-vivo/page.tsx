"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Radio, Youtube, Facebook, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { LiveSettings } from "@/lib/supabase"

export default function EnVivoPage() {
    const [settings, setSettings] = useState<LiveSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const [facebookUrl, setFacebookUrl] = useState("")
    const [isLive, setIsLive] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from("live_settings")
                .select("*")
                .single()

            if (data) {
                setSettings(data)
                setIsLive(data.is_live)
                setYoutubeUrl(data.youtube_url || "")
                setFacebookUrl(data.facebook_url || "")
            }
            setLoading(false)
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setSaved(false)
        const { error } = await supabase
            .from("live_settings")
            .update({
                is_live: isLive,
                youtube_url: youtubeUrl || null,
                facebook_url: facebookUrl || null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", settings?.id)

        setSaving(false)
        if (!error) setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <Radio className="w-6 h-6 text-primary" />
                    Control EN VIVO
                </h1>
                <p className="text-muted-foreground mt-1">
                    Activa el indicador EN VIVO en el radio player cuando estés transmitiendo en YouTube o Facebook.
                </p>
            </div>

            {/* Toggle Principal */}
            <div className={`rounded-2xl border-2 p-6 transition-all duration-500 ${isLive
                ? "border-red-500 bg-red-500/5"
                : "border-border bg-card"
                }`}>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {isLive && (
                            <span className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
                            </span>
                        )}
                        <div>
                            <p className="font-bold text-lg">
                                {isLive ? "🔴 EN VIVO ACTIVADO" : "⚫ EN VIVO DESACTIVADO"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {isLive
                                    ? "El badge EN VIVO es visible en el sitio público"
                                    : "El badge no es visible en el sitio público"}
                            </p>
                        </div>
                    </div>
                    {/* Switch */}
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none ${isLive ? "bg-red-500" : "bg-muted"
                            }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${isLive ? "translate-x-9" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* URLs */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
                <h2 className="font-semibold text-foreground">Links de transmisión</h2>

                {/* YouTube */}
                <div className="space-y-2">
                    <Label htmlFor="youtube_url" className="flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-500" />
                        URL de YouTube Live
                    </Label>
                    <Input
                        id="youtube_url"
                        placeholder="https://www.youtube.com/live/..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Pega el link de tu transmisión en vivo de YouTube aquí.
                    </p>
                </div>

                {/* Facebook */}
                <div className="space-y-2">
                    <Label htmlFor="facebook_url" className="flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-500" />
                        URL de Facebook Live
                    </Label>
                    <Input
                        id="facebook_url"
                        placeholder="https://www.facebook.com/RadioVida/live/..."
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Pega el link de tu transmisión en vivo de Facebook aquí.
                    </p>
                </div>
            </div>

            {/* Guardar */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className={`min-w-[160px] transition-all ${saved ? "bg-green-600 hover:bg-green-600" : "bg-primary hover:bg-primary/90"} text-primary-foreground`}
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Guardando...
                        </>
                    ) : saved ? (
                        "✓ Guardado"
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Guardar cambios
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
