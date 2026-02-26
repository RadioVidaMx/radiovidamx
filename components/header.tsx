"use client"
import { useState, useEffect } from "react"
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { usePlayer } from "@/contexts/player-context"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useAnchorScroll } from "@/hooks/use-anchor-scroll"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#programacion", label: "Programación" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#eventos", label: "Eventos" },
  { href: "/#donaciones", label: "Donaciones" },
  { href: "/#contacto", label: "Contacto" },
  { href: "/#videos", label: "Videos" },
  { href: "/articulos", label: "Artículos" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { togglePlay, isPlaying } = usePlayer()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  useAnchorScroll()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        setUser(authUser)
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single()
        setProfile(userProfile)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user)
        supabase.from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setProfile(data))
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/logo-radiovida.png"
              alt="Radio Vida Logo"
              width={180}
              height={90}
              className="h-16 md:h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3 hover:bg-muted group max-w-[200px]">
                    <User className="w-5 h-5 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="text-sm font-medium truncate">Hola, {profile?.full_name?.split(' ')[0] || 'Usuario'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground border-b mb-1">
                    {user.email}
                  </div>
                  {profile?.role !== 'reader' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="flex items-center cursor-pointer">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Panel de Control
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/admin/login">
                <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:text-primary">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
            <Button
              onClick={togglePlay}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              {isPlaying ? "Pausar Radio" : "Escuchar Ahora"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border max-h-[calc(100vh-80px)] overflow-y-auto pb-32">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 px-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 bg-muted rounded-lg mb-2">
                      <p className="text-xs text-muted-foreground">Sesión iniciada como:</p>
                      <p className="text-sm font-bold truncate">{profile?.full_name || user.email}</p>
                    </div>
                    {profile?.role !== 'reader' && (
                      <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Panel de Control
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={() => {
                    togglePlay()
                    setIsOpen(false)
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isPlaying ? "Pausar Radio" : "Escuchar Ahora"}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
