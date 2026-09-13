"use client";

import { useState, useEffect } from "react";
import { Review } from "@/lib/types";
import { getProductReviewsAction, addProductReviewAction } from "@/app/actions/shop";
import { toast } from "sonner";
import { Star, Send, User } from "lucide-react";

interface Props {
    productId: string;
}

export default function ProductReviews({ productId }: Props) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({ userName: "", rating: 5, comment: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getProductReviewsAction(productId);
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview.userName || !newReview.comment) {
            toast.error("Por favor completá todos los campos");
            return;
        }

        setIsSubmitting(true);
        try {
            const review: Review = {
                id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
                productId,
                userName: newReview.userName,
                rating: newReview.rating,
                comment: newReview.comment,
                date: new Date().toISOString(),
            };

            const saved = await addProductReviewAction(review);
            if (!saved) {
                toast.error("No pudimos publicar el comentario");
                return;
            }
            toast.success("¡Comentario añadido!");

            // Logic: Prepend and limit to 10 locally
            const updated = [review, ...reviews].slice(0, 10);
            setReviews(updated);
            setNewReview({ userName: "", rating: 5, comment: "" });
        } catch (error) {
            toast.error("Error al publicar el comentario");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-12 border-t border-[#e8e4df] pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Reviews List */}
                <div>
                    <h3 className="mb-8 text-2xl font-semibold text-[#0a1628] md:text-3xl flex items-center gap-4">
                        Opiniones de <span className="text-[#ff6b35] italic">Clientes</span>
                        <span className="text-sm font-bold rounded-full bg-[#f5f3f0] px-3 py-1 text-[#64748b]">
                            {reviews.length}
                        </span>
                    </h3>

                    {isLoading ? (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 rounded-2xl bg-[#faf9f7]" />
                            ))}
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="rounded-[1.5rem] border border-[#e8e4df] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#94a3b8]">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-[#0a1628] leading-none mb-1">{review.userName}</p>
                                                <p className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-widest">
                                                    {new Date(review.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex text-[#f5c842]">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[#64748b] leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                            {reviews.length === 10 && (
                                <p className="text-center text-[10px] font-black uppercase tracking-widest text-[#94a3b8] py-4">
                                    Límite alcanzado: Los comentarios antiguos se irán borrando
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-[1.5rem] bg-white border border-dashed border-[#e8e4df] p-10 text-center">
                            <p className="text-[#64748b] font-medium">Sé el primero en opinar sobre este producto.</p>
                        </div>
                    )}
                </div>

                {/* Submit Form */}
                <div className="sticky top-28 h-fit rounded-[1.5rem] border border-[#e8e4df] bg-white p-6 md:p-8">
                    <h4 className="mb-6 text-2xl font-semibold text-[#0a1628]">Dejá tu comentario</h4>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-[#64748b] mb-2 block">Nombre</label>
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                className="w-full px-6 py-4 rounded-xl border border-[#e8e4df] bg-white focus:border-[#ff6b35] transition-all outline-none"
                                maxLength={80}
                                value={newReview.userName}
                                onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-[#64748b] mb-2 block">Calificación</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        aria-label={`${num} estrella${num === 1 ? "" : "s"}`}
                                        onClick={() => setNewReview({ ...newReview, rating: num })}
                                        className={`transition-colors ${num <= newReview.rating ? 'text-[#f5c842]' : 'text-[#e8e4df]'}`}
                                    >
                                        <Star fill={num <= newReview.rating ? "currentColor" : "none"} size={24} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-[#64748b] mb-2 block">Tu Opinión</label>
                            <textarea
                                placeholder="¿Qué te pareció el producto?"
                                rows={4}
                                className="w-full px-6 py-4 rounded-xl border border-[#e8e4df] bg-white focus:border-[#ff6b35] transition-all outline-none resize-none"
                                maxLength={1000}
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-[#0a1628] text-white rounded-xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-lg shadow-[#0a1628]/15 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isSubmitting ? "Enviando..." : "Publicar Comentario"}
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
