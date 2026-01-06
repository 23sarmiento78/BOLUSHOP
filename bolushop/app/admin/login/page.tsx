"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                setError('Credenciales incorrectas');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-primary/20">
                        B
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                        Admin<span className="text-primary italic">Panel</span>
                    </h1>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mt-2">Acceso Restringido</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-xs font-black uppercase tracking-widest text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email del Administrador</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-medium text-gray-900"
                                    placeholder="admin@bolushop.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Contraseña Segura</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-medium text-gray-900"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-primary transition-all shadow-xl shadow-gray-900/10 hover:shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    &copy; 2026 BoluShop Argentina · v2.6
                </p>
            </div>
        </div>
    );
}
