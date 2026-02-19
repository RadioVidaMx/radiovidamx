import { Radio, Heart, Facebook, Instagram, Youtube, Mail, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const quickLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#programacion", label: "Programación" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#eventos", label: "Eventos" },
  { href: "/#donaciones", label: "Donaciones" },
  { href: "/#videos", label: "Videos" },
  { href: "/#contacto", label: "Contacto" },
]

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/RadioVidaHermosillo", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/radiovidahermosillo", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/radiovida_mx", label: "Twitter" },
  { icon: Youtube, href: "https://www.youtube.com/@radiovidamx4544", label: "YouTube" },
  { icon: Mail, href: "mailto:radiovidamx@gmail.com", label: "Email" },
]

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <Image
                  src="/logo-radiovida-white.png"
                  alt="Radio Vida"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-xl font-bold block">
                  Radio Vida
                </span>
                <span className="text-sm text-secondary-foreground/70">
                  Música y Palabra que transforma
                </span>
              </div>
            </Link>
            <p className="text-secondary-foreground/80 mb-6 max-w-md">
              Llevando el mensaje de esperanza y fe a través de la música y la
              palabra de Dios desde 2016. Transmitiendo 24/7 para bendecir tu vida.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <div className="space-y-6">
              {/* Hermosillo */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Hermosillo</p>
                <ul className="space-y-1 text-secondary-foreground/80 text-sm">
                  <li>+ (52) 662-326-8356</li>
                  <li>radiovidamx@gmail.com</li>
                  <li>Av. El mineral #43</li>
                  <li>Hermosillo, Sonora</li>
                </ul>
              </div>

              {/* Obregón */}
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Obregón</p>
                <ul className="space-y-1 text-secondary-foreground/80 text-sm">
                  <li>+ (52) 644-413-2646</li>
                  <li>radiovidaobregon@gmail.com</li>
                  <li>Calle Principal #123</li>
                  <li>Cd. Obregón, Sonora</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-foreground/60">
              © {new Date().getFullYear()} Radio Vida. Todos los derechos reservados.
            </p>
            <p className="text-sm text-secondary-foreground/60 flex items-center gap-1">
              Hecho con <Heart className="w-4 h-4 text-primary inline" /> para la gloria de Dios
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
