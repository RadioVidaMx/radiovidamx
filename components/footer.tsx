import { Radio, Heart, Facebook, Instagram, Youtube, Mail } from "lucide-react"

const quickLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#programacion", label: "Programación" },
  { href: "#galeria", label: "Galería" },
  { href: "#eventos", label: "Eventos" },
  { href: "#contacto", label: "Contacto" },
]

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Mail, href: "mailto:contacto@radioluzdivina.com", label: "Email" },
]

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#inicio" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Radio className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold block">
                  Radio Luz Divina
                </span>
                <span className="text-sm text-secondary-foreground/70">
                  Música que transforma
                </span>
              </div>
            </a>
            <p className="text-secondary-foreground/80 mb-6 max-w-md">
              Llevando el mensaje de esperanza y fe a través de la música y la 
              palabra de Dios desde 2009. Transmitiendo 24/7 para bendecir tu vida.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
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
                  <a
                    href={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li>+1 (555) 123-4567</li>
              <li>contacto@radioluzdivina.com</li>
              <li>Calle Principal #123</li>
              <li>Ciudad, País</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-foreground/60">
              © {new Date().getFullYear()} Radio Luz Divina. Todos los derechos reservados.
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
