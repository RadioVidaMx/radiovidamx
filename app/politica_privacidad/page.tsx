import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PoliticaPrivacidadPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Hero Header */}
            <section className="pt-32 pb-16 bg-muted/30 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                        Legal
                    </span>
                    <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                        Política de Privacidad de Radio Vida Mx
                    </h1>
                    <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                        Última actualización: 13 de mayo de 2026
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
                        
                        <p className="text-xl font-medium text-foreground leading-relaxed">
                            En Radio Vida Mx, accesible desde www.radiovidamx.com, la privacidad de nuestros oyentes y visitantes es una de nuestras mayores prioridades. Este documento explica detalladamente qué tipo de información recopilamos, cómo la utilizamos y las opciones que tienes al respecto.
                        </p>

                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">1. Información que Recopilamos</h2>
                            <p className="mb-4">Cuando interactúas con nuestro sitio web, recolectamos datos de dos formas:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Datos que nos proporcionas directamente:</strong> A través de nuestros formularios de registro para eventos especiales o para participar en nuestro foro de artículos, recopilamos tu nombre, correo electrónico y número de teléfono celular.</li>
                                <li><strong>Datos de interacción:</strong> Cuando creas una cuenta en nuestro foro, recopilamos los comentarios que dejas en las publicaciones y los "likes" que otorgas.</li>
                                <li><strong>Datos automáticos:</strong> Para el correcto funcionamiento de las dos señales de streaming simultáneo (Hermosillo y Obregón), nuestro servidor registra datos técnicos básicos como tu dirección IP, tipo de navegador y el tiempo de conexión a la transmisión.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">2. Uso de la Información</h2>
                            <p className="mb-4">Utilizamos la información recolectada estrictamente para los siguientes propósitos:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Transmitir las señales de audio digital 24/7 sin interrupciones técnicas.</li>
                                <li>Enviar información, invitaciones y actualizaciones sobre nuestros eventos especiales a través de tu correo o número celular.</li>
                                <li>Gestionar y moderar de forma segura el foro de artículos, permitiendo que visualices tus comentarios y likes.</li>
                                <li>Monitorear el rendimiento de la web y el número de oyentes conectados en cada estación.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">3. Compartición de Datos y Enlaces a Terceros</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Redes Sociales y Streaming Externo:</strong> Nuestro sitio web incluye enlaces a nuestras redes sociales oficiales y plataformas de video. Al hacer clic en estos enlaces o interactuar con las entrevistas grabadas y las transmisiones de YouTube Live, dichas plataformas de terceros (como YouTube, Facebook o Instagram) pueden recopilar sus propios datos bajo sus respectivas políticas de privacidad.</li>
                                <li><strong>No Comercialización:</strong> Radio Vida Mx no vende, alquila ni comparte tu información personal con empresas de publicidad de terceros.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">4. Seguridad de los Datos</h2>
                            <p>
                                Implementamos medidas de seguridad técnicas para proteger tu nombre, correo y celular contra accesos no autorizados, pérdidas o alteraciones. El acceso al foro está restringido para garantizar un entorno comunitario seguro.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">5. Tus Derechos (Acceso, Rectificación y Eliminación)</h2>
                            <p className="mb-4">Tienes el derecho en cualquier momento de:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Saber qué datos tenemos sobre ti.</li>
                                <li>Pedir que corrijamos información incorrecta.</li>
                                <li>Solicitar la eliminación total de tus datos de nuestra base de envíos de eventos o borrar tu perfil del foro.</li>
                            </ul>
                            <p className="mt-4">
                                Para ejercer estos derechos, puedes escribirnos directamente a nuestro correo de contacto: <a href="mailto:radiovidamx@gmail.com" className="text-primary hover:underline">radiovidamx@gmail.com</a>.
                            </p>
                        </div>

                        <div className="bg-primary/5 border-l-4 border-primary p-8 rounded-r-2xl my-12">
                            <h2 className="text-2xl font-bold text-foreground mb-4">6. Aceptación de estos Términos</h2>
                            <p className="text-lg text-foreground leading-relaxed">
                                Al utilizar nuestro sitio web, escuchar nuestras estaciones de Hermosillo u Obregón, o registrarte en nuestros formularios, aceptas los términos descritos en esta Política de Privacidad.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
