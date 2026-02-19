"use client"

import { useState, useEffect } from "react"
import { Clock, Mic, Music, BookOpen, Heart, Users, Loader2, Tv } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase, type Program } from "@/lib/supabase"

const days = [
  { id: "lunes", label: "Lun" },
  { id: "martes", label: "Mar" },
  { id: "miercoles", label: "Mié" },
  { id: "jueves", label: "Jue" },
  { id: "viernes", label: "Vie" },
  { id: "sabado", label: "Sáb" },
  { id: "domingo", label: "Dom" },
]

const iconMap: Record<string, any> = {
  Clock,
  Mic,
  Music,
  BookOpen,
  Heart,
  Users,
}

const typeColors: Record<string, string> = {
  worship: "bg-primary/10 text-primary border-primary/20",
  teaching: "bg-secondary/10 text-secondary border-secondary/20",
  talk: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  prayer: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  music: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
}

export function ScheduleSection() {
  const [selectedDay, setSelectedDay] = useState("lunes")
  const [selectedCity, setSelectedCity] = useState<"Hermosillo" | "Obregón">("Hermosillo")
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .order("time", { ascending: true })

        if (error) throw error
        setPrograms(data || [])
      } catch (error) {
        console.error("Error fetching programs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  const programsByDay = programs.filter((p: Program) => p.day === selectedDay && (p.city === selectedCity || !p.city))


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

        {/* City Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-muted rounded-xl border border-border shadow-sm">
            <button
              onClick={() => setSelectedCity("Hermosillo")}
              className={cn(
                "px-8 py-2.5 text-sm font-bold rounded-lg transition-all",
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
                "px-8 py-2.5 text-sm font-bold rounded-lg transition-all",
                selectedCity === "Obregón"
                  ? "bg-background text-primary shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Obregón
            </button>
          </div>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 min-h-[300px]">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground animate-pulse">Cargando programación...</p>
            </div>
          ) : programsByDay.length > 0 ? (
            programsByDay.map((program: Program, index: number) => {
              const Icon = iconMap[program.icon] || Clock
              return (
                <div
                  key={program.id || index}
                  className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      typeColors[program.type]
                    )}>
                      <Icon className="w-3 h-3 inline mr-1" />
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
              )
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-2xl">
              <Tv className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-medium text-foreground">No hay programas para este día</h3>
              <p className="text-muted-foreground">Pronto actualizaremos nuestra programación.</p>
            </div>
          )}
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
