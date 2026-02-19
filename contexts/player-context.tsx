"use client"

import React, { createContext, useContext, useState, useRef, useEffect } from "react"

interface PlayerContextType {
    isPlaying: boolean
    togglePlay: () => void
    volume: number
    setVolume: (volume: number) => void
    isMuted: boolean
    toggleMute: () => void
    isLoading: boolean
    city: 'Hermosillo' | 'Obregón'
    setCity: (city: 'Hermosillo' | 'Obregón') => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(80)
    const [isMuted, setIsMuted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [city, setCity] = useState<'Hermosillo' | 'Obregón'>('Hermosillo')
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Radio Vida stream URLs
    const streams = {
        'Hermosillo': "https://stream4.305stream.com:9675/stream",
        'Obregón': "https://stream1.305stream.com/proxy/client362?mp=/stream"
    }

    useEffect(() => {
        // Init audio
        const audio = new Audio(streams[city])
        audio.preload = "none"
        audioRef.current = audio

        return () => {
            audio.pause()
            audioRef.current = null
        }
    }, [])

    // Handle city/stream change
    useEffect(() => {
        if (!audioRef.current) return

        const wasPlaying = isPlaying
        if (wasPlaying) {
            audioRef.current.pause()
        }

        audioRef.current.src = streams[city]
        audioRef.current.load()

        if (wasPlaying) {
            audioRef.current.play().catch(err => console.error("Error swapping stream:", err))
        }
    }, [city])

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
        <PlayerContext.Provider
            value={{
                isPlaying,
                togglePlay,
                volume,
                setVolume,
                isMuted,
                toggleMute,
                isLoading,
                city,
                setCity
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export function usePlayer() {
    const context = useContext(PlayerContext)
    if (context === undefined) {
        throw new Error("usePlayer must be used within a PlayerProvider")
    }
    return context
}
