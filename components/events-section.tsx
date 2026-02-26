"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Clock, ArrowRight, Loader2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase, type Event } from "@/lib/supabase"

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedCity, setSelectedCity] = useState<"Hermosillo" | "Obregón">("Hermosillo")
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("display_order", { ascending: true })

        if (error) throw error
        setEvents(data || [])
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("https://formspree.io/f/mqedgrkv", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setSubmitted(true)
        setEmail("")
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert("Hubo un error al suscribirse. Por favor intenta de nuevo.")
      }
    } catch (error) {
      console.error(error)
      alert("Hubo un error al suscribirse.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredEvents = events.filter(e => e.city === selectedCity || !e.city)

  return (
    <section id="eventos" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Eventos
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
            Calendario de Eventos
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Únete a nuestros eventos especiales y se parte de nuestra comunidad.
          </p>
        </div>

        {/* City Selector */}
        <div className="flex justify-center mb-12">
          <div className="flex p-1 bg-muted rounded-xl border border-border shadow-sm">
            <button
              onClick={() => setSelectedCity("Hermosillo")}
              className={cn(
                "px-10 py-3 text-sm font-bold rounded-lg transition-all",
                selectedCity === "Hermosillo"
                  ? "bg-background text-primary shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Hermosillo
            </button>
            <button
              onClick={() => setSelectedCity("Obregón")}
              className={cn(
                "px-10 py-3 text-sm font-bold rounded-lg transition-all",
                selectedCity === "Obregón"
                  ? "bg-background text-primary shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Obregón
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="min-h-[600px] relative">
          <div className="grid md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground animate-pulse">Cargando eventos...</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`relative bg-card rounded-2xl border overflow-hidden hover:shadow-xl transition-all group ${event.featured
                    ? "border-primary/30 shadow-lg"
                    : "border-border hover:border-primary/20"
                    }`}
                >
                  {event.featured && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                      Destacado
                    </div>
                  )}

                  {/* Event Image */}
                  {event.image_url && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="p-6 md:p-8">
                    {/* Date Badge */}
                    <div className="flex items-center gap-2 text-primary mb-4">
                      <Calendar className="w-5 h-5" />
                      <span className="font-semibold">{event.date}</span>
                    </div>

                    <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-muted-foreground mb-4">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-secondary" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-secondary" />
                        {event.location}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="group/btn border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
                      asChild={!!event.link}
                    >
                      {event.link ? (
                        <a href={event.link} target="_blank" rel="noopener noreferrer">
                          Más Información
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <>
                          Más Información
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-2xl">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-medium text-foreground">No hay eventos próximos</h3>
                <p className="text-muted-foreground">Vuelve pronto para ver nuestras próximas actividades.</p>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Subscribe */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-muted rounded-2xl w-full max-w-2xl mx-auto">
            {submitted ? (
              <div className="text-center w-full py-2">
                <p className="font-semibold text-primary">¡Gracias por suscribirte!</p>
                <p className="text-sm text-muted-foreground">Te mantendremos informado sobre nuestros eventos.</p>
              </div>
            ) : (
              <>
                <div className="text-center sm:text-left flex-1">
                  <p className="font-semibold text-foreground">¿No quieres perderte ningún evento?</p>
                  <p className="text-sm text-muted-foreground">Suscríbete para recibir notificaciones</p>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full sm:w-auto gap-2"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Tu correo electrónico"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[200px]"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Calendar className="w-4 h-4 mr-2" />
                    )}
                    Suscribirse
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
