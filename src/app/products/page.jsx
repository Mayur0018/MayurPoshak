"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

const sortOptions = [
  { name: "Newest", value: "createdAt", current: true },
  { name: "Price: Low to High", value: "price-asc", current: false },
  { name: "Price: High to Low", value: "price-desc", current: false },
  { name: "Best Rating", value: "rating", current: false },
];

const categories = [
  { name: "Men", id: "men" },
  { name: "Women", id: "women" },
  { name: "Kids", id: "kids" },
  { name: "Gen Z", id: "genz" },
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
    ],
  },
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White" },
      { value: "black", label: "Black" },
      { value: "blue", label: "Blue" },
      { value: "red", label: "Red" },
      { value: "green", label: "Green" },
      { value: "pink", label: "Pink" },
    ],
  },
  {
    id: "brand",
    name: "Brand",
    options: [
      { value: "Mayur Poshak", label: "Mayur Poshak" },
      { value: "Raymond", label: "Raymond" },
      { value: "Peter England", label: "Peter England" },
      { value: "Van Heusen", label: "Van Heusen" },
      { value: "Allen Solly", label: "Allen Solly" },
    ],
  },
];

const ratingOptions = [
  { value: 4, label: "4★ & above" },
  { value: 3, label: "3★ & above" },
  { value: 2, label: "2★ & above" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [tab, setTab] = useState("overview");
  const [cols, setCols] = useState(3);
  const [priceRange, setPriceRange] = useState(25000);
  const [availability, setAvailability] = useState("all"); // all, in-stock, out-of-stock
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    size: [],
    color: [],
    brand: [],
    sort: "createdAt"
  });
  const [minRating, setMinRating] = useState(0);

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
        let url = `/api/products?sort=${selectedFilters.sort}`;
        if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
        if (priceRange < 25000) url += `&maxPrice=${priceRange}`;
        if (availability !== "all") url += `&availability=${availability}`;
        if (minRating > 0) url += `&minRating=${minRating}`;
        
        if (selectedFilters.category.length > 0) {
           selectedFilters.category.forEach(c => url += `&category=${c}`);
        }
        if (selectedFilters.size.length > 0) {
          selectedFilters.size.forEach(s => url += `&size=${s}`);
        }
        if (selectedFilters.color.length > 0) {
          selectedFilters.color.forEach(c => url += `&color=${encodeURIComponent(c)}`);
        }
        if (selectedFilters.brand.length > 0) {
          selectedFilters.brand.forEach(b => url += `&brand=${encodeURIComponent(b)}`);
        }
        
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedFilters, searchTerm, priceRange, availability, minRating]);

  // Sync searchTerm when URL param changes
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const clearFilters = () => {
    setSelectedFilters({ category: [], size: [], color: [], brand: [], sort: "createdAt" });
    setSearchTerm("");
    setPriceRange(25000);
    setAvailability("all");
    setMinRating(0);
  };

  const removeFilter = (key, value) => {
    if (key === 'search') setSearchTerm("");
    else if (key === 'maxPrice') setPriceRange(25000);
    else if (key === 'availability') setAvailability("all");
    else if (key === 'rating') setMinRating(0);
    else {
      setSelectedFilters(prev => ({
        ...prev,
        [key]: prev[key].filter(v => v !== value)
      }));
    }
  };

  const hasActiveFilters = searchTerm || priceRange < 25000 || availability !== "all" || minRating > 0 || Object.values(selectedFilters).some(v => Array.isArray(v) ? v.length > 0 : false);


  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Filter Dialog */}
      <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-[150] lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/25 transition-opacity duration-300" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form className="mt-4 border-t border-gray-200">
              <h3 className="px-4 mt-4 font-bold text-gray-900 text-sm uppercase">Quick Collections</h3>
              <ul className="px-4 py-3 font-medium text-gray-900 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleFilterChange("category", cat.id)}
                      className={classNames(
                        selectedFilters.category.includes(cat.id) ? "bg-black text-white" : "bg-gray-100 text-gray-600",
                        "px-3 py-1.5 rounded-full text-xs transition font-bold"
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
                          <label htmlFor={`filter-mobile-${section.id}-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-sm text-gray-500">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ))}
              
              <div className="px-4 mt-6">
                <button 
                  onClick={clearFilters}
                  type="button"
                  className="w-full py-3 bg-gray-900 text-white text-xs font-bold rounded-full hover:bg-black transition"
                >
                  RESET SELECTION
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 pt-12 md:pt-24 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-medium">Mayur Poshak</p>
            <h1 className="text-3xl md:text-5xl font-extralight tracking-tight text-gray-900 uppercase mt-2">
              {searchTerm ? `Search: ${searchTerm}` : "All Collections"}
            </h1>
            <p className="text-sm text-gray-400 mt-2">Showing {products.length} beautiful items</p>
          </div>

          <div className="flex items-center gap-4">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="group inline-flex justify-center text-xs font-bold text-gray-700 hover:text-gray-900 uppercase tracking-[0.2em] border border-gray-200 px-4 py-2 rounded-full transition">
                  Sort By
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
                          "block w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-gray-50 transition"
                        )}
                      >
                        {option.name}
                      </button>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            <button onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-2 lg:hidden border border-gray-200 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-gray-700">
              <FunnelIcon className="h-4 w-4" />
              <span>Filter</span>
            </button>

            {/* Desktop Grid Icons */}
            <div className="hidden lg:flex items-center border border-gray-100 rounded-full px-4 py-2 gap-4 h-[38px]">
              <button 
                onClick={() => setCols(2)}
                className={classNames(cols === 2 ? "text-black" : "text-gray-300", "hover:text-black transition")}
                title="2 columns"
              >
                <TfiLayoutGrid2 className="text-xl" />
              </button>
              <button 
                onClick={() => setCols(3)}
                className={classNames(cols === 3 ? "text-black" : "text-gray-300", "hover:text-black transition")}
                title="3 columns"
              >
                <TfiLayoutGrid3 className="text-xl" />
              </button>
              <button 
                onClick={() => setCols(4)}
                className={classNames(cols === 4 ? "text-black" : "text-gray-300", "hover:text-black transition")}
                title="4 columns"
              >
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
                !selectedFilters.category.length ? "bg-black text-white" : "bg-gray-50 text-gray-400 font-medium",
                "px-5 py-2 rounded-full text-[10px] uppercase tracking-widest transition shadow-sm whitespace-nowrap"
              )}
            >
              All Arrivals
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterChange("category", cat.id)}
                className={classNames(
                  selectedFilters.category.includes(cat.id) ? "bg-black text-white" : "bg-gray-50 text-gray-400 font-medium",
                  "px-5 py-2 rounded-full text-[10px] uppercase tracking-widest transition shadow-sm whitespace-nowrap"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Chips Row */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-3 py-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <button 
              onClick={clearFilters}
              className="px-4 py-1.5 border border-black bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition shadow-sm"
            >
              Clear All
            </button>
            <span className="w-px h-4 bg-gray-200 mx-1 hidden sm:block" />
            
            {searchTerm && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full group hover:border-black transition cursor-pointer" onClick={() => removeFilter('search')}>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Search:</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">{searchTerm}</span>
                <XMarkIcon className="h-3 w-3 text-gray-300 group-hover:text-black" />
              </div>
            )}
            
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

            {minRating > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full group hover:border-black transition cursor-pointer" onClick={() => removeFilter('rating')}>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Rating:</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">{minRating}★ & above</span>
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
              {/* Availability Filter */}
              <div className="mb-10">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.3em] mb-6">Availability</h3>
                <div className="space-y-4">
                  {[
                    { id: 'all', label: 'All Products' },
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
                        availability === opt.id ? "text-black font-bold" : "text-gray-500",
                        "ml-3 text-xs uppercase tracking-widest transition-all group-hover:text-black"
                      )}>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-10 border-t border-gray-100 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.3em]">Price</h3>
                  <button 
                    onClick={() => setPriceRange(25000)}
                    className="text-[9px] font-bold text-gray-400 hover:text-black uppercase tracking-widest underline decoration-dotted"
                  >
                    Reset
                  </button>
                </div>
                <div className="px-1">
                  <input 
                    type="range"
                    min="0"
                    max="25000"
                    step="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black mb-4"
                  />
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    <span>₹0</span>
                    <span className="text-black bg-gray-50 px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                      Under ₹{priceRange.toLocaleString()}
                    </span>
                    <span>₹25,000+</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.3em] mb-6">Collections</h3>
              <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-8">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleFilterChange("category", cat.id)}
                    className={classNames(
                      selectedFilters.category.includes(cat.id) ? "bg-black text-white scale-105" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      "px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {filters.map((section) => (
                <Disclosure key={section.id} as="div" className="border-b border-gray-100 py-6" defaultOpen>
                  <h3 className="-my-3 flow-root">
                    <DisclosureButton className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-bold text-gray-900 uppercase tracking-[0.2em] text-[10px]">{section.name}</span>
                      <span className="ml-6 flex items-center">
                        <PlusIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel className="pt-6 animate-in slide-in-from-top-2 duration-300">
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
                          <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-xs text-gray-500 cursor-pointer hover:text-black transition">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ))}

              {/* Rating Filter */}
              <div className="border-b border-gray-100 py-6">
                <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] mb-4">Rating</h3>
                <div className="space-y-3">
                  {ratingOptions.map((opt) => (
                    <div key={opt.value} className="flex items-center group cursor-pointer" onClick={() => setMinRating(minRating === opt.value ? 0 : opt.value)}>
                      <div className={classNames(
                        minRating === opt.value ? "bg-black border-black" : "border-gray-200 bg-white",
                        "w-4 h-4 rounded border flex items-center justify-center transition-all duration-300"
                      )}>
                        {minRating === opt.value && <CheckIcon className="h-3 w-3 text-white" />}
                      </div>
                      <span className={classNames(
                        minRating === opt.value ? "text-black font-bold" : "text-gray-500",
                        "ml-3 text-xs uppercase tracking-widest transition-all group-hover:text-black"
                      )}>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={clearFilters}
                type="button"
                className="mt-8 w-full py-3 bg-gray-50 border border-gray-100 text-gray-900 text-[10px] font-bold tracking-[0.2em] rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
              >
                CLEAR ALL
              </button>
            </form>

            {/* Product grid */}
            <div className="lg:col-span-3">
               {loading ? (
                <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
                  <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Curating Collection...</p>
                </div>
               ) : products.length > 0 ? (
                <div className={classNames(
                  "grid gap-x-6 gap-y-12 transition-all duration-500",
                  cols === 2 ? "grid-cols-1 sm:grid-cols-2" : 
                  cols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : 
                  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                )}>
                  {products.map((product) => (
                    <Link key={product._id} href={`/product/${product._id}`} className="group relative flex flex-col">
                      <div className="aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-gray-50 group-hover:opacity-95 relative shadow-sm transition-all duration-500 group-hover:shadow-2xl border border-gray-50">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="h-full w-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Status Badge */}
                        {product.stock < 5 && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-red-500 text-white text-[8px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                              Limited Stock
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mt-6 flex flex-col items-center flex-1">
                        <h3 className="text-[10px] font-bold tracking-[.2em] uppercase text-gray-400 mb-2">{product.brand || 'Mayur Poshak'}</h3>
                        <p className="text-base font-medium text-gray-900 text-center truncate w-full px-4">{product.name}</p>
                        <p className="mt-2 text-xl font-extralight text-gray-900">₹{Number(product.price).toLocaleString("en-IN")}</p>
                        
                        <div className="mt-5 w-full h-px bg-gray-100 relative group-hover:bg-black transition-colors duration-500">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">Explore Details</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
               ) : (
                <div className="text-center py-40 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                      <FunnelIcon className="h-8 w-8 text-gray-200" />
                   </div>
                   <h2 className="text-3xl font-extralight text-gray-900 uppercase tracking-[0.2em] mb-4">No Matches Found</h2>
                   <p className="text-gray-400 text-sm mb-10 max-w-xs mx-auto">We couldn&apos;t find any products matching your current selection. Try resetting your filters.</p>
                   <button onClick={clearFilters} className="px-12 py-4 bg-black text-white text-xs font-bold tracking-[0.3em] rounded-full hover:bg-gray-800 transition shadow-2xl active:scale-95">
                     RESET ALL FILTERS
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Entering Boutique...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
