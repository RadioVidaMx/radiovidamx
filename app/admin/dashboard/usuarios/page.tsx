"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
    Users,
    Plus,
    Search,
    UserPlus,
    Mail,
    Phone,
    Shield,
    Trash2,
    Loader2,
    CheckCircle2,
    XCircle,
    Pencil
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Profile = {
    id: string
    full_name: string | null
    email: string | null
    role: string
    phone: string | null
    created_at?: string
}

const roles = [
    { id: "admin", label: "Administrador", desc: "Acceso total" },
    { id: "writer", label: "Escritor", desc: "Gestiona sus artículos" },
    { id: "asist", label: "Asistente", desc: "Eventos y Programación" },
    { id: "galery", label: "Galería/Video", desc: "Multimedia" },
    { id: "reader", label: "Lector", desc: "Comentarios y Likes" },
]

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [isEditing, setIsEditing] = useState(false)
    const [editingUserId, setEditingUserId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "reader"
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order("full_name", { ascending: true })

            if (error) throw error
            setUsers(data || [])
        } catch (err: any) {
            console.error("Error fetching users:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError("")
        setSuccess("")

        try {
            if (isEditing && editingUserId) {
                // Modo Edición: Solo rol y teléfono
                const { error: profileError } = await supabase
                    .from("profiles")
                    .update({
                        role: formData.role,
                        phone: formData.phone
                    })
                    .eq("id", editingUserId)

                if (profileError) throw profileError

                setSuccess("Usuario actualizado exitosamente.")
                setTimeout(() => {
                    setIsDialogOpen(false)
                    resetForm()
                }, 1500)
                fetchUsers()
            } else {
                // Modo Creación (Existente)
                const { createClient } = await import('@supabase/supabase-js')
                const tempSupabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    {
                        auth: {
                            persistSession: false,
                            autoRefreshToken: false,
                            detectSessionInUrl: false,
                            storageKey: 'supabase.auth.temp_admin_provisioning'
                        }
                    }
                )

                const { data, error: signUpError } = await tempSupabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.fullName
                        }
                    }
                })

                if (signUpError) throw signUpError

                if (data.user) {
                    const { error: profileError } = await supabase
                        .from("profiles")
                        .upsert({
                            id: data.user.id,
                            full_name: formData.fullName,
                            role: formData.role,
                            phone: formData.phone,
                            email: formData.email
                        })

                    if (profileError) throw profileError

                    setSuccess("Usuario creado exitosamente.")
                    setTimeout(() => {
                        setIsDialogOpen(false)
                        resetForm()
                    }, 1500)
                    fetchUsers()
                }
            }
        } catch (err: any) {
            console.error("User Action Error:", err)
            setError(err.message || "Ocurrió un error al procesar la solicitud.")
        } finally {
            setSaving(false)
        }
    }

    const resetForm = () => {
        setFormData({ fullName: "", email: "", password: "", phone: "", role: "reader" })
        setIsEditing(false)
        setEditingUserId(null)
    }

    const openEditDialog = (user: Profile) => {
        setFormData({
            fullName: user.full_name || "",
            email: user.email || "",
            password: "---", // No se edita por aquí
            phone: user.phone || "",
            role: user.role
        })
        setEditingUserId(user.id)
        setIsEditing(true)
        setIsDialogOpen(true)
    }

    const filteredUsers = users.filter(user =>
        (user.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground">Administra los perfiles y roles de acceso del sistema.</p>
                </div>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Nuevo Usuario
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o correo..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-6 py-4 text-sm font-semibold text-foreground">Nombre</th>
                                <th className="px-6 py-4 text-sm font-semibold text-foreground">Rol</th>
                                <th className="px-6 py-4 text-sm font-semibold text-foreground">Contacto</th>
                                <th className="px-6 py-4 text-sm font-semibold text-foreground">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{user.full_name || "Sin nombre"}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Mail className="w-3 h-3" /> {user.email || "Sin correo"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Shield className={`w-4 h-4 ${user.role === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                    user.role === 'admin' ? "bg-primary/10 text-primary" : "bg-secondary/20 text-secondary-foreground"
                                                )}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="w-3.5 h-3.5" />
                                                {user.phone || "---"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-primary hover:text-primary hover:bg-primary/10"
                                                    onClick={() => openEditDialog(user)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        <Users className="w-10 h-10 mx-auto mb-2 opacity-10" />
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {isEditing ? <Pencil className="w-5 h-5 text-primary" /> : <UserPlus className="w-5 h-5 text-primary" />}
                            {isEditing ? "Editar Usuario" : "Agregar Nuevo Usuario"}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isEditing
                                ? `Modificando los accesos de ${formData.fullName}.`
                                : "Completa los datos para crear una nueva cuenta."
                            }
                        </p>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="grid gap-5 py-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                                <XCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                {success}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Nombre Completo</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Ej: Juan Pérez"
                                autoComplete="name"
                            />
                        </div>

                        {!isEditing && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="userEmail">Correo Electrónico</Label>
                                    <Input
                                        id="userEmail"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="juan@ejemplo.com"
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="tempPassword">Contraseña Temporal</Label>
                                    <Input
                                        id="tempPassword"
                                        name="password"
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="******"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="userPhone">Celular</Label>
                            <Input
                                id="userPhone"
                                name="phone"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="6621234567"
                                autoComplete="tel"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Perfil de Usuario</Label>
                            <Select
                                value={formData.role}
                                onValueChange={val => setFormData({ ...formData, role: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.id}>
                                            <div className="flex flex-col text-left">
                                                <span className="font-medium">{role.label}</span>
                                                <span className="text-[10px] text-muted-foreground">{role.desc}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground min-w-[120px]">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? "Guardar Cambios" : "Crear Usuario")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
