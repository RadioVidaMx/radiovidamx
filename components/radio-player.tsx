"use client"

import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { usePlayer } from "@/contexts/player-context"
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-t border-secondary/50">
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
