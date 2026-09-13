import { getAllPosts } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { transformImageUrl } from "@/lib/images";
import { ChevronRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Blog — Guías y Recomendaciones",
    description: "Guías, tips y recomendaciones sobre regalos originales, hogar y tecnología en BoluShop Argentina.",
    path: "/blog",
});

export default async function BlogPage() {
    const posts = await getAllPosts();
    const publishedPosts = posts.filter(p => p.isPublished);
    const categories = Array.from(new Set(publishedPosts.map(post => post.category).filter(Boolean)));
    const featuredPost = publishedPosts[0];
    const otherPosts = publishedPosts.slice(1);

    return (
        <>
            <main className="min-h-screen bg-[#f4f4ed]">
                <section className="hero-mesh text-white py-16 md:py-20">
                    <div className="container-shop">
                        <div className="flex items-center gap-2 mb-4 text-xs text-white/70">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Blog</span>
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>Guías y recomendaciones</h1>
                        <p className="max-w-3xl text-sm md:text-base text-white/80">
                            Consejos de compra, reviews y listas de regalos para cada ocasión.
                        </p>
                    </div>
                </section>

                <section className="container-shop py-12 md:py-16">
                    <div className="flex flex-wrap gap-3 mb-8">
                        <span className="inline-flex items-center rounded-full bg-[#11110f] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white">
                            Todos
                        </span>
                        {categories.map(category => (
                            <span key={category} className="inline-flex items-center rounded-full bg-[#ecebfd] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#185fa5]">
                                {category}
                            </span>
                        ))}
                    </div>

                    {featuredPost && (
                        <Link href={`/blog/${featuredPost.slug}`} className="group block mb-8">
                            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] items-stretch">
                                <div className="rounded-[1.75rem] bg-white border border-[#deded4] p-8 shadow-sm hover:shadow-lg transition">
                                    <div className="inline-flex items-center rounded-full bg-[#ecebfd] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#185fa5] mb-4">
                                        {featuredPost.category || 'Destacado'}
                                    </div>
                                    <h2 className="text-2xl font-semibold text-[#11110f] mb-4 md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-sm text-[#6d726a] leading-relaxed mb-6">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-[11px] text-[#6d726a]">
                                        <span>{featuredPost.author || 'BoluShop'}</span>
                                        <span>{new Date(featuredPost.createdAt).toLocaleDateString('es-AR')}</span>
                                        <span>5 min de lectura</span>
                                    </div>
                                </div>
                                <div className="rounded-[1.75rem] overflow-hidden bg-[#ecebfd] border border-[#deded4] shadow-sm">
                                    {featuredPost.image ? (
                                        <div className="relative h-full min-h-[280px]">
                                            <Image
                                                src={transformImageUrl(featuredPost.image)}
                                                alt={featuredPost.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-full min-h-[280px] flex items-center justify-center text-4xl text-[#11110f]">
                                            📰
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {otherPosts.map(post => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group"
                            >
                                <div className="card overflow-hidden h-full flex flex-col hover:shadow-lg transition">
                                    <div className="relative bg-[#eef0e8] overflow-hidden h-44">
                                        {post.image ? (
                                            <Image
                                                src={transformImageUrl(post.image)}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#ecebfd] to-[#dfddf5] flex items-center justify-center text-3xl">
                                                📰
                                            </div>
                                        )}
                                        {post.category && (
                                            <div className="absolute top-3 left-3 bg-white/90 text-[#185fa5] text-[9px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                                                {post.category}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-[#11110f] mb-3 line-clamp-2 group-hover:text-[#6f58d9] transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-[#6d726a] line-clamp-3 flex-1 mb-4">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-[11px] text-[#6d726a]">
                                            <span>{new Date(post.createdAt).toLocaleDateString('es-AR')}</span>
                                            <span className="font-semibold text-[#11110f]">Leer →</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="border-t border-[#deded4] bg-white py-8">
                    <div className="container-shop flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <span className="text-sm text-[#6d726a]">Mostrando {publishedPosts.length} artículos publicados</span>
                    </div>
                </section>
            </main>        </>
    );
}
