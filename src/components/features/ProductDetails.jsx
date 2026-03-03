"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import ReviewSection from "./ReviewSection";
import { FiHeart, FiShare2, FiShield, FiRotateCcw, FiTruck, FiInfo, FiChevronDown, FiMapPin } from "react-icons/fi";
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import RecentlyViewed from "./RecentlyViewed";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Shimmer component
const Shimmer = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

// ✅ Star Rating Component
const StarRating = ({ rating, count }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) stars.push(<FaStar key={i} className="text-orange-400" />);
    else if (i - 0.5 <= rating) stars.push(<FaStarHalfAlt key={i} className="text-orange-400" />);
    else stars.push(<FaRegStar key={i} className="text-gray-300" />);
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-sm">{stars}</div>
      <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">{count} ratings</span>
    </div>
  );
};

// ✅ Accordion Component
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-bold text-slate-800 uppercase tracking-tight"
      >
        {title}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <FiChevronDown size={18} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 text-sm text-gray-600 leading-relaxed font-medium">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductDetails({ product, relatedProducts = [] }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState(null);

  // Mock additional images if not present
  const images = product.images?.length > 0 ? [product.image, ...product.images] : [product.image, product.image, product.image, product.image];
  const highlights = product.highlights || [
    "Premium quality ethnic wear",
    "Handcrafted embroidery details",
    "Perfect for weddings and festive occasions",
    "Breathable and comfortable fabric"
  ];
  const mrp = product.mrp || Math.round(product.price * 1.4);
  const discount = Math.round(((mrp - product.price) / mrp) * 100);

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const user = await res.json();
          const id = product._id || product.id;
          const wishlistRes = await fetch("/api/wishlist");
          const data = await wishlistRes.json();
          if (Array.isArray(data)) {
            setIsWishlisted(data.some((w) => w.productId?._id === id || w.productId === id));
          }
        }
      } catch (err) {
        console.error("Wishlist check error:", err);
      }
    };
    checkWishlist();
  }, [product]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (product && !loading) {
      const trackView = () => {
        const id = product._id || product.id;
        try {
          const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
          const filtered = recent.filter((p) => p.id !== id);
          const updated = [{ id, name: product.name, price: product.price, image: product.image || "/placeholder.png" }, ...filtered].slice(0, 15);
          localStorage.setItem("recentlyViewed", JSON.stringify(updated));
        } catch (e) { console.error(e); }
      };
      trackView();
    }
  }, [product, loading]);

  const toggleWishlist = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        toast.error("Please sign in to add to wishlist");
        router.push("/Signin");
        return;
      }
      const productId = product._id || product.id;
      if (isWishlisted) {
        await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Wishlist operation failed");
    }
  };

  const handleAddtoCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    dispatch(addToCart({ ...product, selectedSize }));
    toast.success("Added to cart!");
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleCheckDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryStatus("loading");
      setTimeout(() => setDeliveryStatus("Available by Tue, Mar 4"), 1000);
    } else {
      toast.error("Enter valid 6-digit pincode");
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-4 md:p-10 pt-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-1 flex flex-col gap-3 order-2 lg:order-1">
          {[1, 2, 3, 4].map(i => <Shimmer key={i} className="w-full aspect-square" />)}
        </div>
        <div className="lg:col-span-5 order-1 lg:order-2">
          <Shimmer className="w-full aspect-[3/4]" />
        </div>
        <div className="lg:col-span-6 space-y-6 order-3">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-10 w-3/4" />
          <Shimmer className="h-6 w-1/3" />
          <Shimmer className="h-16 w-full" />
          <div className="flex gap-4">
             <Shimmer className="h-14 w-full" />
             <Shimmer className="h-14 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-[1400px] mx-auto p-4 md:p-10 pt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Gallery Thumbnails (Desktop side) */}
        <div className="hidden lg:flex lg:col-span-1 flex-col gap-3 sticky top-28">
          {images.map((img, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setActiveImage(idx)}
              className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
            >
              <Image src={img || "/placeholder.png"} alt="thumb" fill className="object-cover" />
            </button>
          ))}
        </div>

        {/* Main Image View */}
        <div className="lg:col-span-5 relative group">
          <div 
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomPos({ ...zoomPos, show: false })}
          >
            <Image
              src={images[activeImage] || "/placeholder.png"}
              alt={product.name}
              fill
              priority
              className="object-cover object-top transition-transform duration-500"
              style={{ transform: zoomPos.show ? 'scale(1.2)' : 'scale(1)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }}
            />
            
            {/* Quick badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
               <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">NEW TREND</span>
               {discount > 20 && <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">{discount}% OFF</span>}
            </div>

            <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-black hover:text-white transition-all">
              <FiShare2 size={18} />
            </button>
          </div>

          {/* Mobile Dots */}
          <div className="flex lg:hidden justify-center gap-2 mt-4">
             {images.map((_, i) => (
               <div key={i} className={`h-1.5 rounded-full transition-all ${activeImage === i ? 'w-6 bg-black' : 'w-1.5 bg-gray-300'}`} />
             ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="lg:col-span-6 space-y-8 flex flex-col h-full lg:px-6">
          <header className="space-y-3">
             <div className="flex justify-between items-start">
               <div>
                  <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest">{product.brand || "MAYUR POSHAK"}</h4>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 leading-tight">{product.name}</h1>
               </div>
               <button 
                onClick={toggleWishlist}
                className={`p-3 rounded-full border transition-all ${isWishlisted ? 'bg-red-50 border-red-100 text-red-500' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-black'}`}
               >
                 {isWishlisted ? <FaHeart size={20} /> : <FiHeart size={20} />}
               </button>
             </div>
             
             <StarRating rating={product.rating || 4.5} count={product.reviewsCount || 12} />

             {/* SKU & Stock Status */}
             <div className="flex flex-wrap items-center gap-3 mt-1">
               {product.sku && (
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                   SKU: {product.sku}
                 </span>
               )}
               <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                 product.stock > 5
                   ? 'bg-green-50 text-green-600 border-green-100'
                   : product.stock > 0
                     ? 'bg-amber-50 text-amber-600 border-amber-100'
                     : 'bg-red-50 text-red-500 border-red-100'
               }`}>
                 <span className={`w-1.5 h-1.5 rounded-full ${
                   product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                 }`} />
                 {product.stock > 5
                   ? 'In Stock'
                   : product.stock > 0
                     ? `Only ${product.stock} left`
                     : 'Out of Stock'}
               </span>
             </div>
          </header>

          <div className="space-y-1">
             <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{product.price}</span>
                <span className="text-xl text-gray-400 line-through font-bold">₹{mrp}</span>
                <span className="text-orange-600 font-extrabold text-lg">({discount}% OFF)</span>
             </div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inclusive of all taxes</p>
          </div>

          {/* Offers */}
          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 space-y-3">
             <h5 className="text-[11px] font-black text-orange-800 uppercase tracking-widest flex items-center gap-2">
                <FiInfo /> SPECIAL OFFERS
             </h5>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-orange-100 shadow-sm">
                   <p className="text-[10px] font-bold text-gray-400 uppercase">BANK OFFER</p>
                   <p className="text-xs font-bold text-slate-800 mt-1">10% Instant Discount on SBI Cards</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-orange-100 shadow-sm">
                   <p className="text-[10px] font-bold text-gray-400 uppercase">BUY CORE</p>
                   <p className="text-xs font-bold text-slate-800 mt-1">Buy 2 Get 1 Free on all Sarees</p>
                </div>
             </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Size</h3>
              <button className="text-[10px] font-bold text-blue-600 uppercase underline">Size Chart</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {["SM", "MD", "LG", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 rounded-xl border-2 font-black transition-all flex items-center justify-center text-sm
                    ${selectedSize === size ? "border-black bg-black text-white shadow-lg" : "border-gray-100 text-slate-800 hover:border-gray-300"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Checker */}
          <div className="space-y-4 bg-gray-50 border border-gray-100 p-5 rounded-2xl">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <FiMapPin /> Delivery Check
            </h3>
            <div className="relative flex gap-2">
              <input 
                type="text" 
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode (6-digit)"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-black transition-all"
              />
              <button 
                onClick={handleCheckDelivery}
                className="bg-black text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-sm"
              >
                CHECK
              </button>
            </div>
            {deliveryStatus && (
              <p className={`text-xs font-bold ${deliveryStatus === 'loading' ? 'text-gray-400 animate-pulse' : 'text-green-600'}`}>
                {deliveryStatus === 'loading' ? 'Checking availability...' : deliveryStatus}
              </p>
            )}
          </div>

          {/* Large Action Buttons (Desktop) */}
          <div className="hidden md:flex gap-4 pt-4">
             <button 
              onClick={handleAddtoCart}
              className="flex-1 bg-white border-2 border-black text-black h-16 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl active:scale-95"
             >
                Add to Cart
             </button>
             <button className="flex-1 bg-black text-white h-16 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95">
                Buy It Now
             </button>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-between items-center py-6 border-y border-gray-100 mt-4">
             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><FiTruck size={20} /></div>
                <span className="text-[10px] font-black uppercase text-gray-500">Free Shipping</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><FiRotateCcw size={20} /></div>
                <span className="text-[10px] font-black uppercase text-gray-500">7 Day Returns</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center"><FiShield size={20} /></div>
                <span className="text-[10px] font-black uppercase text-gray-500">Secure Payment</span>
             </div>
          </div>

          {/* Accordion Info */}
          <div className="pt-4">
             <Accordion title="Product Highlights" defaultOpen={true}>
                <ul className="list-disc pl-5 space-y-2">
                   {highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
             </Accordion>
             <Accordion title="Detailed Specifications">
                <div className="grid grid-cols-2 gap-4">
                   {product.specifications ? Object.entries(product.specifications).map(([key, value]) => (
                     <div key={key}>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{key}</p>
                       <p className="text-xs font-bold text-slate-800 mt-1">{value}</p>
                     </div>
                   )) : (
                     <>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fabric</p>
                          <p className="text-xs font-bold text-slate-800 mt-1">Premium Blend</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Occasion</p>
                          <p className="text-xs font-bold text-slate-800 mt-1">Festive / Party</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pattern</p>
                          <p className="text-xs font-bold text-slate-800 mt-1">Embellished</p>
                        </div>
                     </>
                   )}
                </div>
             </Accordion>
             <Accordion title="Shipping & Returns">
                <p>Standard delivery takes 3-5 business days. We offer a 7-day easy return policy for this product. Shipping is free on all prepaid orders.</p>
             </Accordion>
          </div>
        </div>
      </div>

      {/* Cross-Sell Recommendations */}
      <div className="border-t border-gray-50 mt-20 pt-20">
        <RecentlyViewed currentProductId={product._id || product.id} />
        
        {relatedProducts.length > 0 && (
          <div className="mt-16 px-4 md:px-8 max-w-[1920px] mx-auto overflow-hidden">
            <div className="flex flex-col items-center mb-10 text-center">
              <h3 className="text-2xl md:text-3xl font-black text-black font-playfair tracking-tighter uppercase italic">YOU MAY ALSO LOVE</h3>
              <div className="h-1.5 w-24 bg-black mt-2 rounded-full" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {relatedProducts.map((item) => (
                <Link key={item._id} href={`/product/${item._id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gray-50 mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover object-top group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <button className="w-full bg-white/95 backdrop-blur-md text-black py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">QUICK SHOP</button>
                    </div>
                  </div>
                  <div className="space-y-1 text-center">
                    <h4 className="text-[14px] font-black text-gray-800 truncate uppercase tracking-tight group-hover:text-black transition-all font-sans">{item.name}</h4>
                    <div className="flex justify-center items-center gap-2">
                       <p className="text-[16px] text-gray-900 font-black italic">₹{item.price}</p>
                       <p className="text-[12px] text-gray-400 line-through">₹{Math.round(item.price * 1.4)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-20 border-t border-gray-50">
         <ReviewSection productId={product._id || product.id} />
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-6 z-40 md:hidden grid grid-cols-2 gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
         <button 
          onClick={handleAddtoCart}
          className="bg-white border-2 border-black text-black h-12 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
         >
           Add to Cart
         </button>
         <button className="bg-black text-white h-12 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform shadow-lg">
           Buy Now
         </button>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #ddd; }
      `}</style>
    </div>
  );
}
