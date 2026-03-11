"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { usePlayer } from "@/contexts/player-context"
import { supabase } from "@/lib/supabase"
import type { LiveSettings } from "@/lib/supabase"
import Image from "next/image"

export function RadioPlayer() {
  const {
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isLoading,
    city,
    setCity
  } = usePlayer()

  const [liveSettings, setLiveSettings] = useState<LiveSettings | null>(null)

  // Fetch live status and poll every 30 seconds
  useEffect(() => {
    const fetchLive = async () => {
      const { data } = await supabase
        .from("live_settings")
        .select("*")
        .single()
      if (data) setLiveSettings(data)
    }
    fetchLive()
    const interval = setInterval(fetchLive, 30000)
    return () => clearInterval(interval)
  }, [])

  const isLive = liveSettings?.is_live ?? false
  const youtubeUrl = liveSettings?.youtube_url
  const facebookUrl = liveSettings?.facebook_url

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-t border-secondary/50">
      {/* EN VIVO banner (solo visible cuando está activo) */}
      {isLive && (
        <div className="flex items-center justify-center gap-3 bg-red-600/90 py-1.5 px-4 text-white text-xs font-bold uppercase tracking-widest">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          EN VIVO AHORA
          <span className="flex items-center gap-2">
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 transition-colors rounded px-2 py-0.5"
              >
                {/* YouTube icon */}
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                YouTube
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 transition-colors rounded px-2 py-0.5"
              >
                {/* Facebook icon */}
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
            )}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Now Playing Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1 order-1 md:order-none">
            <div className="relative">
              <div className="w-12 h-12 flex items-center justify-center">
                <Image
                  src="/logo-radiovida-white.png"
                  alt="Radio Vida"
                  width={48}
                  height={48}
                  className={`w-full h-full object-contain ${isPlaying ? 'animate-pulse' : ''}`}
                />
              </div>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-secondary-foreground truncate">
                Radio Vida {city}
              </p>
              <p className="text-xs text-secondary-foreground/70 truncate">
                Sintonizando 24/7
              </p>
            </div>
          </div>

          {/* City Selector */}
          <div className="flex bg-secondary-foreground/10 p-0.5 sm:p-1 rounded-lg sm:rounded-xl items-center gap-0.5 sm:gap-1 order-3 md:order-none">
            <button
              onClick={() => setCity("Hermosillo")}
              className={`px-2 sm:px-4 py-1 sm:py-1.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider rounded-md sm:rounded-lg transition-all ${city === "Hermosillo"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-secondary-foreground/50 hover:text-secondary-foreground"
                }`}
            >
              HMO
              <span className="hidden xs:inline"> - Hermosillo</span>
            </button>
            <button
              onClick={() => setCity("Obregón")}
              className={`px-2 sm:px-4 py-1 sm:py-1.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider rounded-md sm:rounded-lg transition-all ${city === "Obregón"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-secondary-foreground/50 hover:text-secondary-foreground"
                }`}
            >
              OBR
              <span className="hidden xs:inline"> - Obregón</span>
            </button>
          </div>

          {/* Play Controls */}
          <div className="flex items-center gap-2 order-2 md:order-none">
            <Button
              onClick={togglePlay}
              disabled={isLoading}
              size="lg"
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
          </div>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-2 min-w-[140px]">
            <button
              onClick={toggleMute}
              className="p-2 text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={(value) => {
                setVolume(value[0])
              }}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
