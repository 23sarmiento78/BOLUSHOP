import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ConditionalNewsletter from "@/components/shop/ConditionalNewsletter";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            {children}
            <ConditionalNewsletter />
            <Footer />
        </>
    );
}
