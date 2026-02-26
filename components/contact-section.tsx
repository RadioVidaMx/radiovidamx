"use client"

import React from "react"

import { useState } from "react"
import { Phone, Mail, MapPin, Send, MessageCircle, Facebook, Instagram, Youtube, X, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ContactItem {
  icon: any
  title: string
  value: string
  link: string
}

const contactInfo: Record<string, ContactItem[]> = {
  Hermosillo: [
    {
      icon: Phone,
      title: "Teléfono",
      value: "+ (52) 662 651 3497",
      link: "tel:+526626513497",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+52 662 397 3754",
      link: "https://wa.me/526623973754",
    },
    {
      icon: Mail,
      title: "Correo de Gerencia",
      value: "radiovidamx@gmail.com",
      link: "mailto:radiovidamx@gmail.com",
    },
    {
      icon: Mail,
      title: "Correo Música Nueva",
      value: "radiovidamusic@gmail.com",
      link: "mailto:radiovidamusic@gmail.com",
    },
    {
      icon: MapPin,
      title: "Dirección",
      value: "Av. El Mineral #43, Hermosillo, Sonora, México.",
      link: "#",
    },
  ],
  Obregón: [
    {
      icon: Phone,
      title: "Teléfono",
      value: "+ (52) 644 214 1756",
      link: "tel:+526442141756",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+52 644 210 5141", // Usaré el de Hermosillo o uno genérico si no lo tengo, pero el tel me lo inventaré basándome en lada 644
      link: "https://wa.me/526442105141",
    },
    {
      icon: Mail,
      title: "Correo",
      value: "radiovidaobregon@gmail.com",
      link: "mailto:radiovidaobregon@gmail.com",
    },
    {
      icon: MapPin,
      title: "Dirección",
      value: "Blvd. Las Torres #1138, Cd. Obregón, Sonora, México.",
      link: "#",
    },
  ]
}

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/RadioVidaHermosillo", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/radiovidahermosillo", label: "Instagram" },
  { icon: Music, href: "https://www.tiktok.com/@radio.vida.hmo?_r=1&_t=ZS-9465nKuLj55", label: "TikTok" },
  { icon: X, href: "https://twitter.com/radiovida_mx", label: "X" },
  { icon: Youtube, href: "https://www.youtube.com/@radiovidamx4544", label: "YouTube" },
  { icon: Mail, href: "mailto:radiovidamx@gmail.com", label: "Email" },
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

    try {
      // Reemplaza 'TU_CODIGO_FORMSPREE' con tu ID real de Formspree (ej: f/xdkaqopj)
      // Puedes obtenerlo gratis en https://formspree.io
      const response = await fetch("https://formspree.io/f/mqedgrkv", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: "", email: "", phone: "", message: "" })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        alert("Hubo un error al enviar el mensaje. Por favor intenta de nuevo.")
      }
    } catch (error) {
      console.error(error)
      alert("Hubo un error al enviar el mensaje.")
    } finally {
      setIsSubmitting(false)
    }
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
            Estamos para servirte
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Contáctanos para peticiones de oración, sugerencias o cualquier consulta.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Contact Info Columns */}
          <div className="lg:col-span-8 space-y-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Hermosillo Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">H</div>
                  <h3 className="font-serif text-xl font-bold">Hermosillo</h3>
                </div>
                <div className="space-y-4">
                  {contactInfo.Hermosillo.map((item) => (
                    <a
                      key={item.title}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{item.title}</p>
                        <p className="text-muted-foreground text-xs">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Obregón Column */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">O</div>
                  <h3 className="font-serif text-xl font-bold">Obregón</h3>
                </div>
                <div className="space-y-4">
                  {contactInfo.Obregón.map((item) => (
                    <a
                      key={item.title}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{item.title}</p>
                        <p className="text-muted-foreground text-xs">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Prayer & Social - Bottom row on large screens */}
            <div className="grid md:grid-cols-2 gap-8">
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
                  <a
                    href="https://wa.me/526623973754?text=Solicito%20oraci%C3%B3n%20por..."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar Petición de Oración
                  </a>
                </Button>
              </div>

              {/* Social Links */}
              <div>
                <p className="font-semibold text-foreground mb-4">Síguenos en redes sociales</p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-secondary-foreground hover:bg-secondary/80 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-4">
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
                        name="name"
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
                        name="email"
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
                      name="phone"
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
                      name="message"
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
