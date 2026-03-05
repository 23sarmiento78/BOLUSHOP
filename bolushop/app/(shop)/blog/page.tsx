import { getAllPosts } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ChevronRight } from "lucide-react";

export const metadata = {
    title: "Blog | BoluShop Argentina",
    description: "Inspiración, tecnología y novedades. Descubre los mejores artículos en nuestro blog oficial."
};

export default async function BlogPage() {
    const posts = await getAllPosts();
    const publishedPosts = posts.filter(p => p.isPublished);

    return (
        <>
            <Header />
            <main className="min-h-screen pt-32 pb-24 bg-gray-50/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <span className="inline-block px-4 py-1.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Insights & Novedades</span>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">Nuestro <span className="italic text-primary">Blog</span></h1>
                        <p className="text-gray-500 text-lg font-medium">Información, guías de compra y las últimas tendencias en tecnología y bazar premium.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {publishedPosts.map((post, idx) => (
                            <Link
                                href={`/blog/${post.slug}`}
                                key={post.id}
                                className={`group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 ${idx === 0 ? "md:col-span-2 lg:flex-row h-full" : ""}`}
                            >
                                <div className={`relative ${idx === 0 ? "md:w-1/2 h-[350px] md:h-full" : "h-[280px]"}`}>
                                    {post.image ? (
                                        <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">📷</div>
                                    )}
                                    <div className="absolute top-6 left-6">
                                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm border border-gray-100">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className={`p-8 md:p-12 flex flex-col justify-center ${idx === 0 ? "md:w-1/2" : ""}`}>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">
                                        <div className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-1"><User size={12} /> {post.author}</div>
                                    </div>
                                    <h2 className={`${idx === 0 ? "text-3xl md:text-4xl" : "text-2xl"} font-black text-gray-900 mb-4 tracking-tight group-hover:text-primary transition-colors leading-tight`}>
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                                        Leer Artículo <ChevronRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {publishedPosts.length === 0 && (
                        <div className="py-40 text-center">
                            <p className="text-gray-400 font-bold text-xl italic">No hay artículos publicados todavía. ¡Vuelve pronto!</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
