"use client";

import { useState } from "react";
import { LOCATION_DATA } from "@/lib/locations";

interface ShippingFormProps {
    formData: {
        name: string;
        email: string;
        phone: string;
        dni: string;
        address: string;
        province: string;
        locality: string;
    };
    onChange: (field: string, value: string) => void;
}

export default function ShippingForm({ formData, onChange }: ShippingFormProps) {
    const [localities, setLocalities] = useState<string[]>([]);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const province = e.target.value;
        onChange('province', province);
        onChange('locality', '');

        const provinceData = LOCATION_DATA.find(p => p.province === province);
        setLocalities(provinceData?.cities.map(c => c.name) || []);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Datos de Envío</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-2">
                        Nombre Completo *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Juan Pérez"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="juan@ejemplo.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">
                        Teléfono *
                    </label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="11 1234-5678"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">
                        DNI *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.dni}
                        onChange={(e) => onChange('dni', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="12345678"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2">
                        Dirección *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => onChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Av. Corrientes 1234, Piso 5, Depto A"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">
                        Provincia *
                    </label>
                    <select
                        required
                        value={formData.province}
                        onChange={handleProvinceChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                        <option value="">Seleccionar provincia</option>
                        {LOCATION_DATA.map((p) => (
                            <option key={p.province} value={p.province}>
                                {p.province}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">
                        Localidad *
                    </label>
                    <select
                        required
                        value={formData.locality}
                        onChange={(e) => onChange('locality', e.target.value)}
                        disabled={!formData.province}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                        <option value="">
                            {formData.province ? 'Seleccionar localidad' : 'Primero seleccione provincia'}
                        </option>
                        {localities.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
