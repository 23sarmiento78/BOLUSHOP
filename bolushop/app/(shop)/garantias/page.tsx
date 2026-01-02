"use client";

export default function GarantiasPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Garantías y Devoluciones
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Tu tranquilidad es nuestra prioridad
                    </p>
                </div>

                {/* Content Cards */}
                <div className="space-y-8">
                    {/* Garantía Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="text-5xl">✅</div>
                            <div>
                                <h2 className="text-3xl font-black mb-2">¿Tienen garantía los productos?</h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
                            </div>
                        </div>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Todos nuestros productos poseen garantía.</strong> También tienen devolución exprés dentro de los <strong className="text-primary">10 días</strong> de recibida la compra.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Ante cualquier fallo o disconformidad podés realizar la devolución en ese plazo <strong>sin costo</strong>.
                            </p>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                <p className="text-sm text-gray-700">
                                    <strong>Importante:</strong> Las devoluciones deben ser completas, no parciales. El producto deberá estar completo y sin uso, con su caja y todos sus accesorios que contenga, incluyendo su packaging original.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reintegros Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="text-5xl">💰</div>
                            <div>
                                <h2 className="text-3xl font-black mb-2">¿Hacen reintegros / reembolsos?</h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                            </div>
                        </div>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Durante el periodo de devolución se reintegrará el <strong className="text-green-600">100% de tu compra</strong> incluyendo:
                            </p>
                            <ul className="space-y-2 mb-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-700">El valor de envío abonado al despachar el producto</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-700">El envío utilizado para la devolución</span>
                                </li>
                            </ul>
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                <p className="text-sm text-gray-700">
                                    <strong>Nota:</strong> Posterior a este plazo ya corre la garantía en curso, la cual no cubre los gastos de flete o transporte del mismo hacia nuestro depósito.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                            <div className="text-4xl mb-3">🛡️</div>
                            <h3 className="font-bold text-gray-900 mb-2">Compra Protegida</h3>
                            <p className="text-sm text-gray-600">Tu dinero está seguro</p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                            <div className="text-4xl mb-3">⚡</div>
                            <h3 className="font-bold text-gray-900 mb-2">Devolución Exprés</h3>
                            <p className="text-sm text-gray-600">10 días sin preguntas</p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                            <div className="text-4xl mb-3">💯</div>
                            <h3 className="font-bold text-gray-900 mb-2">Reembolso Total</h3>
                            <p className="text-sm text-gray-600">100% de tu compra</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <a
                        href="/"
                        className="inline-block px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all transform hover:scale-105"
                    >
                        Volver a la Tienda
                    </a>
                </div>
            </div>
        </div>
    );
}
