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
  kids: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"],
  genz: ["S", "M", "L", "XL", "XXL", "Free Size"]
};

const RANDOM_COLORS = ["black", "white", "blue", "red", "pink", "beige", "gray", "navy", "green", "maroon", "yellow"];

/* ──────────────────────────────────────────────
   CURATED COLLECTION - MASSIVE EXPANSION
   ────────────────────────────────────────────── */
const CURATED_PRODUCTS = [
  // --- LADIES ETHNIC & TRADITIONAL ---
  {
    name: "Royal Banarasi Silk Saree",
    description: "Exquisite hand-woven Banarasi silk saree with intricate gold zari floral work. A timeless heritage piece.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&q=80&fit=crop",
    price: 12499,
    category: "women",
    subCategory: "sarees",
    brand: "Mayur Heritage",
    size: ["Free Size"],
    color: ["maroon", "gold"],
    stock: 12,
    rating: 4.9,
    reviewsCount: 45,
  },
  {
    name: "Emerald Green Kanjivaram Saree",
    description: "Authentic South Indian Kanjivaram silk saree with contrast pallu and traditional motifs.",
    image: "https://plus.unsplash.com/premium_photo-1681487469745-91d1d8a5836b?w=1920&q=80&fit=crop",
    price: 15999,
    category: "women",
    subCategory: "sarees",
    brand: "Mayur Heritage",
    size: ["Free Size"],
    color: ["green", "red"],
    stock: 5,
    rating: 5.0,
    reviewsCount: 28,
  },
  {
    name: "Ivory Chikankari Anarkali Set",
    description: "Pure georgette Anarkali with intricate Lucknowi Chikankari hand embroidery and pearl highlights.",
    image: "https://images.unsplash.com/photo-1583391733956-613d5dfae497?w=1920&q=80&fit=crop",
    price: 7499,
    category: "women",
    subCategory: "western",
    brand: "Poshak Ethnic",
    size: ["S", "M", "L", "XL"],
    color: ["white", "cream"],
    stock: 15,
    rating: 4.8,
    reviewsCount: 62,
  },
  {
    name: "Midnight Blue Velvet Lehengha",
    description: "Luxurious velvet lehenga with heavy sequin and dori work. Comes with a matching blouse and net dupatta.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e044c889?w=1920&q=80&fit=crop",
    price: 18499,
    category: "women",
    subCategory: "sarees",
    brand: "Royal Couture",
    size: ["S", "M", "L", "XL"],
    color: ["blue", "navy"],
    stock: 8,
    rating: 4.9,
    reviewsCount: 37,
  },

  // --- LADIES WESTERN & CASUAL ---
  {
    name: "Pleated Geometric Midi Dress",
    description: "Contemporary pleated midi dress with a bold geometric print and cinched waist. Modern effortless style.",
    image: "https://images.unsplash.com/photo-1572804013307-a9a7dfdffbb0?w=1920&q=80&fit=crop",
    price: 3299,
    category: "women",
    subCategory: "casual",
    brand: "Urban Aura",
    size: ["S", "M", "L"],
    color: ["blue", "white"],
    stock: 22,
    rating: 4.5,
    reviewsCount: 110,
  },
  {
    name: "Tweed Double-Breasted Blazer",
    description: "Classic power blazer in premium tweed fabric with gold-tone buttons. Perfect for office and evening wear.",
    image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=1920&q=80&fit=crop",
    price: 4999,
    category: "women",
    subCategory: "western",
    brand: "Modern Woman",
    size: ["S", "M", "L", "XL"],
    color: ["gray", "black"],
    stock: 14,
    rating: 4.7,
    reviewsCount: 53,
  },
  {
    name: "Satin Wrap Evening Gown",
    description: "Elegant silk satin wrap gown with a deep V-neck and high slit. Red carpet ready.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1920&q=80&fit=crop",
    price: 6499,
    category: "women",
    subCategory: "western",
    brand: "Glow & Co",
    size: ["S", "M", "L"],
    color: ["red", "black", "gold"],
    stock: 10,
    rating: 4.8,
    reviewsCount: 89,
  },

  // --- MEN FORMAL & ETHNIC ---
  {
    name: "Charcoal Grey Slim Fit Suit",
    description: "Tuxedo-style 3-piece suit in premium charcoal grey wool. Includes blazer, waistcoat, and trousers.",
    image: "https://images.unsplash.com/photo-1594932224010-75f2a77a661b?w=1920&q=80&fit=crop",
    price: 9999,
    category: "men",
    subCategory: "shirts",
    brand: "Royal Stitch",
    size: ["M", "L", "XL", "XXL"],
    color: ["gray", "charcoal"],
    stock: 12,
    rating: 4.9,
    reviewsCount: 42,
  },
  {
    name: "Hand-Block Printed Cotton Kurta",
    description: "Breathable cotton kurta with traditional hand-block print. Ideal for daily wear and small gatherings.",
    image: "https://images.unsplash.com/photo-1598188306155-2d9d3004e0b7?w=1920&q=80&fit=crop",
    price: 1599,
    category: "men",
    subCategory: "essential",
    brand: "Indigo Soul",
    size: ["S", "M", "L", "XL", "XXL"],
    color: ["blue", "white"],
    stock: 50,
    rating: 4.6,
    reviewsCount: 156,
  },
  {
    name: "Italian Leather Suede Jacket",
    description: "Premium chocolate brown suede leather jacket with ribbed cuffs and classic collar. A luxury autumn essential.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1920&q=80&fit=crop",
    price: 12999,
    category: "men",
    subCategory: "jackets",
    brand: "Luxe Biker",
    size: ["S", "M", "L", "XL"],
    color: ["brown"],
    stock: 7,
    rating: 5.0,
    reviewsCount: 24,
  },
  {
    name: "Classic Oxford White Shirt",
    description: "High-grade 100% cotton Oxford shirt. Crisp, durable, and perfect for any formal occasion.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1920&q=80&fit=crop",
    price: 2499,
    category: "men",
    subCategory: "shirts",
    brand: "Simply White",
    size: ["S", "M", "L", "XL", "XXL"],
    color: ["white"],
    stock: 100,
    rating: 4.7,
    reviewsCount: 312,
  },

  // --- GEN Z STREETWEAR ---
  {
    name: "Varsity Heavy Baggy Bomber",
    description: "Over-sized varsity jacket with felt body and vegan leather sleeves. Retro street aesthetic for the Gen Z tribe.",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1920&q=80&fit=crop",
    price: 3699,
    category: "genz",
    subCategory: "jackets",
    brand: "Campus Vibe",
    size: ["S", "M", "L", "XL", "XXL"],
    color: ["black", "green", "red"],
    stock: 30,
    rating: 4.8,
    reviewsCount: 145,
  },
  {
    name: "Distressed Wide-Leg Denim",
    description: "Signature baggy denim with knee rips and frayed edges. Sustainable organic cotton with a vintage wash.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1920&q=80&fit=crop",
    price: 2799,
    category: "genz",
    subCategory: "jeans",
    brand: "Hype Denim",
    size: ["28", "30", "32", "34", "36"],
    color: ["blue", "gray"],
    stock: 45,
    rating: 4.7,
    reviewsCount: 203,
  },
  {
    name: "Puff Print Oversized Tee",
    description: "Heavyweight 240 GSM cotton tee with signature puff-print graphics on back. Boxy relaxed fit.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1920&q=80&fit=crop",
    price: 1499,
    category: "genz",
    subCategory: "tshirts",
    brand: "StreetVibe",
    size: ["S", "M", "L", "XL", "XXL", "Free Size"],
    color: ["black", "white", "pink"],
    stock: 80,
    rating: 4.6,
    reviewsCount: 312,
  }
];

async function fetchApparel() {
  let allProducts = [];

  // Seed curated items first (This ensures variety even if searches fail)
  allProducts = [...CURATED_PRODUCTS];

  // Expansion via searches with much higher limits
  const expandedSearches = [
    ...GLOBAL_SEARCHES, 
    "saree", "kurta", "lehenga", "suit", "sneakers", "hoodie", "denim", "skirt", "tunic"
  ];

  for (const term of expandedSearches) {
    const data = await searchDJ(term, 100); 
    const mapped = data.products
      .filter(p => isClothing(p))
      .map(p => {
         let cat = "men";
         const lower = (p.title + " " + p.description + " " + p.category).toLowerCase();
         if (lower.includes("women") || lower.includes("lady") || lower.includes("dress") || lower.includes("skirt") || lower.includes("top") || lower.includes("saree")) cat = "women";
         if (lower.includes("kid") || lower.includes("baby") || lower.includes("child") || lower.includes("boy") || lower.includes("girl") || lower.includes("toy")) cat = "kids";
         if (lower.includes("unisex") || lower.includes("hoodie") || lower.includes("sneaker")) {
            // Randomly assign some unisex items to Gen Z for variety
            if (Math.random() > 0.7) cat = "genz";
         }
         
         const hdImage = (p.images && p.images.length > 0) ? p.images[0] : p.thumbnail;

         return {
           name: p.title,
           description: p.description,
           image: hdImage,
           price: Math.round(p.price * 80),
           category: cat,
           subCategory: p.category.includes("-") ? p.category.split("-").pop() : p.category,
           brand: p.brand || "Mayur Poshak",
           size: cat === "kids" ? RANDOM_SIZES.kids : (cat === "genz" ? RANDOM_SIZES.genz : RANDOM_SIZES.clothing),
           color: getRandomColors(),
           stock: p.stock,
           rating: p.rating,
           reviewsCount: Math.floor(Math.random() * 200) + 10,
         };
      });
    allProducts = [...allProducts, ...mapped];
  }

  // Focused Kids Searches
  for (const term of KIDS_SEARCHES) {
    const data = await searchDJ(term, 50);
    const mapped = data.products.map(p => {
      const hdImage = (p.images && p.images.length > 0) ? p.images[0] : p.thumbnail;
      return {
        name: p.title,
        description: p.description,
        image: hdImage,
        price: Math.round(p.price * 80),
        category: "kids",
        subCategory: "essentials",
        brand: p.brand || "Mayur Kids",
        size: RANDOM_SIZES.kids,
        color: getRandomColors(),
        stock: p.stock,
        rating: p.rating,
        reviewsCount: Math.floor(Math.random() * 100) + 5,
      };
    });
    allProducts = [...allProducts, ...mapped];
  }

  // Final Deduplication
  const unique = Array.from(new Map(allProducts.map(item => [item.name, item])).values());
  
  return unique.filter(p => {
     if (p.category === "kids" || p.category === "genz") return true; 
     return isClothing(p);
  });
}

function isClothing(p) {
  const lowerText = (p.title + " " + p.description + " " + p.category).toLowerCase();
  const isC = CLOTHING_KEYWORDS.some(k => lowerText.includes(k)) || lowerText.includes("saree") || lowerText.includes("ethic");
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
  const count = Math.floor(Math.random() * 3) + 1;
  return RANDOM_COLORS.sort(() => 0.5 - Math.random()).slice(0, count);
}

export async function GET() {
  try {
    await connectDB();
    await Product.deleteMany({});
    const clothingData = await fetchApparel();
    if (clothingData.length === 0) return Response.json({ message: "No data found" }, { status: 404 });
    const inserted = await Product.insertMany(clothingData);
    return Response.json({
      message: "Seeded vast clothing catalog with high variety across all categories",
      count: inserted.length,
      categories: await Product.distinct("category"),
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json({ message: "Seeding failed", error: error.message }, { status: 500 });
  }
}
