import { getPostBySlug, getAllPosts, getAllProducts } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ProductCard from "@/components/shop/ProductCard";
import NewsletterForm from "@/components/shop/NewsletterForm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, ShoppingBag, Clock, Instagram, Facebook } from "lucide-react";
import Logo from "@/components/shop/Logo";
import { transformImageUrl } from "@/lib/images";
import Script from "next/script";

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);
    if (!post) return { title: "Artículo no encontrado" };
    return {
        title: post.metaTitle || `${post.title} | Blog BoluShop`,
        description: post.metaDescription || post.excerpt,
        openGraph: {
            title: post.metaTitle || post.title,
            description: post.metaDescription || post.excerpt,
            images: [post.image ? transformImageUrl(post.image) : '/icon.png'],
        }
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);
    if (!post || !post.isPublished) notFound();

    const allPosts = await getAllPosts();
    const allProducts = await getAllProducts();

    const relatedPosts = allPosts.filter(p => p.id !== post.id && p.isPublished).slice(0, 3);
    const linkedProducts = allProducts.filter(p => post.productIds?.includes(p.id));

    // Calculate reading time
    const wordCount = post.content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <>
            <Header />
            <main className="min-h-screen pt-32 bg-white">
                <article>
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="flex justify-between items-center mb-12">
                            <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                <ArrowLeft size={16} /> Volver al Blog
                            </Link>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
                                <Clock size={12} /> Lectura de {readingTime} min
                            </div>
                        </div>

                        <div className="space-y-6 mb-12 text-center md:text-left">
                            <span className="inline-block px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/10">
                                {post.category}
                            </span>
                            <h1 className="text-5xl md:text-8xl font-black text-gray-900 leading-[0.95] tracking-tighter">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[11px] font-black uppercase tracking-widest text-gray-400">
                                <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[8px] text-white font-bold">B</div>
                                    {post.author}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 max-w-7xl mb-16">
                        <div className="relative aspect-[21/10] md:aspect-[21/8] rounded-[4rem] overflow-hidden shadow-2xl border border-gray-100">
                            {post.image && (
                                <Image
                                    src={transformImageUrl(post.image)}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            )}
                        </div>
                    </div>

                    <div className="container mx-auto px-4 max-w-3xl">
                        {/* AdSense Top */}
                        <div className="my-10 py-4 border-y border-gray-50 flex justify-center bg-gray-50/30 rounded-2xl overflow-hidden min-h-[100px]">
                            <ins className="adsbygoogle"
                                style={{ display: 'block', textAlign: 'center' }}
                                data-ad-layout="in-article"
                                data-ad-format="fluid"
                                data-ad-client="ca-pub-5416044136120955"
                                data-ad-slot="blog-top-slot"></ins>
                            <Script id="adsense-init">
                                (adsbygoogle = window.adsbygoogle || []).push({ });
                            </Script>
                        </div>

                        <div
                            className="prose prose-2xl prose-gray max-w-none
                            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-gray-900 prose-headings:mb-10 prose-headings:mt-16
                            prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:font-medium prose-p:mb-10
                            prose-img:rounded-[3rem] prose-img:shadow-2xl prose-img:my-16
                            prose-strong:text-gray-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-blockquote:border-l-8 prose-blockquote:border-primary prose-blockquote:bg-gray-50 prose-blockquote:p-12 prose-blockquote:rounded-r-[3rem] prose-blockquote:italic prose-blockquote:text-gray-900"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* SHOP THE LOOK - Productos vinculados */}
                        {linkedProducts.length > 0 && (
                            <div className="my-20 p-10 bg-gray-900 rounded-[3rem] text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                    <ShoppingBag size={120} />
                                </div>
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Shop the Look</span>
                                    <h3 className="text-3xl font-black mb-10 tracking-tighter italic">Mencionado en este artículo</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {linkedProducts.map(product => (
                                            <Link key={product.id} href={`/producto/${product.slug}`} className="flex items-center gap-6 bg-white/5 hover:bg-white/10 p-5 rounded-[2rem] transition-all border border-white/5 hover:border-white/20 group/item">
                                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
                                                    <Image src={transformImageUrl(product.image)} alt={product.name} fill className="object-cover group-hover/item:scale-110 transition-transform" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg leading-tight mb-2 line-clamp-1">{product.name}</h4>
                                                    <p className="text-primary font-black text-xl">${product.price.toLocaleString()}</p>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-3 block group-hover/item:text-white transition-colors">Ver Producto →</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BIO DEL AUTOR */}
                        <div className="my-20 p-8 md:p-12 rounded-[3.5rem] bg-gray-50 border border-gray-100 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden bg-white shadow-xl flex-shrink-0 p-4 border border-white flex items-center justify-center">
                                <Logo size={64} className="text-gray-900" />
                            </div>
                            <div className="relative z-10 text-center md:text-left">
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest mb-3">Redacción Oficial</span>
                                <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Equipo de <span className="text-primary italic">BoluShop</span></h4>
                                <p className="text-gray-500 font-medium leading-relaxed mb-6 text-sm md:text-base">
                                    Apasionados por la tecnología, las tendencias internacionales y la curaduría de productos únicos. Nuestro equipo recorre el mercado global para traerte solo lo que vale la pena tener.
                                </p>
                                <div className="flex justify-center md:justify-start gap-4">
                                    <a href="https://instagram.com/bolushop.arg" target="_blank" className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm border border-gray-100">
                                        <Instagram size={18} />
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm border border-gray-100">
                                        <Facebook size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* AdSense Bottom */}
                        <div className="my-20 py-8 border-t border-gray-100 flex justify-center overflow-hidden min-h-[250px]">
                            <ins className="adsbygoogle"
                                style={{ display: 'block' }}
                                data-ad-client="ca-pub-5416044136120955"
                                data-ad-slot="blog-bottom-slot"
                                data-ad-format="auto"
                                data-full-width-responsive="true"></ins>
                            <Script id="adsense-bottom">
                                (adsbygoogle = window.adsbygoogle || []).push({ });
                            </Script>
                        </div>

                        <div className="mb-20 py-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                            <p className="text-gray-400 font-bold text-sm italic">Gracias por informarte con BoluShop Argentina.</p>
                            <button className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">
                                <Share2 size={16} /> Compartir Artículo
                            </button>
                        </div>
                    </div>
                </article>

                {/* Newsletter */}
                <section className="bg-gray-50 py-24 border-t border-gray-100">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <NewsletterForm />
                    </div>
                </section>

                {/* Articulos Relacionados (Footer del post) */}
                {relatedPosts.length > 0 && (
                    <section className="bg-white py-32">
                        <div className="container mx-auto px-4 max-w-6xl">
                            <div className="flex justify-between items-end mb-16">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">Más Contenido</span>
                                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">Lecturas <span className="text-primary italic">Recomendadas</span></h3>
                                </div>
                                <Link href="/blog" className="hidden md:block text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Ver todo el blog</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {relatedPosts.map(p => (
                                    <Link href={`/blog/${p.slug}`} key={p.id} className="group">
                                        <div className="relative h-72 rounded-[2.5rem] overflow-hidden mb-6 shadow-sm border border-gray-100">
                                            {p.image && <Image src={transformImageUrl(p.image)} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />}
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                        <div className="px-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-2 block">{p.category}</span>
                                            <h4 className="text-xl font-black text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{p.title}</h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
