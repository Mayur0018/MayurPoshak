"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  PlusIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import { TfiLayoutGrid2, TfiLayoutGrid3, TfiLayoutGrid4 } from "react-icons/tfi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import toast, { Toaster } from "react-hot-toast";

const sortOptions = [
  { name: "Newest", value: "createdAt", current: true },
  { name: "Price: Low to High", value: "price-asc", current: false },
  { name: "Price: High to Low", value: "price-desc", current: false },
  { name: "Best Rating", value: "rating", current: false },
];

const subCategories = [
  { id: "hoodies", name: "Hoodies" },
  { id: "pants", name: "Pants & Joggers" },
  { id: "tshirts", name: "T-Shirts" },
  { id: "jackets", name: "Jackets" },
  { id: "jeans", name: "Jeans" },
  { id: "sweatshirts", name: "Sweatshirts" },
  { id: "shirts", name: "Shirts" },
  { id: "shorts", name: "Shorts" },
];

const filters = [
  {
    id: "size",
    name: "Size",
    options: [
      { value: "S", label: "S" },
      { value: "M", label: "M" },
      { value: "L", label: "L" },
      { value: "XL", label: "XL" },
      { value: "XXL", label: "XXL" },
      { value: "Free Size", label: "Free Size" },
    ],
  },
  {
    id: "color",
    name: "Color",
    options: [
      { value: "black", label: "Black" },
      { value: "white", label: "White" },
      { value: "blue", label: "Blue" },
      { value: "beige", label: "Beige" },
      { value: "gray", label: "Gray" },
      { value: "green", label: "Green" },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function GenZPage() {
  const dispatch = useDispatch();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cols, setCols] = useState(3);
  const [priceRange, setPriceRange] = useState(25000);
  const [availability, setAvailability] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState({
    subCategory: [],
    size: [],
    color: [],
    sort: "createdAt"
  });

  const handleFilterChange = (sectionId, value) => {
    setSelectedFilters((prev) => {
      const current = prev[sectionId] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [sectionId]: updated };
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products?category=genz&sort=${selectedFilters.sort}`;
        if (priceRange < 25000) url += `&maxPrice=${priceRange}`;
        if (availability !== "all") url += `&availability=${availability}`;
        
        if (selectedFilters.subCategory.length > 0) {
           selectedFilters.subCategory.forEach(s => url += `&subCategory=${s}`);
        }
        if (selectedFilters.size.length > 0) {
          selectedFilters.size.forEach(s => url += `&size=${s}`);
        }
        if (selectedFilters.color.length > 0) {
          selectedFilters.color.forEach(c => url += `&color=${encodeURIComponent(c)}`);
        }
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedFilters, priceRange, availability]);

  const clearFilters = () => {
    setSelectedFilters({ subCategory: [], size: [], color: [], sort: "createdAt" });
    setPriceRange(25000);
    setAvailability("all");
  };

  const removeFilter = (key, value) => {
    if (key === 'maxPrice') setPriceRange(25000);
    else if (key === 'availability') setAvailability("all");
    else {
      setSelectedFilters(prev => ({
        ...prev,
        [key]: prev[key].filter(v => v !== value)
      }));
    }
  };

  const hasActiveFilters = priceRange < 25000 || availability !== "all" || Object.values(selectedFilters).some(v => Array.isArray(v) && v.length > 0);

  return (
    <div className="bg-white min-h-screen">
      <Toaster position="top-right" />
      
      {/* Mobile Filter Dialog */}
      <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-[150] lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/25 transition-opacity duration-300" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900 uppercase tracking-[0.2em]">Gen Z Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form className="mt-4 border-t border-gray-200">
              <h3 className="px-4 mt-6 text-xs font-bold text-gray-900 uppercase tracking-widest">Styles</h3>
              <ul className="px-4 py-3 font-medium text-gray-900 flex flex-wrap gap-2">
                {subCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleFilterChange("subCategory", cat.id)}
                      className={classNames(
                        selectedFilters.subCategory.includes(cat.id) ? "bg-black text-white" : "bg-gray-100 text-gray-600",
                        "px-3 py-1.5 rounded-full text-[10px] transition font-bold uppercase tracking-widest"
                      )}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>

              {filters.map((section) => (
                <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
                  <h3 className="-mx-2 -my-3 flow-root">
                    <DisclosureButton className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                      <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">{section.name}</span>
                      <span className="ml-6 flex items-center">
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel className="pt-6">
                    <div className="space-y-6">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-mobile-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            type="checkbox"
                            checked={selectedFilters[section.id].includes(option.value)}
                            onChange={() => handleFilterChange(section.id, option.value)}
                            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                          />
                          <label htmlFor={`filter-mobile-${section.id}-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-xs text-gray-500 uppercase tracking-widest">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ))}
              
              <div className="px-4 mt-8">
                <button 
                  onClick={clearFilters}
                  type="button"
                  className="w-full py-4 bg-black text-white text-xs font-bold tracking-[0.2em] rounded-full"
                >
                  RESET FILTERS
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 pt-12 md:pt-24 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400 font-bold">New Drop</p>
            <h1 className="text-3xl md:text-5xl font-extralight tracking-tighter text-gray-900 uppercase mt-2">Gen Z Collection</h1>
            <p className="text-sm text-gray-400 mt-2">Baggy • Oversized • {products.length} Items</p>
          </div>

          <div className="flex items-center gap-4">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="group inline-flex justify-center text-xs font-bold text-gray-700 hover:text-gray-900 uppercase tracking-[0.2em] border border-gray-100 px-6 py-2.5 rounded-full transition">
                  Sort
                  <ChevronDownIcon className="-mr-1 ml-1 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-[40] mt-2 w-48 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.name}>
                      <button
                        onClick={() => setSelectedFilters(prev => ({ ...prev, sort: option.value }))}
                        className={classNames(
                          option.value === selectedFilters.sort ? "font-bold text-gray-900 bg-gray-50" : "text-gray-500",
                          "block w-full text-left px-5 py-3.5 text-[10px] uppercase tracking-widest hover:bg-gray-50 transition"
                        )}
                      >
                        {option.name}
                      </button>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden border border-gray-100 p-2.5 rounded-full text-gray-500">
              <FunnelIcon className="h-5 w-5" />
            </button>

            {/* Desktop Grid Switcher */}
            <div className="hidden lg:flex items-center border border-gray-100 rounded-full px-5 py-2.5 gap-5 h-[42px]">
              <button onClick={() => setCols(2)} className={classNames(cols === 2 ? "text-black" : "text-gray-300", "hover:text-black transition")}>
                <TfiLayoutGrid2 className="text-xl" />
              </button>
              <button onClick={() => setCols(3)} className={classNames(cols === 3 ? "text-black" : "text-gray-300", "hover:text-black transition")}>
                <TfiLayoutGrid3 className="text-xl" />
              </button>
              <button onClick={() => setCols(4)} className={classNames(cols === 4 ? "text-black" : "text-gray-300", "hover:text-black transition")}>
                <TfiLayoutGrid4 className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Category Ribbon */}
        <div className="lg:hidden -mx-4 px-4 overflow-x-auto no-scrollbar py-4 border-b border-gray-100 bg-white sticky top-[100px] z-20 shadow-sm">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={clearFilters}
              className={classNames(
                !selectedFilters.subCategory.length ? "bg-black text-white" : "bg-gray-50 text-gray-400 font-medium",
                "px-5 py-2 rounded-full text-[10px] uppercase tracking-widest transition shadow-sm whitespace-nowrap"
              )}
            >
              All Vibes
            </button>
            {subCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterChange("subCategory", cat.id)}
                className={classNames(
                  selectedFilters.subCategory.includes(cat.id) ? "bg-black text-white" : "bg-gray-50 text-gray-400 font-medium",
                  "px-5 py-2 rounded-full text-[10px] uppercase tracking-widest transition shadow-sm whitespace-nowrap"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-3 py-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <button 
              onClick={clearFilters}
              className="px-4 py-1.5 border border-black bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm"
            >
              Clear All
            </button>
            <span className="w-px h-4 bg-gray-200 mx-1" />
            
            {priceRange < 25000 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full group hover:border-black transition cursor-pointer" onClick={() => removeFilter('maxPrice')}>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Price:</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Under ₹{priceRange.toLocaleString()}</span>
                <XMarkIcon className="h-3 w-3 text-gray-300 group-hover:text-black" />
              </div>
            )}

            {availability !== "all" && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full group hover:border-black transition cursor-pointer" onClick={() => removeFilter('availability')}>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Status:</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">{availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}</span>
                <XMarkIcon className="h-3 w-3 text-gray-300 group-hover:text-black" />
              </div>
            )}

            {Object.entries(selectedFilters).map(([key, vals]) => 
              Array.isArray(vals) && vals.map(val => (
                <div key={`${key}-${val}`} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full group hover:border-black transition cursor-pointer" onClick={() => removeFilter(key, val)}>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{key}:</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{val}</span>
                  <XMarkIcon className="h-3 w-3 text-gray-300 group-hover:text-black" />
                </div>
              ))
            )}
          </div>
        )}

        <section className="pb-24 pt-10">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Desktop Filters */}
            <form className="hidden lg:block sticky top-28 h-fit pr-8">
              {/* Availability */}
              <div className="mb-10">
                <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.3em] mb-6">Availability</h3>
                <div className="space-y-4">
                  {[
                    { id: 'all', label: 'All Gear' },
                    { id: 'in-stock', label: 'In stock' },
                    { id: 'out-of-stock', label: 'Out of stock' }
                  ].map((opt) => (
                    <div key={opt.id} className="flex items-center group cursor-pointer" onClick={() => setAvailability(opt.id)}>
                      <div className={classNames(
                        availability === opt.id ? "bg-black border-black" : "border-gray-200 bg-white",
                        "w-4 h-4 rounded border flex items-center justify-center transition-all duration-300"
                      )}>
                        {availability === opt.id && <CheckIcon className="h-3 w-3 text-white" />}
                      </div>
                      <span className={classNames(
                        availability === opt.id ? "text-black font-bold" : "text-gray-400",
                        "ml-3 text-[10px] uppercase tracking-widest transition-all group-hover:text-black"
                      )}>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-10 border-t border-gray-100 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.3em]">Price</h3>
                  <button onClick={() => setPriceRange(25000)} className="text-[9px] font-bold text-gray-400 hover:text-black uppercase tracking-widest underline decoration-dotted">Reset</button>
                </div>
                <div className="px-1">
                  <input 
                    type="range" min="0" max="25000" step="500" value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black mb-4"
                  />
                  <div className="flex items-center justify-between text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                    <span>₹0</span>
                    <span className="text-black bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">Under ₹{priceRange.toLocaleString()}</span>
                    <span>₹25k+</span>
                  </div>
                </div>
              </div>

              <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.3em] mb-6">Styles</h3>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest">
                {subCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => handleFilterChange("subCategory", category.id)}
                      className={classNames(
                        selectedFilters.subCategory.includes(category.id) ? "text-black font-black" : "text-gray-400 hover:text-black",
                        "transition-colors"
                      )}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>

              {filters.map((section) => (
                <Disclosure key={section.id} as="div" className="border-t border-gray-100 mt-8 py-6" defaultOpen>
                  <h3 className="-my-3 flow-root">
                    <DisclosureButton className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-bold text-gray-900 uppercase tracking-[0.2em] text-[10px]">{section.name}</span>
                      <span className="ml-6 flex items-center">
                        <PlusIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel className="pt-6">
                    <div className="space-y-4">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            type="checkbox"
                            checked={selectedFilters[section.id].includes(option.value)}
                            onChange={() => handleFilterChange(section.id, option.value)}
                            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                          />
                          <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer hover:text-black transition">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ))}

              <button onClick={clearFilters} type="button" className="mt-8 w-full py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-[10px] font-bold tracking-[0.2em] rounded-full hover:bg-black hover:text-white transition-all duration-300">
                CLEAR ALL
              </button>
            </form>

            {/* Product grid */}
            <div className="lg:col-span-3">
               {loading ? (
                <div className="flex flex-col justify-center items-center h-96 gap-4">
                  <div className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full animate-spin" />
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Vibing with Results...</p>
                </div>
               ) : products.length > 0 ? (
                <div className={classNames(
                  "grid gap-x-6 gap-y-12 transition-all duration-500",
                  cols === 2 ? "grid-cols-1 sm:grid-cols-2" : 
                  cols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : 
                  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                )}>
                  {products.map((product, index) => (
                    <motion.div 
                      key={product._id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative flex flex-col"
                    >
                      <Link href={`/product/${product._id}`} className="block">
                        <div className="aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-gray-50 group-hover:opacity-95 relative shadow-sm transition-all duration-500 group-hover:shadow-2xl border border-gray-50">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="h-full w-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700"
                          />
                           <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg">
                                <i className="ti ti-heart text-lg text-gray-900" />
                              </button>
                           </div>
                        </div>
                        <div className="mt-6 flex flex-col items-center flex-1 text-center">
                          <h3 className="text-[10px] font-bold tracking-[.3em] uppercase text-gray-400 mb-2">{product.brand || 'Mayur Poshak'}</h3>
                          <p className="text-sm font-bold text-gray-900 truncate w-full px-4 tracking-tighter">{product.name}</p>
                          <p className="mt-2 text-lg font-extralight text-gray-900 tracking-tight">₹{Number(product.price).toLocaleString("en-IN")}</p>
                          
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(addToCart(product));
                              toast.success("Vibe Check: Added to cart!");
                            }}
                            className="mt-5 w-fit px-8 py-2.5 bg-black text-white text-[9px] font-black tracking-[0.2em] rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                          >
                            ADD TO CART
                          </button>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
               ) : (
                <div className="text-center py-40 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                   <h2 className="text-2xl font-light text-gray-900 uppercase tracking-[0.2em] mb-4">No Vibe Matches</h2>
                   <button onClick={clearFilters} className="px-12 py-4 bg-black text-white text-xs font-bold tracking-[0.3em] rounded-full shadow-2xl">
                     RESET FILTERS
                   </button>
                </div>
               )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
