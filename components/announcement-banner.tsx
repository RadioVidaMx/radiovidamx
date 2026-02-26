"use client"

import React, { useEffect, useState, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { supabase, type Announcement } from "@/lib/supabase"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AnnouncementBanner() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false })
    ])

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const { data, error } = await supabase
                    .from("announcements")
                    .select("*")
                    .eq("active", true)
                    .order("display_order", { ascending: true })

                if (error) throw error
                setAnnouncements(data || [])
            } catch (error) {
                console.error("Error fetching announcements:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAnnouncements()
    }, [])

    if (loading) {
        return (
            <div className="w-full bg-muted/20 py-12 flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    if (announcements.length === 0) {
        return null
    }

    return (
        <section className="bg-background py-8 md:py-12 border-y border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative group">
                    {/* Carousel */}
                    <div className="overflow-hidden rounded-2xl shadow-xl shadow-primary/5" ref={emblaRef}>
                        <div className="flex">
                            {announcements.map((announcement, index) => (
                                <div key={announcement.id} className="flex-[0_0_100%] min-w-0 relative h-[300px] md:h-[450px] bg-muted/30">
                                    {announcement.link_url ? (
                                        <a href={announcement.link_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                                            <AnnouncementSlide announcement={announcement} priority={index === 0} />
                                        </a>
                                    ) : (
                                        <div className="w-full h-full relative">
                                            <AnnouncementSlide announcement={announcement} priority={index === 0} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons - Only if more than 1 announcement */}
                    {announcements.length > 1 && (
                        <>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={scrollPrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={scrollNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>

                            {/* Indicators */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                {announcements.map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-2 h-2 rounded-full bg-white/50 backdrop-blur-sm"
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

function AnnouncementSlide({ announcement, priority }: { announcement: Announcement, priority?: boolean }) {
    return (
        <>
            <img
                src={announcement.image_url}
                alt={announcement.title || "Anuncio"}
                className="w-full h-full object-cover"
                loading={priority ? "eager" : "lazy"}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/logo-radiovida.png";
                    target.classList.add("object-contain", "p-20", "bg-muted");
                }}
            />
            {/* Overlay Gradient */}
            {(announcement.title || announcement.description) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                    <div className="max-w-2xl">
                        {announcement.title && (
                            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2 leading-tight">
                                {announcement.title}
                            </h2>
                        )}
                        {announcement.description && (
                            <p className="text-white/80 text-sm md:text-lg line-clamp-2 md:line-clamp-none">
                                {announcement.description}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
