"use client"

import { useEffect, useState } from "react"
import { supabase, type Program } from "@/lib/supabase"
import {
    Tv,
    Plus,
    Trash2,
    Edit2,
    Clock,
    User,
    Music,
    BookOpen,
    Mic,
    Heart,
    Users,
    ChevronRight,
    Calendar,
    Smile,
    Newspaper,
    Mic2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const days = [
    { id: "lunes", label: "Lunes" },
    { id: "martes", label: "Martes" },
    { id: "miercoles", label: "Miércoles" },
    { id: "jueves", label: "Jueves" },
    { id: "viernes", label: "Viernes" },
    { id: "sabado", label: "Sábado" },
    { id: "domingo", label: "Domingo" },
]

const programIcons = {
    worship: Heart,
    teaching: BookOpen,
    talk: Users,
    prayer: Mic,
    music: Music,
    kids: Smile,
    news: Newspaper,
    voice: Mic2,
}

export default function ScheduleAdminPage() {
    const [activeDay, setActiveDay] = useState("lunes")
    const [programs, setPrograms] = useState<Program[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProgram, setEditingProgram] = useState<Program | null>(null)

    const [formData, setFormData] = useState({
        day: "lunes",
        time: "",
        title: "",
        host: "",
        type: "music" as Program["type"],
        icon: "Music",
        city: "Hermosillo" as "Hermosillo" | "Obregón"
    })

    useEffect(() => {
        fetchPrograms()
    }, [])

    const fetchPrograms = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("programs")
            .select("*")
            .order("time", { ascending: true })

        if (error) {
            console.error("Error fetching programs:", error)
        } else {
            setPrograms(data || [])
        }
        setLoading(false)
    }

    const handleOpenDialog = (program: Program | null = null) => {
        if (program) {
            setEditingProgram(program)
            setFormData({
                day: program.day,
                time: program.time,
                title: program.title,
                host: program.host,
                type: program.type,
                icon: program.icon,
                city: program.city || "Hermosillo"
            })
        } else {
            setEditingProgram(null)
            setFormData({
                day: activeDay,
                time: "",
                title: "",
                host: "",
                type: "music",
                icon: "Music",
                city: "Hermosillo"
            })
        }
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        try {
            if (editingProgram) {
                const { error } = await supabase
                    .from("programs")
                    .update(formData)
                    .eq("id", editingProgram.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from("programs")
                    .insert([formData])
                if (error) throw error
            }

            setIsDialogOpen(false)
            fetchPrograms()
        } catch (error: any) {
            alert("Error al guardar programa: " + error.message)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este programa?")) return

        const { error } = await supabase
            .from("programs")
            .delete()
            .eq("id", id)

        if (error) {
            alert("Error al eliminar")
        } else {
            fetchPrograms()
        }
    }

    const programsByDay = programs.filter(p => p.day === activeDay)

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Programación Semanal</h1>
                    <p className="text-muted-foreground">Administra los programas y horarios de cada día.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Programa
                </Button>
            </div>

            <Tabs defaultValue="lunes" className="w-full" onValueChange={setActiveDay}>
                <div className="flex justify-center items-center mb-8">
                    <TabsList className="bg-muted p-1">
                        {days.map((day) => (
                            <TabsTrigger
                                key={day.id}
                                value={day.id}
                                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 md:px-6"
                            >
                                {day.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {days.map((day) => (
                    <TabsContent key={day.id} value={day.id} className="space-y-4">
                        <div className="bg-card border border-border rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-border bg-muted/30">
                                <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Programación del {day.label}
                                </h3>
                            </div>

                            {loading ? (
                                <div className="p-12 flex justify-center">
                                    <div className="w-6 h-6 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                </div>
                            ) : programsByDay.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {programsByDay.map((program) => {
                                        const Icon = programIcons[program.type] || Music
                                        return (
                                            <div key={program.id} className="flex items-center gap-4 p-4 md:px-6 hover:bg-muted/30 transition-colors group">
                                                <div className="flex-shrink-0 w-16 text-center">
                                                    <span className="font-bold text-primary">{program.time}</span>
                                                </div>
                                                <div className="flex-shrink-0 p-2 bg-secondary/10 rounded-lg">
                                                    <Icon className="w-5 h-5 text-secondary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-foreground truncate">{program.title}</h4>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <User className="w-3 h-3" />
                                                        {program.host}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-secondary uppercase bg-secondary/10 px-1.5 rounded-full w-fit mt-0.5">
                                                        {program.city}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(program)}>
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(program.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground md:hidden" />
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                                    <Tv className="w-10 h-10 mb-2 opacity-20" />
                                    <p>No hay programas registrados para este día.</p>
                                    <Button variant="link" size="sm" className="mt-2 text-primary" onClick={() => handleOpenDialog()}>
                                        Agregar el primero
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Edit/Add Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProgram ? "Editar Programa" : "Nuevo Programa"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="day" className="text-right">Día</Label>
                            <Select
                                value={formData.day}
                                onValueChange={(val) => setFormData({ ...formData, day: val })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecciona día" />
                                </SelectTrigger>
                                <SelectContent>
                                    {days.map(d => (
                                        <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="time" className="text-right">Hora</Label>
                            <Input
                                id="time"
                                placeholder="00:00"
                                className="col-span-3"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Título</Label>
                            <Input
                                id="title"
                                placeholder="Nombre del programa"
                                className="col-span-3"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="host" className="text-right">Locutor</Label>
                            <Input
                                id="host"
                                placeholder="Nombre del locutor"
                                className="col-span-3"
                                value={formData.host}
                                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Tipo</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val: string) => {
                                    const typeToIcon: Record<string, string> = {
                                        worship: "Heart",
                                        teaching: "BookOpen",
                                        talk: "Users",
                                        prayer: "Mic",
                                        music: "Music",
                                        kids: "Smile",
                                        news: "Newspaper",
                                        voice: "Mic2"
                                    }
                                    setFormData({
                                        ...formData,
                                        type: val as Program["type"],
                                        icon: typeToIcon[val] || "Clock"
                                    })
                                }}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecciona tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="worship">Adoración</SelectItem>
                                    <SelectItem value="teaching">Enseñanza</SelectItem>
                                    <SelectItem value="talk">Programa</SelectItem>
                                    <SelectItem value="prayer">Oración</SelectItem>
                                    <SelectItem value="music">Música</SelectItem>
                                    <SelectItem value="kids">Infantil</SelectItem>
                                    <SelectItem value="news">Noticias</SelectItem>
                                    <SelectItem value="voice">Locución</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="city" className="text-right">Ciudad</Label>
                            <Select
                                value={formData.city}
                                onValueChange={(val: any) => setFormData({ ...formData, city: val })}
                            >
                                <SelectTrigger className="col-span-3" id="city">
                                    <SelectValue placeholder="Selecciona Ciudad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Hermosillo">Hermosillo</SelectItem>
                                    <SelectItem value="Obregón">Obregón</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                            {editingProgram ? "Guardar Cambios" : "Crear Programa"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
