import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import Newsletter from "@/components/shop/Newsletter";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            {children}
            <Newsletter />
            <Footer />
        </>
    );
}
