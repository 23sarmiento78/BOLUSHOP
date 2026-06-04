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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Artículo no encontrado" };
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    const description = post.metaDescription || post.excerpt;

    return {
        title: post.metaTitle || `${post.title} | Blog BoluShop`,
        description,
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            title: post.metaTitle || post.title,
            description,
            url: postUrl,
            images: [post.image ? transformImageUrl(post.image) : '/icon.png'],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post || !post.isPublished) notFound();

    const allPosts = await getAllPosts();
    const allProducts = await getAllProducts();

    const relatedPosts = allPosts.filter(p => p.id !== post.id && p.isPublished).slice(0, 3);
    const linkedProducts = allProducts.filter(p => post.productIds?.includes(p.id));

    // Calculate reading time
    const wordCount = post.content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const formatContent = (content: string) => {
        if (!content) return "";
        // If it seems to have HTML tags, don't touch it
        if (/<(p|h2|h3|ul|li|b|i)/i.test(content)) return content;

        // Convert plain text newlines to HTML
        return content
            .split(/\n\s*\n/)
            .filter(p => p.trim())
            .map(p => `<p>${p.trim().replace(/\n/g, '<br />')}</p>`)
            .join('');
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                <article>
                    {/* Hero Section - Magazine Style */}
                    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-black">
                        {post.image && (
                            <Image
                                src={transformImageUrl(post.image)}
                                alt={post.title}
                                fill
                                className="object-cover opacity-60 scale-105"
                                priority
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                        <div className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-32">
                            <div className="container mx-auto px-4 max-w-6xl">
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                                    <div className="flex items-center gap-4">
                                        <Link href="/blog" className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full text-white hover:bg-white/20 transition-all">
                                            <ArrowLeft size={20} />
                                        </Link>
                                        <span className="px-5 py-2 bg-primary text-black rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20">
                                            {post.category}
                                        </span>
                                    </div>

                                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
                                        {post.title}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-8 text-[12px] font-black uppercase tracking-[0.2em] text-white/70">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-[10px] text-white font-bold border border-white/10">B</div>
                                            por {post.author}
                                        </div>
                                        <div className="w-px h-4 bg-white/20 hidden md:block"></div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-primary" /> {new Date(post.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className="w-px h-4 bg-white/20 hidden md:block"></div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-primary" /> {readingTime} min de lectura
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 max-w-4xl -mt-16 relative z-10 mb-24">
                        <div className="bg-white rounded-[4rem] p-8 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-50">
                            {/* Intro / Excerpt */}
                            <p className="text-2xl md:text-3xl font-black text-gray-900 leading-[1.1] tracking-tighter mb-4 italic border-l-8 border-primary pl-8">
                                {post.excerpt}
                            </p>

                            {/* AdSense Top */}
                            <div className="mb-4 py-3 border-y border-gray-50 flex justify-center bg-gray-50/20 rounded-2xl overflow-hidden min-h-[50px] w-full">
                                <ins className="adsbygoogle"
                                    style={{ display: 'block', textAlign: 'center', width: '100%' }}
                                    data-ad-layout="in-article"
                                    data-ad-format="fluid"
                                    data-ad-client="ca-pub-5416044136120955"
                                    data-ad-slot="blog-top-slot"></ins>
                                <Script id="adsense-init" strategy="lazyOnload">
                                    {`try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}`}
                                </Script>
                            </div>

                            <div
                                className="blog-content"
                                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
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
                            <div className="my-20 py-8 border-t border-gray-100 flex justify-center overflow-hidden min-h-[250px] w-full">
                                <ins className="adsbygoogle"
                                    style={{ display: 'block', width: '100%' }}
                                    data-ad-client="ca-pub-5416044136120955"
                                    data-ad-slot="blog-bottom-slot"
                                    data-ad-format="auto"
                                    data-full-width-responsive="true"></ins>
                                <Script id="adsense-bottom" strategy="lazyOnload">
                                    {`try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}`}
                                </Script>
                            </div>

                            <div className="py-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                                <p className="text-gray-400 font-bold text-sm italic">Gracias por informarte con BoluShop Argentina.</p>
                                <button className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">
                                    <Share2 size={16} /> Compartir Artículo
                                </button>
                            </div>
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
