"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&h=600&fit=crop",
    alt: "Equipo de locutores en cabina",
    title: "Nuestro Equipo",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop",
    alt: "Estudio de grabación",
    title: "Estudio Principal",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=600&fit=crop",
    alt: "Concierto de adoración",
    title: "Evento de Alabanza",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    alt: "Coro en presentación",
    title: "Ministerio de Música",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=600&fit=crop",
    alt: "Reunión de oración",
    title: "Intercesión",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?w=800&h=600&fit=crop",
    alt: "Equipos de transmisión",
    title: "Tecnología",
  },
]

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }

  const goToPrevious = () => {
    if (selectedImage === null) return
    setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1)
  }

  const goToNext = () => {
    if (selectedImage === null) return
    setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1)
  }

  return (
    <section id="galeria" className="py-20 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Galería
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
            Momentos que Inspiran
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Capturamos los momentos más especiales de nuestra comunidad radial.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => openLightbox(index)}
              className={cn(
                "relative overflow-hidden rounded-2xl group aspect-[4/3]",
                index === 0 && "md:col-span-2 md:row-span-2 md:aspect-square"
              )}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-card font-semibold text-sm md:text-base">
                  {image.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-card hover:text-primary transition-colors"
            aria-label="Cerrar galería"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 p-2 text-card hover:text-primary transition-colors"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 p-2 text-card hover:text-primary transition-colors"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full">
            <img
              src={galleryImages[selectedImage].src || "/placeholder.svg"}
              alt={galleryImages[selectedImage].alt}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              crossOrigin="anonymous"
            />
            <p className="text-center text-card mt-4 text-lg font-semibold">
              {galleryImages[selectedImage].title}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
