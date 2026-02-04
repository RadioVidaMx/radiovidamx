"use client"

import { useState } from "react"
import { Clock, Mic, Music, BookOpen, Heart, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const days = [
  { id: "lunes", label: "Lun" },
  { id: "martes", label: "Mar" },
  { id: "miercoles", label: "Mié" },
  { id: "jueves", label: "Jue" },
  { id: "viernes", label: "Vie" },
  { id: "sabado", label: "Sáb" },
  { id: "domingo", label: "Dom" },
]

const schedule: Record<string, Array<{
  time: string
  title: string
  host: string
  icon: typeof Clock
  type: "worship" | "teaching" | "talk" | "prayer" | "music"
}>> = {
  lunes: [
    { time: "06:00", title: "Amanecer con Dios", host: "Pastor Miguel", icon: BookOpen, type: "worship" },
    { time: "09:00", title: "Música de Adoración", host: "DJ Samuel", icon: Music, type: "music" },
    { time: "12:00", title: "Palabra al Mediodía", host: "Pastora Elena", icon: Mic, type: "teaching" },
    { time: "15:00", title: "Tarde de Alabanza", host: "Coro Emmanuel", icon: Music, type: "music" },
    { time: "18:00", title: "Estudio Bíblico", host: "Pastor David", icon: BookOpen, type: "teaching" },
    { time: "21:00", title: "Oración de la Noche", host: "Ministerio de Intercesión", icon: Heart, type: "prayer" },
  ],
  martes: [
    { time: "06:00", title: "Devocional Matutino", host: "Hna. María", icon: Heart, type: "worship" },
    { time: "09:00", title: "Clásicos Cristianos", host: "DJ Daniel", icon: Music, type: "music" },
    { time: "12:00", title: "Fe en Acción", host: "Pastor Roberto", icon: Users, type: "talk" },
    { time: "15:00", title: "Música Contemporánea", host: "DJ Samuel", icon: Music, type: "music" },
    { time: "18:00", title: "Jóvenes en Cristo", host: "Líder Andrés", icon: Users, type: "talk" },
    { time: "21:00", title: "Reflexiones Nocturnas", host: "Pastora Ana", icon: BookOpen, type: "teaching" },
  ],
  miercoles: [
    { time: "06:00", title: "Amanecer con Dios", host: "Pastor Miguel", icon: BookOpen, type: "worship" },
    { time: "09:00", title: "Himnos de Fe", host: "Coro Celestial", icon: Music, type: "music" },
    { time: "12:00", title: "Mujer Virtuosa", host: "Pastora Elena", icon: Heart, type: "talk" },
    { time: "15:00", title: "Alabanza sin Límites", host: "DJ Samuel", icon: Music, type: "music" },
    { time: "18:00", title: "Culto en Vivo", host: "Iglesia Central", icon: Users, type: "worship" },
    { time: "21:00", title: "Oración Familiar", host: "Ministerio de Intercesión", icon: Heart, type: "prayer" },
  ],
  jueves: [
    { time: "06:00", title: "Palabra de Vida", host: "Pastor David", icon: BookOpen, type: "teaching" },
    { time: "09:00", title: "Música que Sana", host: "DJ Daniel", icon: Music, type: "music" },
    { time: "12:00", title: "Testimonios de Fe", host: "Hna. Carmen", icon: Heart, type: "talk" },
    { time: "15:00", title: "Adoración Instrumental", host: "Orquesta Sión", icon: Music, type: "music" },
    { time: "18:00", title: "Discipulado", host: "Pastor Roberto", icon: BookOpen, type: "teaching" },
    { time: "21:00", title: "Vigilias de Poder", host: "Ministerio de Intercesión", icon: Heart, type: "prayer" },
  ],
  viernes: [
    { time: "06:00", title: "Comenzando con Fe", host: "Hna. María", icon: Heart, type: "worship" },
    { time: "09:00", title: "Mix de Alabanza", host: "DJ Samuel", icon: Music, type: "music" },
    { time: "12:00", title: "Palabra al Mediodía", host: "Pastora Elena", icon: Mic, type: "teaching" },
    { time: "15:00", title: "Viernes de Fiesta", host: "Coro Emmanuel", icon: Music, type: "music" },
    { time: "18:00", title: "Preparándonos para el Domingo", host: "Pastor Miguel", icon: BookOpen, type: "teaching" },
    { time: "21:00", title: "Noche de Adoración", host: "Ministerio de Alabanza", icon: Music, type: "worship" },
  ],
  sabado: [
    { time: "07:00", title: "Buenos Días Familia", host: "Familia Rodríguez", icon: Users, type: "talk" },
    { time: "10:00", title: "Escuela Bíblica", host: "Pastor David", icon: BookOpen, type: "teaching" },
    { time: "13:00", title: "Música para el Alma", host: "DJ Daniel", icon: Music, type: "music" },
    { time: "16:00", title: "Tarde Juvenil", host: "Líder Andrés", icon: Users, type: "talk" },
    { time: "19:00", title: "Sábado de Alabanza", host: "Coro Celestial", icon: Music, type: "worship" },
    { time: "22:00", title: "Meditación Nocturna", host: "Pastora Ana", icon: Heart, type: "prayer" },
  ],
  domingo: [
    { time: "06:00", title: "Amanecer Dominical", host: "Hna. María", icon: Heart, type: "worship" },
    { time: "09:00", title: "Servicio en Vivo", host: "Iglesia Central", icon: Users, type: "worship" },
    { time: "12:00", title: "Mensaje del Pastor", host: "Pastor Miguel", icon: Mic, type: "teaching" },
    { time: "15:00", title: "Música de Bendición", host: "DJ Samuel", icon: Music, type: "music" },
    { time: "18:00", title: "Culto Vespertino", host: "Iglesia Central", icon: Users, type: "worship" },
    { time: "21:00", title: "Cerrando la Semana con Dios", host: "Pastor David", icon: BookOpen, type: "prayer" },
  ],
}

const typeColors = {
  worship: "bg-primary/10 text-primary border-primary/20",
  teaching: "bg-secondary/10 text-secondary border-secondary/20",
  talk: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  prayer: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  music: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
}

export function ScheduleSection() {
  const [selectedDay, setSelectedDay] = useState("lunes")

  return (
    <section id="programacion" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Programación
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
            Nuestra Programación Semanal
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Contenido variado las 24 horas del día, los 7 días de la semana.
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 bg-muted p-1 rounded-full">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap",
                  selectedDay === day.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                )}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedule[selectedDay].map((program, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border",
                  typeColors[program.type]
                )}>
                  <program.icon className="w-3 h-3 inline mr-1" />
                  {program.type === "worship" && "Adoración"}
                  {program.type === "teaching" && "Enseñanza"}
                  {program.type === "talk" && "Programa"}
                  {program.type === "prayer" && "Oración"}
                  {program.type === "music" && "Música"}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{program.time}</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                {program.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {program.host}
              </p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-3 h-3 rounded-full bg-primary" />
            Adoración
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            Enseñanza
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            Programa
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            Oración
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            Música
          </div>
        </div>
      </div>
    </section>
  )
}
