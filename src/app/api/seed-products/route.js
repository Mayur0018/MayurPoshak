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
   Gen Z Baggy Collection — curated HD images
   ────────────────────────────────────────────── */
const GENZ_BAGGY_PRODUCTS = [
  {
    name: "Oversized Vintage Washed Hoodie",
    description: "Ultra-soft oversized hoodie with a vintage washed finish. Drop shoulders and relaxed fit for that effortless Gen Z aesthetic. Perfect for layering or solo street-style looks.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1920&q=80&fit=crop",
    price: 2499,
    category: "genz",
    subCategory: "hoodies",
    brand: "StreetVibe",
    size: ["S", "M", "L", "XL", "XXL", "Free Size"],
    color: ["black", "gray"],
    stock: 45,
    rating: 4.6,
    reviewsCount: 87,
  },
  {
    name: "Wide Leg Baggy Cargo Pants",
    description: "Y2K-inspired wide leg cargo pants with multiple utility pockets, adjustable drawstring waist, and relaxed parachute silhouette. A Gen Z wardrobe essential.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1920&q=80&fit=crop",
    price: 1899,
    category: "genz",
    subCategory: "pants",
    brand: "UrbanDrift",
    size: ["S", "M", "L", "XL", "XXL"],
    color: ["black", "beige", "green"],
    stock: 60,
    rating: 4.5,
    reviewsCount: 124,
  },
  {
    name: "Baggy Graphic Oversized Tee",
    description: "Heavyweight cotton oversized t‑shirt with bold back graphic print. Dropped shoulders and boxy cut give this tee its signature Gen Z look.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1920&q=80&fit=crop",
    price: 999,
    category: "genz",
    subCategory: "tshirts",
    brand: "HypeCulture",
    size: ["S", "M", "L", "XL", "XXL", "Free Size"],
    color: ["white", "black"],
    stock: 80,
    rating: 4.3,
    reviewsCount: 203,
  },
  {
    name: "Loose Fit Denim Jacket – Washed Blue",
    description: "Relaxed fit denim jacket in a vintage washed blue. Features oversized pockets, wide collar, and a cropped-yet-baggy silhouette. Ideal for streetwear layering.",
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=1920&q=80&fit=crop",
    price: 3299,
    category: "genz",
    subCategory: "jackets",
    brand: "DenimLab",
    size: ["S", "M", "L", "XL"],
    color: ["blue"],
    stock: 30,
    rating: 4.7,
    reviewsCount: 65,
  },
  {
    name: "Parachute Baggy Joggers",
    description: "Lightweight nylon parachute joggers with elastic cuffs and toggle drawstring. The ultimate comfort-meets-style piece for the Gen Z streetwear wardrobe.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1920&q=80&fit=crop",
    price: 1699,
    category: "genz",
    subCategory: "pants",
    brand: "ParaDrop",
    size: ["S", "M", "L", "XL", "XXL"],
    color: ["black", "gray", "white"],
    stock: 55,
    rating: 4.4,
    reviewsCount: 156,
  },
  {
    name: "Oversized Puffer Jacket",
    description: "Chunky oversized puffer jacket with high collar and zip front. Filled with premium insulation for warmth without the bulk. A statement piece for winter street style.",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1920&q=80&fit=crop",
    price: 4499,
    category: "genz",
    subCategory: "jackets",
    brand: "ArcticVibe",
    size: ["S", "M", "L", "XL"],
    color: ["black", "navy"],
    stock: 25,
    rating: 4.8,
    reviewsCount: 42,
  },
  {
    name: "Baggy Ripped Boyfriend Jeans",
    description: "Relaxed boyfriend-fit jeans with trendy distressed rips and a low-rise waist. Crafted from premium denim with a lived-in washed finish.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1920&q=80&fit=crop",
    price: 2199,
    category: "genz",
    subCategory: "jeans",
    brand: "RawEdge",
    size: ["S", "M", "L", "XL", "XXL"],
    color: ["blue", "black"],
    stock: 50,
    rating: 4.5,
    reviewsCount: 178,
  },
  {
    name: "Drop Shoulder Sweatshirt – Neutral Tone",
    description: "Minimalist oversized sweatshirt in muted neutral tones. Features a heavy-weight fleece interior and drop-shoulder design for maximum comfort.",
    image: "https://images.unsplash.com/photo-1578768079470-c6e1e26f4b42?w=1920&q=80&fit=crop",
    price: 1799,
    category: "genz",
    subCategory: "sweatshirts",
    brand: "Mellow",
    size: ["S", "M", "L", "XL", "Free Size"],
    color: ["beige", "gray", "white"],
    stock: 40,
    rating: 4.6,
    reviewsCount: 91,
  },
  {
    name: "Wide Leg Linen Trousers",
    description: "Breathable linen trousers with a wide-leg cut and elastic waistband. Clean and minimal, perfect for a relaxed Gen Z summer look.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1920&q=80&fit=crop",
    price: 1599,
    category: "genz",
    subCategory: "pants",
    brand: "EarthTone",
    size: ["S", "M", "L", "XL"],
    color: ["beige", "white", "black"],
    stock: 35,
    rating: 4.3,
    reviewsCount: 69,
  },
  {
    name: "Oversized Flannel Shirt",
    description: "Classic flannel shirt in an oversized fit with a bold check pattern. Soft brushed cotton fabric, perfect for layering over tees or wearing open.",
    image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=1920&q=80&fit=crop",
    price: 1499,
    category: "genz",
    subCategory: "shirts",
    brand: "PlaidHouse",
    size: ["S", "M", "L", "XL", "XXL"],
    color: ["red", "blue", "green"],
    stock: 42,
    rating: 4.4,
    reviewsCount: 113,
  },
  {
    name: "Streetwear Baggy Shorts",
    description: "Knee-length baggy shorts with cargo pockets and a raw-hem finish. Made from durable cotton twill for all-day comfort.",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1920&q=80&fit=crop",
    price: 1299,
    category: "genz",
    subCategory: "shorts",
    brand: "LooseThread",
    size: ["S", "M", "L", "XL"],
    color: ["black", "beige", "navy"],
    stock: 65,
    rating: 4.2,
    reviewsCount: 87,
  },
  {
    name: "Oversized Tie-Dye Hoodie",
    description: "Vibrant hand-dyed oversized hoodie with kangaroo pocket. Each piece has a unique pattern, making it a true one‑of‑a‑kind Gen Z statement.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1920&q=80&fit=crop",
    price: 2799,
    category: "genz",
    subCategory: "hoodies",
    brand: "DyeHouse",
    size: ["M", "L", "XL", "XXL", "Free Size"],
    color: ["pink", "blue", "green"],
    stock: 20,
    rating: 4.7,
    reviewsCount: 54,
  },
  {
    name: "Baggy Multi-Pocket Cargo Pants",
    description: "Technical baggy cargo pants with 8 functional pockets and adjustable ankle straps. Crafted from durable nylon-blend fabric for a sleek techwear-inspired Gen Z look.",
    image: "https://images.unsplash.com/photo-1594938333018-095bc359392e?w=1920&q=80&fit=crop",
    price: 2999,
    category: "genz",
    subCategory: "pants",
    brand: "TechWear",
    size: ["S", "M", "L", "XL", "XXL"],
    color: ["black", "gray"],
    stock: 35,
    rating: 4.8,
    reviewsCount: 42,
  },
  {
    name: "Oversized Heavyweight Graphic Tee",
    description: "Ultra-heavyweight 300GSM cotton tee in a signature boxy oversized fit. Features a minimal chest embroidery and a bold high-density back print.",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1920&q=80&fit=crop",
    price: 1299,
    category: "genz",
    subCategory: "tshirts",
    brand: "BoldBasics",
    size: ["S", "M", "L", "XL", "XXL", "Free Size"],
    color: ["gray", "black", "white"],
    stock: 100,
    rating: 4.5,
    reviewsCount: 156,
  },
  {
    name: "Wide Leg Patchwork Denim",
    description: "Statement wide-leg jeans with unique tonal patchwork detailing and distressed hems. A perfect blend of vintage craft and modern baggy silhouette.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1920&q=80&fit=crop",
    price: 3499,
    category: "genz",
    subCategory: "jeans",
    brand: "DenimCraft",
    size: ["S", "M", "L", "XL"],
    color: ["blue"],
    stock: 25,
    rating: 4.9,
    reviewsCount: 28,
  },
  {
    name: "Baggy Corduroy Overshirt",
    description: "Textured corduroy overshirt in a relaxed, oversized fit. Featuring chunky buttons and twin chest pockets, it's the ultimate layering piece for the chill Gen Z vibe.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1920&q=80&fit=crop",
    price: 2299,
    category: "genz",
    subCategory: "shirts",
    brand: "TimberVibe",
    size: ["S", "M", "L", "XL", "XXL"],
    color: ["beige", "brown", "green"],
    stock: 40,
    rating: 4.4,
    reviewsCount: 73,
  },
  {
    name: "Oversized Colorblock Windbreaker",
    description: "Retro-inspired lightweight windbreaker with bold colorblocking and a baggy fit. Water-resistant fabric with adjustable drawstrings for a customized streetwear look.",
    image: "https://images.unsplash.com/photo-1504191463004-4105da453303?w=1920&q=80&fit=crop",
    price: 3199,
    category: "genz",
    subCategory: "jackets",
    brand: "RetroPulse",
    size: ["S", "M", "L", "XL"],
    color: ["blue", "red", "white"],
    stock: 30,
    rating: 4.6,
    reviewsCount: 51,
  },
  {
    name: "Relaxed Fit Knitted Vest",
    description: "Soft-touch knitted vest with a deep v-neck and relaxed drop. Perfect for layering over oversized shirts to add a sophisticated touch to your Gen Z fit.",
    image: "https://images.unsplash.com/photo-1614676466604-549326b71ddf?w=1920&q=80&fit=crop",
    price: 1899,
    category: "genz",
    subCategory: "sweatshirts",
    brand: "KnitCore",
    size: ["S", "M", "L", "XL", "Free Size"],
    color: ["beige", "gray", "navy"],
    stock: 45,
    rating: 4.3,
    reviewsCount: 39,
  },
];

/* ──────────────────────────────────────
   Fetch from DummyJSON (use HD images)
   ────────────────────────────────────── */
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
         
         // Use full HD image from the images array (first image), fallback to thumbnail
         const hdImage = (p.images && p.images.length > 0) ? p.images[0] : p.thumbnail;

         return {
           name: p.title,
           description: p.description,
           image: hdImage,
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
    const mapped = data.products.map(p => {
      const hdImage = (p.images && p.images.length > 0) ? p.images[0] : p.thumbnail;
      return {
        name: p.title,
        description: p.description,
        image: hdImage,
        price: Math.round(p.price * 80),
        category: "kids",
        subCategory: "essentials",
        brand: p.brand || "Kids Store",
        size: RANDOM_SIZES.kids,
        color: getRandomColors(),
        stock: p.stock,
        rating: p.rating,
        reviewsCount: Math.floor(Math.random() * 50) + 2,
      };
    });
    allProducts = [...allProducts, ...mapped];
  }

  // 3. Gen Z Baggy Collection (curated HD products)
  allProducts = [...allProducts, ...GENZ_BAGGY_PRODUCTS];

  // Deduplication
  const unique = Array.from(new Map(allProducts.map(item => [item.name, item])).values());
  
  // Final filter to ensure no laptops/phones (except kids & genz which are curated)
  return unique.filter(p => {
     if (p.category === "kids" || p.category === "genz") return true; 
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
    return Response.json({
      message: "Seeded clothing catalog with Gen Z collection",
      count: inserted.length,
      categories: await Product.distinct("category"),
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json({ message: "Seeding failed", error: error.message }, { status: 500 });
  }
}
