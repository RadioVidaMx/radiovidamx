import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RadioPlayer } from "@/components/radio-player"

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
                            Radio Vida MX es una estación de radio al servicio de la comunidad, 24/7. Por medio de la frecuencia de Radio, internet y las múltiples plataformas de este tiempo.
                        </p>

                        <p>
                            Es un proyecto de comunicación cristiana fundado por Francisco Elmer Santacruz y Elia Moreno, que oficialmente inició sus transmisiones en Octubre de 2010 en Tucson, Arizona, E.U. Nació como una emisora con visión de Reino, enfocada en compartir un mensaje de fe, esperanza y valores que fortalecen a la familia y a la comunidad.
                        </p>

                        <p>
                            Con el paso del tiempo, la visión se expandió a México, iniciando Radio Vida Hermosillo en Agosto del 2016 y, posteriormente Radio Vida Obregón en Diciembre del 2019, consolidando una red de comunicación cristiana con presencia regional y alcance internacional a través de plataformas digitales.
                        </p>

                        <p>
                            Durante la etapa de administración de Radio Vida México, bajo la dirección de sus fundadores, se contó con la valiosa colaboración del Ing. Jorge Mozo y la Lic. Gissel Noriega de Mozo, quienes fueron pieza clave en el fortalecimiento operativo y en el cumplimiento de la misión del Proyecto.
                        </p>

                        <p>
                            A partir de Enero del 2025, Radio Vida comienza una etapa novedosa de crecimiento y proyección, bajo la dirección general del Lic. Daniel Esteban Moreno González y la Lic. Mariana Germán López, consolidándose como un medio de comunicación al servicio de la comunidad. Esta nueva etapa continúa con una programación que integra música, entrevistas, cobertura de eventos, promoción y publicidad; transmitiendo un mensaje positivo y edificante y, fortaleciendo su presencia en redes sociales y plataformas digitales.
                        </p>

                        <p>
                            La administración local está a cargo de la Lic. Claribell Eliana López Robles en Hermosillo, Son. y la Lic. Claudia Manzanares en Cd. Obregón, Son., laborando junto a un equipo comprometido con la excelencia y la expansión del Proyecto.
                        </p>

                        <p>
                            Hoy por hoy, Radio Vida continúa avanzando con un propósito claro: comunicar, informar, educar y entretener a través de contenidos cristianos en servicio tanto para el creyente, como al público en general.
                        </p>

                        <div className="bg-primary/5 border-l-4 border-primary p-8 rounded-r-2xl my-12">
                            <p className="text-xl font-serif italic text-foreground leading-relaxed">
                                Radio Vida es única en su género, llegando a impactar ambas ciudades con el mismo formato establecido, siendo pioneras en el Estado de Sonora, consolidándonos como la gran familia Radio Vida, ¡hasta el día de hoy!, misma que seguirá extendiendo con un solo propósito, la salvación de las almas por medio del Evangelio de nuestro Señor y Salvador JESUCRISTO, la única razón que nos motiva a seguir esforzándonos cada día para dar lo mejor.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <p className="text-lg italic font-serif text-foreground">
                                &ldquo;Id y predicar el evangelio a toda criatura&rdquo; - <span className="text-primary font-bold">Marcos 16:15 (RVR1960)</span>
                            </p>
                            <p className="text-lg italic font-serif text-foreground">
                                &ldquo;Ensancha el sitio de tu tienda, y las cortinas de tus habitaciones sean extendidas; no seas escasa; alarga tus cuerdas, y refuerza tus estacas. Porque te extenderás a la mano derecha y a la mano izquierda; y tu descendencia heredará naciones...&rdquo; - <span className="text-primary font-bold">Isaías 54:2-3 (RVR1960)</span>
                            </p>
                        </div>

                        <p className="pt-8">
                            Radio Vida se prepara con fe y confianza para expandirse y conquistar nuevos corazones, alcanzando nuevas generaciones, repoblando con el Evangelio de Cristo, tierras desoladas, llevando a esos hogares, vida, esperanza y restauración, abrazando el cumplimiento de las promesas de un legado espiritual heredado hace más de dos mil años, en la cruz del calvario.
                        </p>

                        <p className="text-foreground font-semibold">
                            Te invitamos a ser parte de la familia de Radio Vida. ¡Escúchanos y compártenos en las redes sociales y en las diferentes plataformas digitales...!
                        </p>

                        <p className="text-primary font-bold bg-primary/10 inline-block px-4 py-2 rounded-lg">
                            ¡Sé parte de nuestra misión! A través de la música, programas y contenidos edificantes, llevamos la semilla de la palabra de Dios a los confines de la tierra. ¡Somos la estación que da vida, Radio Vida!
                        </p>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
