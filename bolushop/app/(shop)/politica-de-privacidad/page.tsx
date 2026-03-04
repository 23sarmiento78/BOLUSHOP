import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidad | BoluShop Argentina",
    description: "Leé nuestra política de privacidad para conocer cómo protegemos tus datos y qué información recolectamos en BoluShop.",
};

export default function PrivacidadPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-32 pb-20 px-4">
                <article className="max-w-4xl mx-auto bg-white rounded-[2rem] p-8 md:p-16 shadow-sm border border-gray-50">
                    <h1 className="text-4xl font-black mb-8">Política de Privacidad</h1>
                    <p className="text-gray-400 mb-12 text-sm">Última actualización: 4 de marzo de 2026</p>

                    <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introducción</h2>
                            <p>
                                En <strong>BoluShop</strong> (en adelante, "el Sitio"), nos tomamos muy en serio la seguridad y privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos y compartimos su información personal cuando visita nuestro sitio web o realiza una compra.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Información que Recopilamos</h2>
                            <p>Cuando visita el Sitio, recopilamos automáticamente cierta información sobre su dispositivo, incluida información sobre su navegador web, dirección IP, zona horaria y algunas de las cookies instaladas en su dispositivo.</p>
                            <p>Además, cuando realiza una compra o intenta realizar una compra a través del Sitio, recopilamos cierta información suya, como su nombre, dirección de facturación, dirección de envío, información de pago (procesada de forma segura por Mercado Pago), dirección de correo electrónico y número de teléfono.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cómo Utilizamos su Información</h2>
                            <p>Utilizamos la información de los pedidos que recopilamos para:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Procesar los pagos y organizar el envío.</li>
                                <li>Comunicarnos con usted sobre el estado de su pedido.</li>
                                <li>Detectar posibles riesgos o fraudes.</li>
                                <li>Proporcionarle información o publicidad relacionada con nuestros productos o servicios, siempre que haya compartido sus preferencias con nosotros.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies y Tecnologías de Rastreo</h2>
                            <p>
                                Utilizamos cookies para mejorar su experiencia en el sitio. Las cookies nos permiten recordar sus preferencias y entender cómo los usuarios interactúan con nuestra plataforma.
                            </p>
                            <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500 my-6">
                                <p className="text-sm font-bold text-blue-800 mb-2">Publicidad de Terceros (Google AdSense)</p>
                                <p className="text-sm text-blue-700">
                                    Utilizamos proveedores externos, como Google, que usan cookies para publicar anuncios basados en las visitas anteriores de un usuario a nuestro sitio web u otros sitios web. El uso que Google hace de las cookies publicitarias permite que tanto Google como sus socios publiquen anuncios basados en las visitas de los usuarios a sus sitios o a otros sitios de Internet.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Compartir su Información Personal</h2>
                            <p>Compartimos su información personal con terceros para que nos ayuden a utilizarla, como se describe anteriormente. Por ejemplo:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Utilizamos <strong>Supabase</strong> para gestionar nuestra base de datos dinámica.</li>
                                <li>Utilizamos <strong>Mercado Pago</strong> para procesar sus transacciones de forma segura.</li>
                                <li>Utilizamos <strong>Google Analytics</strong> para ayudarnos a comprender cómo nuestros clientes usan el Sitio.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Seguridad de los Datos</h2>
                            <p>Tomamos todas las medidas razonables para proteger su información personal. Sus datos de pago están cifrados y se procesan a través de pasarelas seguras. Nunca almacenamos los datos de su tarjeta de crédito en nuestros servidores.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sus Derechos</h2>
                            <p>Si usted es residente en Argentina, tiene derecho a acceder a la información personal que tenemos sobre usted y a solicitar que su información personal sea corregida, actualizada o eliminada.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cambios</h2>
                            <p>Podemos actualizar esta política de privacidad periódicamente para reflejar, por ejemplo, cambios en nuestras prácticas o por otras razones operativas, legales o reglamentarias.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contacto</h2>
                            <p>Para obtener más información sobre nuestras prácticas de privacidad, si tiene preguntas o si desea presentar una queja, contáctenos por correo electrónico a <strong>sarmientoisrael118@gmail.com</strong>.</p>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
