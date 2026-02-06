"use client";

interface CheckoutProgressProps {
    currentStep: 1 | 2 | 3;
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
    const steps = [
        { num: 1, label: "Carrito" },
        { num: 2, label: "Datos" },
        { num: 3, label: "Pago" }
    ];

    return (
        <div className="mb-12">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <div key={step.num} className="flex items-center">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= step.num
                                        ? 'bg-blue-600 text-white shadow-lg scale-110'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {currentStep > step.num ? '✓' : step.num}
                            </div>
                            <span
                                className={`mt-2 text-xs font-semibold transition-colors ${currentStep >= step.num ? 'text-blue-600' : 'text-gray-400'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div
                                className={`w-16 md:w-24 h-1 mx-2 transition-colors ${currentStep > step.num ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
