import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import MostTrending from "@/components/MostTrending";
import About from "@/components/About";
import ProductOffer from "@/components/ProductOffer";
import Exhibition from "@/components/Exhibition";
export default function Home() {
  return (
    <>
      <main>
        <div className="max-w-[1920px] mx-auto">
          <Hero />
          <Categories />
          <MostTrending />
          <ProductOffer />
          <About />
         <Exhibition/>
        </div>
      </main>
    </>
  );
}
