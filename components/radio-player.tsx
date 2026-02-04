"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Placeholder stream URL - replace with actual radio stream
  const streamUrl = "https://stream.zeno.fm/0r0xa792kwzuv"

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  const togglePlay = async () => {
    if (!audioRef.current) return

    setIsLoading(true)
    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.log("[v0] Error playing audio:", error)
    }
    setIsLoading(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-t border-secondary/50">
      <audio ref={audioRef} src={streamUrl} preload="none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Now Playing Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full bg-primary flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                <Radio className="w-6 h-6 text-primary-foreground" />
              </div>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-secondary-foreground truncate">
                En Vivo
              </p>
              <p className="text-xs text-secondary-foreground/70 truncate">
                Radio Luz Divina • 24/7
              </p>
            </div>
          </div>

          {/* Play Controls */}
          <div className="flex items-center gap-2">
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
                setIsMuted(false)
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
