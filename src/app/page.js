import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Hero from "@/features/home/components/Hero";
import Categories from "@/features/home/components/Categories";
import MostTrending from "@/features/products/components/MostTrending";
import About from "@/features/home/components/About";
import ProductOffer from "@/components/ui/ProductOffer";
import Exhibition from "@/features/home/components/Exhibition";
import Testimonials from "@/features/home/components/Testimonials";
import NewsletterCTA from "@/features/home/components/NewsletterCTA";
import NewArrivals from "@/features/products/components/NewArrivals";

export default async function Home() {
  let products = [];
  try {
    await connectDB();
    const raw = await Product.find().sort({ createdAt: -1 }).limit(8).lean();
    // Serialize MongoDB objects (ObjectId, Date, etc.) to plain values
    products = JSON.parse(JSON.stringify(raw));
  } catch (error) {
    console.error("Error fetching products on Home:", error);
  }

  return (
    <>
      <main>
        <div className="max-w-[1920px] mx-auto">
          <Hero />
          <Categories />
          <MostTrending />
          <ProductOffer />
          <About />
          <Testimonials />
          <Exhibition />
          <NewArrivals products={products} />
          <NewsletterCTA />
        </div>
      </main>
    </>
  );
}
