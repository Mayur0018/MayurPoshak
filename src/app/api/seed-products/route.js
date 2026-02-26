import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

const CLOTHING_KEYWORDS = [
  "shirt", "pant", "jean", "dress", "top", "tee", "blouse", "jacket", "coat",
  "suit", "blazer", "skirt", "trousers", "shorts", "hoodie", "sweater", "cardigan",
  "outfit", "attire", "apparel", "wear", "garment", "clothing", "fabric", "cotton", "silk", "linen", "denim"
];

const GLOBAL_SEARCHES = [
  "fashion", "apparel", "clothing", "outfit", "attire", "wear", "cotton", "silk", "jean", "shirt", "dress"
];

const KIDS_SEARCHES = ["kids", "baby", "infant", "toddler", "child", "children"];

const RANDOM_SIZES = {
  clothing: ["S", "M", "L", "XL", "XXL"],
  kids: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"]
};

const RANDOM_COLORS = ["black", "white", "blue", "red", "pink", "beige", "gray", "navy", "green", "maroon", "yellow"];

async function fetchApparel() {
  let allProducts = [];

  // 1. Global Clothing Searches
  for (const term of GLOBAL_SEARCHES) {
    const data = await searchDJ(term, 50);
    const mapped = data.products
      .filter(p => isClothing(p))
      .map(p => {
         let cat = "men";
         const lower = (p.title + " " + p.description + " " + p.category).toLowerCase();
         if (lower.includes("women") || lower.includes("lady") || lower.includes("dress") || lower.includes("skirt") || lower.includes("top")) cat = "women";
         if (lower.includes("kid") || lower.includes("baby") || lower.includes("child") || lower.includes("boy") || lower.includes("girl")) cat = "kids";
         
         return {
           name: p.title,
           description: p.description,
           image: p.thumbnail,
           price: Math.round(p.price * 80),
           category: cat,
           subCategory: p.category.includes("-") ? p.category.split("-").pop() : p.category,
           brand: p.brand || "Mayur Poshak",
           size: cat === "kids" ? RANDOM_SIZES.kids : RANDOM_SIZES.clothing,
           color: getRandomColors(),
           stock: p.stock,
           rating: p.rating,
           reviewsCount: Math.floor(Math.random() * 100) + 5,
         };
      });
    allProducts = [...allProducts, ...mapped];
  }

  // 2. Focused Kids Searches (More relaxed filter)
  for (const term of KIDS_SEARCHES) {
    const data = await searchDJ(term, 30);
    const mapped = data.products.map(p => ({
      name: p.title,
      description: p.description,
      image: p.thumbnail,
      price: Math.round(p.price * 80),
      category: "kids",
      subCategory: "essentials",
      brand: p.brand || "Kids Store",
      size: RANDOM_SIZES.kids,
      color: getRandomColors(),
      stock: p.stock,
      rating: p.rating,
      reviewsCount: Math.floor(Math.random() * 50) + 2,
    }));
    allProducts = [...allProducts, ...mapped];
  }

  // Deduplication
  const unique = Array.from(new Map(allProducts.map(item => [item.name, item])).values());
  
  // Final filter to ensure no laptops/phones (except kids toys which might be okay)
  return unique.filter(p => {
     if (p.category === "kids") return true; 
     return isClothing(p);
  });
}

function isClothing(p) {
  const lowerText = (p.title + " " + p.description + " " + p.category).toLowerCase();
  const isC = CLOTHING_KEYWORDS.some(k => lowerText.includes(k));
  const isW = ["laptop", "phone", "tv", "camera", "headphone", "speaker", "tire", "skin", "oil", "serum", "tool", "car", "watch", "battery", "storage"].some(w => lowerText.includes(w));
  return isC && !isW;
}

async function searchDJ(term, limit = 50) {
  try {
    const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(term)}&limit=${limit}`);
    return await res.json();
  } catch (err) {
    console.error(`Search failed: ${term}`, err);
    return { products: [] };
  }
}

function getRandomColors() {
  const count = Math.floor(Math.random() * 2) + 1;
  return RANDOM_COLORS.sort(() => 0.5 - Math.random()).slice(0, count);
}

export async function GET() {
  try {
    await connectDB();
    await Product.deleteMany({});
    const clothingData = await fetchApparel();
    if (clothingData.length === 0) return Response.json({ message: "No data found" }, { status: 404 });
    const inserted = await Product.insertMany(clothingData);
    return Response.json({ message: "Seeded clothing catalog", count: inserted.length, categories: await Product.distinct("category") });
  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json({ message: "Seeding failed", error: error.message }, { status: 500 });
  }
}
