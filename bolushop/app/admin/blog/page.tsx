import { getAllPosts, getAllProducts } from "@/lib/db";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
    const posts = await getAllPosts();
    const products = await getAllProducts();

    return (
        <div className="bg-gray-50/50 min-h-screen">
            <BlogClient initialPosts={posts} allProducts={products} />
        </div>
    );
}
