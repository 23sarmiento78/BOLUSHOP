import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";

export default function PrivacidadPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto bg-white p-12 md:p-20 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                        <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Política de Privacidad</h1>
                        <p className="text-gray-500 mb-8 font-medium italic">Última actualización: 30 de abril de 2026</p>

                        <div className="prose prose-gray max-w-none space-y-10 text-gray-600">
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introducción</h2>
                                <p>En BoluShop, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta Política de Privacidad describe cómo recopilamos, usamos y compartimos tu información cuando visitas o realizas una compra en nuestro sitio.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Información que recopilamos</h2>
                                <p>Recopilamos información necesaria para procesar tus pedidos y mejorar tu experiencia:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><b>Información de contacto:</b> Nombre, correo electrónico, dirección de envío y número de teléfono.</li>
                                    <li><b>Información de pago:</b> Procesada de forma segura a través de Mercado Pago. Nosotros no almacenamos los datos de tus tarjetas.</li>
                                    <li><b>Información técnica:</b> Dirección IP, tipo de navegador y datos sobre cómo interactúas con nuestro sitio (cookies).</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cómo usamos tu información</h2>
                                <p>Utilizamos tus datos para:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Procesar y enviar tus pedidos.</li>
                                    <li>Comunicarnos contigo sobre el estado de tu compra.</li>
                                    <li>Enviarte ofertas personalizadas si te suscribes a nuestro Newsletter.</li>
                                    <li>Cumplir con obligaciones legales y prevenir fraudes.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Terceros y Referidos</h2>
                                <p>BoluShop participa en el programa de afiliados de Mercado Libre. Al interactuar con productos marcados como "Imperdibles ML", es posible que seas redirigido a mercadolibre.com.ar, quienes tienen su propia política de privacidad.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Tus derechos</h2>
                                <p>Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier momento. Para hacerlo, puedes contactarnos a través de nuestra página de contacto.</p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
