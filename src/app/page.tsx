import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import CategorySections from "@/components/CategorySections";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4">
        <Carousel />
        <CategorySections />
      </main>
      <Footer />
    </div>
  );
}
