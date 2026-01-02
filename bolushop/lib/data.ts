import { getAllProducts, getProductBySlug as dbGetProductBySlug } from './db';
import { Product } from './types';

export type { Product };

export const getProducts = async () => await getAllProducts();
export const getFeaturedProducts = async () => (await getAllProducts()).slice(0, 4);
export const getProductBySlug = async (slug: string) => await dbGetProductBySlug(slug);
export const getProductsByCategory = async (cat: string) => (await getAllProducts()).filter(p => p.category === cat);
