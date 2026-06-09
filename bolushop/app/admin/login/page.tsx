"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Shield, BarChart3, Package } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            } else {
                setError("Credenciales incorrectas");
            }
        } catch {
            setError("Error de conexión");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            {/* Hero lateral */}
            <div className="admin-login-hero text-white">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#ff6b35] rounded-full blur-[120px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f5c842] rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-md">
                    <div className="w-14 h-14 bg-[#ff6b35] rounded-2xl flex items-center justify-center text-2xl font-bold mb-8 shadow-xl shadow-[#ff6b35]/30">
                        B
                    </div>
                    <h1
                        className="text-4xl font-semibold leading-tight mb-4"
                        style={{ fontFamily: "var(--font-fraunces)" }}
                    >
                        Centro de control BoluShop
                    </h1>
                    <p className="text-white/55 text-base leading-relaxed mb-10">
                        Gestioná productos, pedidos, contenido y configuración de tu tienda desde un solo lugar.
                    </p>

                    <div className="space-y-4">
                        {[
                            { icon: Package, text: "Catálogo y stock en tiempo real" },
                            { icon: BarChart3, text: "Métricas de ventas del mes" },
                            { icon: Shield, text: "Acceso seguro y restringido" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3 text-sm text-white/70">
                                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Icon size={16} className="text-[#ff6b35]" />
                                </div>
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Formulario */}
            <div className="admin-login-form-side">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8 lg:hidden">
                        <div className="w-12 h-12 bg-[#ff6b35] rounded-xl flex items-center justify-center text-xl font-bold text-white mx-auto mb-4">
                            B
                        </div>
                        <h2 className="text-2xl font-semibold text-[#0a1628]" style={{ fontFamily: "var(--font-fraunces)" }}>
                            Admin Panel
                        </h2>
                    </div>

                    <div className="admin-card !p-8">
                        <h2
                            className="text-xl font-semibold text-[#0a1628] mb-1 hidden lg:block"
                            style={{ fontFamily: "var(--font-fraunces)" }}
                        >
                            Iniciar sesión
                        </h2>
                        <p className="text-sm text-[#64748b] mb-6 hidden lg:block">
                            Ingresá con tus credenciales de administrador.
                        </p>

                        {error && (
                            <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-xl mb-5 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 text-sm"
                                        placeholder="admin@bolushop.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">Contraseña</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="admin-btn admin-btn-primary w-full !py-3 mt-2"
                            >
                                {isLoading ? "Verificando..." : "Entrar al panel"}
                                {!isLoading && <ArrowRight size={16} />}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-xs text-[#94a3b8] mt-6">
                        <Link href="/" className="hover:text-[#ff6b35] transition-colors">
                            ← Volver a la tienda
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
