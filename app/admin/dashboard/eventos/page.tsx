"use client"

import { useEffect, useState } from "react"
import { supabase, type Event } from "@/lib/supabase"
import {
    Calendar,
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Star,
    MapPin,
    Clock
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { formatDate } from "@/lib/utils"

export default function EventsAdminPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching events:", error)
        } else {
            setEvents(data || [])
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este evento?")) return

        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", id)

        if (error) {
            alert("Error al eliminar el evento")
        } else {
            setEvents(events.filter(e => e.id !== id))
        }
    }

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Gestión de Eventos</h1>
                    <p className="text-muted-foreground">Administra los conciertos, conferencias y retiros.</p>
                </div>
                <Link href="/admin/dashboard/eventos/nuevo">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Evento
                    </Button>
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por título o ubicación..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Events Table/List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-foreground">{event.title}</h3>
                                    {event.featured && (
                                        <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            <Star className="w-3 h-3 fill-current" />
                                            Destacado
                                        </span>
                                    )}
                                    <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        {event.city}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {event.time}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        {event.location}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-center">
                                <Link href={`/admin/dashboard/eventos/${event.id}`}>
                                    <Button variant="outline" size="sm">
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Editar
                                    </Button>
                                </Link>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => handleDelete(event.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-2xl">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-foreground">No se encontraron eventos</h3>
                        <p className="text-muted-foreground">Prueba otra búsqueda o crea un nuevo evento.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
