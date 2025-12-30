"use client";
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';

// Initialize MP with Public Key
const publicKey = process.env.NEXT_PUBLIC_MP_BRICKS_PUBLIC_KEY || '';
if (publicKey) {
    initMercadoPago(publicKey, { locale: 'es-AR' });
}

interface PaymentBrickProps {
    amount: number;
    items: any[];
    internalPayer: {
        name: string;
        email: string;
        address: string;
        phone: string;
    };
    onSuccess: (result: any) => void;
    onError: (error: any) => void;
}

export default function PaymentMethodsBrick({ amount, items, internalPayer, onSuccess, onError }: PaymentBrickProps) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!publicKey) {
            console.error("❌ NEXT_PUBLIC_MP_PUBLIC_KEY is missing");
        }
        setReady(true);
    }, []);

    const initialization = {
        amount: amount,
        preferenceId: undefined, // Not using preference for internal processing
    };

    const customization = {
        paymentMethods: {
            ticket: ["all"],
            bankTransfer: ["all"],
            creditCard: "all",
            debitCard: "all",
            mercadoPago: ["all"],
        },
        visual: {
            style: {
                theme: 'default' as const, // 'default', 'dark', 'bootstrap', 'flat'
            },
        },
    };

    const onSubmit = async ({ selectedPaymentMethod, formData }: any) => {
        try {
            const response = await fetch('/api/checkout/process_payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formData,
                    items,
                    total: amount,
                    internalPayer,
                    paymentMethod: selectedPaymentMethod,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                onSuccess(result);
            } else {
                throw new Error(result.error || 'Error en el procesamiento');
            }
        } catch (error) {
            console.error("❌ Error submitting payment:", error);
            onError(error);
        }
    };

    if (!ready || !publicKey) return <div className="p-4 text-center text-gray-500">Cargando pasarela segura...</div>;

    return (
        <div id="payment-brick-container" className="w-full min-h-[400px]">
            <Payment
                initialization={initialization}
                customization={customization}
                onSubmit={onSubmit}
                onReady={() => console.log("✅ Brick is ready")}
                onError={(error) => {
                    console.error("❌ Brick Error:", error);
                    onError(error);
                }}
            />
        </div>
    );
}
