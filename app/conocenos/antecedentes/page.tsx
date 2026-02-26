import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AntecedentesPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Hero Header */}
            <section className="pt-32 pb-16 bg-muted/30 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                        Nuestra Historia
                    </span>
                    <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                        Antecedentes
                    </h1>
                    <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                        Un legado de fe y comunicación al servicio de la comunidad.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">

                        <p className="text-xl font-medium text-foreground leading-relaxed">
                            Radio Vida MX es una estación de radio al servicio de la comunidad, 24/7, por medio de la frecuencia de Radio, internet y las múltiples plataformas de este tiempo.
                        </p>

                        <p>
                            Es un proyecto de comunicación fundado por el matrimonio Francisco Elmer Santacruz y Elia Moreno. Oficialmente inició sus transmisiones en Octubre de 2010 en Tucson, Arizona, E.U. Nació como una emisora, enfocada en compartir un mensaje de fe, amor, paz y esperanza, un conjunto de valores que fortalecen a la familia y a la comunidad.
                        </p>

                        <p>
                            Con el paso del tiempo, la visión se expandió a México, iniciando con Radio Vida Hermosillo en Agosto de 2016 y posteriormente Radio Vida Obregón en Diciembre de 2019, consolidando una red de comunicación con presencia regional y alcance internacional a través de plataformas digitales.
                        </p>

                        <p>
                            Durante la etapa de administración de Radio Vida Mx, bajo la dirección de sus fundadores, se contó con la valiosa colaboración del Ing. Jorge Daniel Mozo González y la Lic. Gissel Noriega de Mozo, quienes fueron pieza clave en el fortalecimiento operativo y en el cumplimiento de la misión del proyecto.
                        </p>

                        <p>
                            A partir de Enero del 2025, Radio Vida Mx comienza una etapa  de crecimiento y proyección, bajo la dirección general del Lic. Daniel Esteban Moreno González y la Lic. Mariana Germán López, consolidándose como un medio de comunicación al servicio de la comunidad. Esta nueva etapa continúa con una programación que integra música, entrevistas, cobertura de eventos, programas y más; transmitiendo un mensaje positivo y edificante, fortaleciendo su presencia en redes sociales y plataformas digitales.
                        </p>

                        <p>
                            La administración en Hermosillo, Sonora está a cargo de la Lic. Claribell Eliana López Robles y en Cd. Obregon, Sonora por la Lic. Claudia Esthela Manzanares Villegas, laborando junto a un equipo de voluntarios comprometido con la excelencia y la expansión del proyecto.
                        </p>

                        <p>
                            Hoy por hoy, Radio Vida Mx continúa con un propósito claro: comunicar, informar, educar y entretener a través de contenidos de calidad que inspiren, enseñen y transformen vidas.
                        </p>

                        <div className="bg-primary/5 border-l-4 border-primary p-8 rounded-r-2xl my-12">
                            <p className="text-xl font-serif italic text-foreground leading-relaxed">
                                Radio Vida Mx es única en su género, impacta ambas ciudades, siendo pioneras en el Estado de Sonora, consolidándose como la gran familia Radio Vida Mx, misma que se seguirá extendiendose con un sólo propósito, ser portadora de BUENAS NOTICIAS, ser la estación que da vida.
                            </p>
                        </div>

                        <p className="text-foreground font-semibold">
                            Te invitamos a ser parte de la familia de Radio Vida Mx. ¡Escúchanos y compártenos en las redes sociales y en las diferentes plataformas digitales!
                        </p>

                        <p className="text-primary font-bold bg-primary/10 inline-block px-4 py-2 rounded-lg">
                            ¡Se parte de nuestra misión! llevando las Buenas Noticias a los confines de la tierra, a través de la música, programas y contenidos edificantes. ¡Somos la estación que da vida, Radio Vida!
                        </p>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
