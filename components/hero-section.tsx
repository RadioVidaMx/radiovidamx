"use client"

import { Play, Pause, Headphones, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlayer } from "@/contexts/player-context"

export function HeroSection() {
  const { togglePlay, isPlaying } = usePlayer()

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-primary/10" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Transmitiendo en vivo 24/7
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
              Música y Palabra que{" "}
              <span className="text-primary">Transforma</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty">
              Conecta con Dios a través de nuestra programación de adoración,
              prédicas inspiradoras y música que eleva tu espíritu.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={togglePlay}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pausar Radio
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Escuchar Ahora
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all bg-transparent"
                asChild
              >
                <a href="#programacion">Ver Programación</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-foreground">10K+</p>
                <p className="text-sm text-muted-foreground">Oyentes diarios</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Transmisión</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-foreground">15+</p>
                <p className="text-sm text-muted-foreground">Años al aire</p>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Animated Circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute inset-8 flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-secondary/30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
              </div>
              <div className="absolute inset-16 flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-primary/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
              </div>

              {/* Center Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">
                  <Headphones className="w-20 h-20 text-primary-foreground" />
                </div>
              </div>

              {/* Floating Icons */}
              <div className="absolute top-10 right-10 w-16 h-16 bg-card rounded-2xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute bottom-20 left-0 w-14 h-14 bg-secondary rounded-2xl shadow-lg flex items-center justify-center animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                <Play className="w-7 h-7 text-secondary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120V60C240 20 480 0 720 20C960 40 1200 80 1440 60V120H0Z" className="fill-card" />
        </svg>
      </div>
    </section>
  )
}
