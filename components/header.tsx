"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { usePlayer } from "@/contexts/player-context"

const navLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#programacion", label: "Programación" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#eventos", label: "Eventos" },
  { href: "/#donaciones", label: "Donaciones" },
  { href: "/#videos", label: "Videos" },
  { href: "/#contacto", label: "Contacto" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { togglePlay, isPlaying } = usePlayer()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
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
            <Link href="/admin/login">
              <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 hover:text-primary">
                Iniciar Sesión
              </Button>
            </Link>
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
          <div className="lg:hidden py-4 border-t border-border">
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
                <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
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
