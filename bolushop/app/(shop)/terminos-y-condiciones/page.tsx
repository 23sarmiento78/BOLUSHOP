import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos y Condiciones | BoluShop Argentina",
    description: "Leé nuestros términos y condiciones de servicio para conocer las reglas de uso de BoluShop y tus derechos como comprador.",
};

export default function TerminosPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-32 pb-20 px-4">
                <article className="max-w-4xl mx-auto bg-white rounded-[2rem] p-8 md:p-16 shadow-sm border border-gray-50">
                    <h1 className="text-4xl font-black mb-8">Términos y Condiciones</h1>
                    <p className="text-gray-400 mb-12 text-sm">Última actualización: 4 de marzo de 2026</p>

                    <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Generalidades</h2>
                            <p>Este sitio web es operado por <strong>BoluShop</strong>. En todo el sitio, los términos "nosotros", "nos" y "nuestro" se refieren a BoluShop. BoluShop ofrece este sitio web, incluyendo toda la información, herramientas y servicios disponibles desde este sitio para usted, el usuario, condicionado a su aceptación de todos los términos, condiciones, políticas y avisos establecidos aquí.</p>
                            <p>Al visitar nuestro sitio y/o comprarle algo a nosotros, usted participa en nuestro "Servicio" y acepta quedar vinculado por los siguientes términos y condiciones ("Términos de Servicio", "Términos"), incluidos los términos y condiciones adicionales y las políticas referenciadas aquí y/o disponibles por hipervínculo.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Términos de la Tienda Online</h2>
                            <p>Al aceptar estos Términos, usted declara que tiene al menos la mayoría de edad en su estado o provincia de residencia. No puede utilizar nuestros productos para ningún propósito ilegal o no autorizado ni puede, al hacer uso del Servicio, violar cualquier ley en su jurisdicción (incluidas, entre otras, las leyes de derechos de autor).</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Modificaciones al Servicio y Precios</h2>
                            <p>Los precios de nuestros productos están sujetos a cambios sin previo aviso. Nos reservamos el derecho en cualquier momento de modificar o interrumpir el Servicio (o cualquier parte o contenido del mismo) sin previo aviso en cualquier momento de acuerdo a las condiciones del mercado argentino.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Productos o Servicios</h2>
                            <p>Ciertos productos o servicios pueden estar disponibles exclusivamente online a través del sitio web. Estos productos o servicios pueden tener cantidades limitadas y están sujetos a devolución o cambio solo de acuerdo con nuestra Política de Devoluciones y Reembolsos disponible en la sección de Garantías.</p>
                            <p>Nos reservamos el derecho, pero no estamos obligados, a limitar las ventas de nuestros productos o servicios a cualquier persona, región geográfica o jurisdicción.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Precisión de la Facturación e Información de la Cuenta</h2>
                            <p>Nos reservamos el derecho de rechazar cualquier pedido que realice con nosotros. Podemos, a nuestra entera discreción, limitar o cancelar las cantidades compradas por persona, por hogar o por pedido. Estas restricciones pueden incluir pedidos realizados por o bajo la misma cuenta de cliente, la misma tarjeta de crédito y/o pedidos que utilizan la misma dirección de facturación y/o envío.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Envíos y Entregas</h2>
                            <p>Los tiempos de entrega son estimados y pueden variar debido a factores externos ajenos a BoluShop. El envío gratuito está sujeto a disponibilidad geográfica y montos mínimos de compra según se indique al momento del checkout.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Ley Aplicable</h2>
                            <p>Estos Términos de Servicio y cualquier acuerdo por el cual le proporcionemos Servicios se regirán e interpretarán de acuerdo con las leyes de la República Argentina.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cambios a los Términos de Servicio</h2>
                            <p>Usted puede revisar la versión más reciente de los Términos de Servicio en cualquier momento en esta página. Nos reservamos el derecho, a nuestra entera discreción, de actualizar, cambiar o reemplazar cualquier parte de estos Términos de Servicio mediante la publicación de actualizaciones y cambios en nuestro sitio web.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Información de Contacto</h2>
                            <p>Las preguntas sobre los Términos de Servicio deben enviarse a <strong>sarmientoisrael118@gmail.com</strong>.</p>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}
