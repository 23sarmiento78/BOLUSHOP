import { getAllProducts, getProductBySlug as dbGetProductBySlug, Product } from './db';

export type { Product };

export const getProducts = () => getAllProducts();
export const getFeaturedProducts = () => getAllProducts().slice(0, 4);
export const getProductBySlug = (slug: string) => dbGetProductBySlug(slug);
export const getProductsByCategory = (cat: string) => getAllProducts().filter(p => p.category === cat);
