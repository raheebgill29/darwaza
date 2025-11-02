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
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main>
        <Banner />
        <ShopByCategorySection />
        <LegoraSection />
        <AnimatedProductShowcase />
        {/* <NewArrivalsSection /> */}
        <ProductGridSection />
        <CategorySections />
      </main>
      <Footer />
    </div>
  );
}
