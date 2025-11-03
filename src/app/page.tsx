import Banner from "@/components/Banner";
import CategorySections from "@/components/CategorySections";
import ShopByCategorySection from '@/components/ShopByCategorySection';
import LegoraSection from '@/components/LegoraSection';
import NewArrivalsSection from '@/components/NewArrivalsSection';
import AnimatedProductShowcase from '@/components/AnimatedProductShowcase';
import ProductGridSection from '@/components/ProductGridSection';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Banner />
        <div id="shop-by-category">
          <ShopByCategorySection />
        </div>
        <LegoraSection />
        <div id="new-arrivals">
          <AnimatedProductShowcase />
        </div>
        {/* <NewArrivalsSection /> */}
        <div id="top-rated">
          <ProductGridSection />
        </div>
        {/* <CategorySections /> */}
      </main>
      <Footer />
    </div>
  );
}
