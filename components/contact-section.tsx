"use client"

import React from "react"

import { useState } from "react"
import { Phone, Mail, MapPin, Send, MessageCircle, Facebook, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const contactInfo = [
  {
    icon: Phone,
    title: "Teléfono",
    value: "+1 (555) 123-4567",
    link: "tel:+15551234567",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+1 (555) 123-4567",
    link: "https://wa.me/15551234567",
  },
  {
    icon: Mail,
    title: "Correo",
    value: "contacto@radioluzdivina.com",
    link: "mailto:contacto@radioluzdivina.com",
  },
  {
    icon: MapPin,
    title: "Dirección",
    value: "Calle Principal #123, Ciudad",
    link: "#",
  },
]

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: "", email: "", phone: "", message: "" })
    
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section id="contacto" className="py-20 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Contacto
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
            Estamos para Servirte
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Contáctanos para peticiones de oración, sugerencias o cualquier consulta.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <a
                  key={item.title}
                  href={item.link}
                  className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-muted-foreground text-sm">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <p className="font-semibold text-foreground mb-4">Síguenos en redes sociales</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Prayer Request */}
            <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20">
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                ¿Necesitas Oración?
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Nuestro equipo de intercesión está disponible para orar por ti y tu familia.
              </p>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                asChild
              >
                <a href="https://wa.me/15551234567?text=Solicito%20oraci%C3%B3n%20por...">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar Petición de Oración
                </a>
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-background p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="font-serif text-xl font-bold text-foreground mb-6">
                Envíanos un Mensaje
              </h3>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-xl text-foreground mb-2">
                    ¡Mensaje Enviado!
                  </h4>
                  <p className="text-muted-foreground">
                    Gracias por contactarnos. Te responderemos pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono (opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      placeholder="Escribe tu mensaje aquí..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
