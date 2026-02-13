"use client"

import React, { useState } from "react"
import { Heart, CreditCard, Phone, MessageCircle, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DonationsSection() {
    const [copied, setCopied] = useState(false)

    const handleCopyClabe = () => {
        navigator.clipboard.writeText("002760702174999900")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section id="donaciones" className="py-20 md:py-32 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                        Donaciones
                    </span>
                    <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
                        Apoya a Radio Vida Hermosillo
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                        Tu generosidad hace posible que se continúe llevando esperanza y fe a miles de hogares.
                    </p>
                </div>

                {/* Bible Verse */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="bg-primary/10 rounded-2xl border border-primary/20 p-6 md:p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-serif text-lg md:text-xl text-foreground italic leading-relaxed mb-2">
                                    "Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre."
                                </p>
                                <p className="text-primary font-semibold">2 Corintios 9:7</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donation Methods */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Bank Transfer Card */}
                    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-foreground">
                                Transferencia Bancaria
                            </h3>
                        </div>

                        <p className="text-muted-foreground mb-6">
                            Puedes realizar un depósito o transferencia a nuestra cuenta Banamex:
                        </p>

                        <div className="bg-background rounded-xl border border-border p-4 mb-4">
                            <p className="text-sm text-muted-foreground mb-2">Cuenta CLABE:</p>
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-mono text-lg font-bold text-foreground">
                                    002760702174999900
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyClabe}
                                    className="shrink-0"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 mr-1" />
                                            Copiado
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-1" />
                                            Copiar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-foreground">Banco:</strong> Banamex
                            </p>
                        </div>
                    </div>

                    {/* Alternative Contact Methods */}
                    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-secondary" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-foreground">
                                Contáctanos
                            </h3>
                        </div>

                        <p className="text-muted-foreground mb-6">
                            Si lo prefieres, puedes contactarnos por teléfono, redes sociales o acudir a nuestras oficinas.
                        </p>

                        <div className="space-y-3">
                            <a
                                href="tel:+526623268356"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Teléfono</p>
                                    <p className="font-semibold text-foreground">+ (52) 662-326-8356</p>
                                </div>
                            </a>

                            <a
                                href="https://wa.me/526623973754"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <MessageCircle className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                                    <p className="font-semibold text-foreground">+52 662 397 3754</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Impact Message */}
                <div className="max-w-3xl mx-auto mt-12">
                    <div className="text-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-6 md:p-8">
                        <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                        <p className="text-foreground text-lg font-semibold">
                            Cada donación, sin importar el monto, nos ayuda a continuar con mantener la transmisión 24/7.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
