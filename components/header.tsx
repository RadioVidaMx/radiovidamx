"use client"

import { useState } from "react"
import { Menu, X, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#programacion", label: "Programación" },
  { href: "#galeria", label: "Galería" },
  { href: "#eventos", label: "Eventos" },
  { href: "#contacto", label: "Contacto" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Radio className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-bold text-foreground leading-tight">
                Radio Luz Divina
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Música que transforma
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Escuchar Ahora
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
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 px-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Escuchar Ahora
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
