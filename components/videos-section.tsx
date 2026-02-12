"use client"

import React, { useState, useEffect } from "react"
import { Play, ChevronLeft, ChevronRight, Youtube, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase, type Video } from "@/lib/supabase"

export function VideosSection() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null)
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        async function fetchVideos() {
            try {
                const { data, error } = await supabase
                    .from("videos")
                    .select("*")
                    .order("created_at", { ascending: false })

                if (error) throw error
                setVideos(data || [])
            } catch (error) {
                console.error("Error fetching videos:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchVideos()
    }, [])

    const videosPerPage = 3
    const totalSlides = Math.ceil(videos.length / videosPerPage)

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
        setActiveVideoIndex(null)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
        setActiveVideoIndex(null)
    }

    const getCurrentVideos = () => {
        const start = currentSlide * videosPerPage
        return videos.slice(start, start + videosPerPage)
    }

    const handleVideoClick = (index: number) => {
        const absoluteIndex = currentSlide * videosPerPage + index
        setActiveVideoIndex(absoluteIndex)
    }

    return (
        <section id="videos" className="py-20 md:py-32 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                        Multimedia
                    </span>
                    <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
                        Videos en Youtube
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Mira nuestros contenidos más recientes y comparte la palabra de Dios.
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                            <p className="text-muted-foreground animate-pulse">Cargando videos...</p>
                        </div>
                    ) : videos.length > 0 ? (
                        <>
                            {/* Videos Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {getCurrentVideos().map((video: Video, index: number) => {
                                    const absoluteIndex = currentSlide * videosPerPage + index
                                    const isActive = activeVideoIndex === absoluteIndex

                                    return (
                                        <div
                                            key={video.id}
                                            className="group relative bg-background rounded-2xl overflow-hidden border border-border shadow-sm transition-all hover:shadow-lg"
                                        >
                                            {isActive ? (
                                                // Embedded YouTube Player
                                                <div className="relative aspect-video">
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1`}
                                                        title={video.title || "Video de YouTube"}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                            ) : (
                                                // Thumbnail with Play Button
                                                <div
                                                    className="relative aspect-video cursor-pointer"
                                                    onClick={() => handleVideoClick(index)}
                                                >
                                                    {/* Thumbnail Image */}
                                                    <img
                                                        src={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                                                        alt={video.title || "Miniatura de video"}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            // Fallback to medium quality thumbnail if maxres not available
                                                            const target = e.target as HTMLImageElement
                                                            target.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`
                                                        }}
                                                    />

                                                    {/* Dark Overlay */}
                                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                                                    {/* Play Button */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-xl">
                                                            <Play className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground fill-current ml-1" />
                                                        </div>
                                                    </div>

                                                    {/* YouTube Icon Badge */}
                                                    <div className="absolute top-3 right-3 bg-red-600 rounded-lg px-2 py-1 flex items-center gap-1">
                                                        <Youtube className="w-4 h-4 text-white" />
                                                        <span className="text-xs font-semibold text-white">YouTube</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Navigation Arrows */}
                            {totalSlides > 1 && (
                                <div className="flex items-center justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={prevSlide}
                                        className="rounded-full w-12 h-12 border-2"
                                        aria-label="Previous videos"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>

                                    {/* Slide Indicators */}
                                    <div className="flex gap-2">
                                        {Array.from({ length: totalSlides }).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setCurrentSlide(index)
                                                    setActiveVideoIndex(null)
                                                }}
                                                className={`h-2 rounded-full transition-all ${currentSlide === index
                                                    ? "bg-primary w-8"
                                                    : "bg-border w-2 hover:bg-muted-foreground"
                                                    }`}
                                                aria-label={`Go to slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={nextSlide}
                                        className="rounded-full w-12 h-12 border-2"
                                        aria-label="Next videos"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-2xl">
                            <Youtube className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-medium text-foreground">No hay videos disponibles</h3>
                            <p className="text-muted-foreground">Visita nuestro canal de YouTube para ver más contenido.</p>
                        </div>
                    )}
                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
                        <Youtube className="w-5 h-5 text-primary" />
                        <span className="text-foreground font-medium">
                            Suscríbete a nuestro canal para más contenido
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}

