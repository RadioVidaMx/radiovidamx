"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase, type GalleryImage } from "@/lib/supabase"

export function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    async function fetchImages() {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("display_order", { ascending: true })

        if (error) throw error
        setImages(data || [])
      } catch (error) {
        console.error("Error fetching gallery images:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

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
    setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
  }

  const goToNext = () => {
    if (selectedImage === null) return
    setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
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
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground animate-pulse">Cargando galería...</p>
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {images.map((image, index) => (
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
                    alt={image.alt || image.title || "Imagen de galería"}
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
          ) : (
            <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-2xl">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-medium text-foreground">No hay fotos en la galería</h3>
              <p className="text-muted-foreground">Vuelve pronto para ver nuevos momentos.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-card hover:text-primary transition-colors"
            aria-label="Cerrar galería"
          >
            <X className="w-8 h-8" />
          </button>

          {images.length > 1 && (
            <>
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
            </>
          )}

          <div className="max-w-4xl w-full">
            <img
              src={images[selectedImage].src || "/placeholder.svg"}
              alt={images[selectedImage].alt || images[selectedImage].title || "Imagen a pantalla completa"}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              crossOrigin="anonymous"
            />
            <p className="text-center text-card mt-4 text-lg font-semibold">
              {images[selectedImage].title}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
