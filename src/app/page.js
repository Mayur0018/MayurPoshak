import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Hero from "@/components/features/Hero";
import Categories from "@/components/features/Categories";
import MostTrending from "@/components/features/MostTrending";
import About from "@/components/features/About";
import ProductOffer from "@/components/ui/ProductOffer";
import Exhibition from "@/components/features/Exhibition";
import Testimonials from "@/components/features/Testimonials";
import NewsletterCTA from "@/components/features/NewsletterCTA";
import NewArrivals from "@/components/features/NewArrivals";

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
