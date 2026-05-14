import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import QRCode from "react-qr-code"

export default function QRPage() {
    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            <section className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 bg-muted/30">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">
                        Lleva la radio contigo
                    </span>
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
                        Instala nuestra App
                    </h1>
                    <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
                        Escanea este código QR con la cámara de tu celular para abrir la página e instalar la aplicación de Radio Vida Mx.
                    </p>

                    <div className="bg-white p-8 rounded-3xl shadow-xl inline-block border border-border/50">
                        <QRCode
                            value="https://www.radiovidamx.com"
                            size={256}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="H"
                        />
                    </div>
                    
                    <p className="mt-8 text-sm text-muted-foreground font-medium">
                        Apunta la cámara de tu teléfono hacia el código
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    )
}
