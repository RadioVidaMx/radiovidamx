import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ScheduleSection } from "@/components/schedule-section"
import { GallerySection } from "@/components/gallery-section"
import { EventsSection } from "@/components/events-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { RadioPlayer } from "@/components/radio-player"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ScheduleSection />
      <GallerySection />
      <EventsSection />
      <ContactSection />
      <Footer />
      <RadioPlayer />
    </main>
  )
}
