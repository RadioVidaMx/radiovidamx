import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const events = [
  {
    id: 1,
    title: "Concierto de Adoración",
    date: "15 de Marzo, 2026",
    time: "7:00 PM",
    location: "Auditorio Central",
    description: "Una noche especial de alabanza y adoración con artistas invitados.",
    featured: true,
  },
  {
    id: 2,
    title: "Conferencia de Fe",
    date: "22 de Marzo, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Centro de Convenciones",
    description: "Fortalece tu fe con enseñanzas poderosas de reconocidos pastores.",
    featured: false,
  },
  {
    id: 3,
    title: "Retiro de Jóvenes",
    date: "5-7 de Abril, 2026",
    time: "Todo el día",
    location: "Campamento Monte Sión",
    description: "Un fin de semana de conexión, diversión y crecimiento espiritual.",
    featured: false,
  },
  {
    id: 4,
    title: "Aniversario 16 años",
    date: "20 de Mayo, 2026",
    time: "6:00 PM",
    location: "Iglesia Central",
    description: "Celebremos juntos 16 años llevando el mensaje de esperanza.",
    featured: true,
  },
]

export function EventsSection() {
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
            Únete a nuestros eventos especiales y sé parte de nuestra comunidad.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className={`relative bg-card rounded-2xl border overflow-hidden hover:shadow-xl transition-all group ${event.featured
                  ? "border-primary/30 shadow-lg"
                  : "border-border hover:border-primary/20"
                }`}
            >
              {event.featured && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Destacado
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
                >
                  Más Información
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Subscribe */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-muted rounded-2xl w-full max-w-2xl mx-auto">
            <div className="text-center sm:text-left flex-1">
              <p className="font-semibold text-foreground">¿No quieres perderte ningún evento?</p>
              <p className="text-sm text-muted-foreground">Suscríbete para recibir notificaciones</p>
            </div>
            <form
              action="https://formspree.io/f/xvzbglke"
              method="POST"
              className="flex w-full sm:w-auto gap-2"
            >
              <input
                type="email"
                name="email"
                placeholder="Tu correo electrónico"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[200px]"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
                <Calendar className="w-4 h-4 mr-2" />
                Suscribirse
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
