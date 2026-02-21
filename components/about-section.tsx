import { Users, BookOpen, Music, Heart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  {
    icon: Music,
    title: "Música de Adoración",
    description: "Selección cuidadosa de música cristiana contemporánea y tradicional que eleva el espíritu.",
  },
  {
    icon: BookOpen,
    title: "Enseñanza Bíblica",
    description: "Prédicas y estudios bíblicos de pastores reconocidos que edifican la fe.",
  },
  {
    icon: Users,
    title: "Comunidad",
    description: "Miles de oyentes conectados por la fe, compartiendo esperanza y amor.",
  },
  {
    icon: Heart,
    title: "Ministerio de Oración",
    description: "Intercesión constante por las necesidades de nuestra audiencia.",
  },
]

export function AboutSection() {
  return (
    <section id="nosotros" className="py-20 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Sobre Nosotros
            </span>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
              Portadora de Buenas Noticias.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground text-pretty">
              Radio Vida Mx es una estación de radio al servicio de la comunidad,
              24 horas al dia, 7 días a la semana. Por medio de la frecuencia de radio,
              internet y las múltiples plataformas de este tiempo, siendo compañia en momentos
              de alegría y consuelo en tiempos difíciles.
            </p>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Con multiples ritmos musicales, llevando contenido de calidad que inspire, enseñe y transforme vidas
              a los confines de la tierra.
            </p>

            <div className="mt-8">
              <Link href="/conocenos/antecedentes">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg group">
                  Leer más
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Mission Statement */}
            <blockquote className="mt-8 pl-6 border-l-4 border-primary">
              <p className="text-xl font-serif italic text-foreground">
                &ldquo;MISION: Compartir un mensaje positivo que contribuya favorablemente
                a nuestra sociedad atravez de la renovación de la mente, alma y corazón. Asimismo,
                ser un puente que logre canalizar los pobremas de nuesta ciudad, con las instituciones correspondientes.&rdquo;
              </p>
            </blockquote>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-background rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
