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
                id: Math.random().toString(36).substring(7),
                productId,
                userName: newReview.userName,
                rating: newReview.rating,
                comment: newReview.comment,
                date: new Date().toISOString(),
            };

            await addProductReviewAction(review);
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
        <div className="mt-20 border-t border-gray-100 pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Reviews List */}
                <div>
                    <h3 className="text-3xl font-black mb-8 flex items-center gap-4">
                        Opiniones de <span className="text-primary italic">Clientes</span>
                        <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-400">
                            {reviews.length}
                        </span>
                    </h3>

                    {isLoading ? (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-gray-50 rounded-2xl" />
                            ))}
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-none mb-1">{review.userName}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    {new Date(review.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex text-secondary">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed font-medium">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                            {reviews.length === 10 && (
                                <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-300 py-4">
                                    Límite alcanzado: Los comentarios antiguos se irán borrando
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-[2rem] p-12 text-center">
                            <p className="text-gray-400 font-bold">Sé el primero en opinar sobre este producto.</p>
                        </div>
                    )}
                </div>

                {/* Submit Form */}
                <div className="bg-gray-50 rounded-[2.5rem] p-10 h-fit sticky top-32">
                    <h4 className="text-2xl font-black mb-6">Dejá tu comentario</h4>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Nombre</label>
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                className="w-full px-6 py-4 rounded-xl bg-white border-2 border-transparent focus:border-secondary transition-all outline-none"
                                value={newReview.userName}
                                onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Calificación</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: num })}
                                        className={`transition-colors ${num <= newReview.rating ? 'text-secondary' : 'text-gray-200'}`}
                                    >
                                        <Star fill={num <= newReview.rating ? "currentColor" : "none"} size={24} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Tu Opinión</label>
                            <textarea
                                placeholder="¿Qué te pareció el producto?"
                                rows={4}
                                className="w-full px-6 py-4 rounded-xl bg-white border-2 border-transparent focus:border-secondary transition-all outline-none resize-none"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
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
