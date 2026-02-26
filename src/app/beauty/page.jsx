"use client";
import { useEffect, useState } from "react";
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
} from "@heroicons/react/20/solid";

const sortOptions = [
  { name: "Newest", value: "createdAt", current: true },
  { name: "Best Rating", value: "rating", current: false },
  { name: "Price: Low to High", value: "price-asc", current: false },
  { name: "Price: High to Low", value: "price-desc", current: false },
];

const subCategories = [
  { name: "Makeup", id: "makeup" },
  { name: "Skincare", id: "skincare" },
  { name: "Fragrance", id: "fragrance" },
  { name: "Haircare", id: "haircare" },
];

const filters = [
  {
    id: "brand",
    name: "Brand",
    options: [
      { value: "luxury", label: "Luxury" },
      { value: "organic", label: "Organic" },
      { value: "professional", label: "Professional" },
    ],
  },
  {
    id: "color",
    name: "Shade/Tone",
    options: [
      { value: "nude", label: "Nude" },
      { value: "red", label: "Red" },
      { value: "pink", label: "Pink" },
      { value: "clear", label: "Clear" },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BeautyPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    subCategory: [],
    brand: [],
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
        let url = `/api/products?category=beauty&sort=${selectedFilters.sort}`;
        if (selectedFilters.subCategory.length > 0) {
           selectedFilters.subCategory.forEach(s => url += `&subCategory=${s}`);
        }
        if (selectedFilters.brand.length > 0) {
          selectedFilters.brand.forEach(b => url += `&brand=${b}`);
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
  }, [selectedFilters]);

  const clearFilters = () => {
    setSelectedFilters({ subCategory: [], brand: [], color: [], sort: "createdAt" });
  };

  return (
    <div className="bg-[#fffaff] min-h-screen">
      {/* Mobile Filter Dialog */}
      <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/25 transition-opacity duration-300" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900 uppercase tracking-widest">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form className="mt-4 border-t border-gray-100">
              <ul className="px-2 py-3 font-medium text-gray-900">
                {subCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleFilterChange("subCategory", cat.id)}
                      className={classNames(
                        selectedFilters.subCategory.includes(cat.id) ? "text-pink-600 font-bold" : "text-gray-600",
                        "block px-2 py-3 text-sm"
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
                    <DisclosureButton className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-pink-500">
                      <span className="font-medium text-gray-900 uppercase tracking-wide">{section.name}</span>
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
                            checked={selectedFilters[section.id]?.includes(option.value)}
                            onChange={() => handleFilterChange(section.id, option.value)}
                            className="h-4 w-4 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                          />
                          <label htmlFor={`filter-mobile-${section.id}-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-gray-500">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ))}
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-pink-100 pb-6 pt-24">
          <h1 className="text-4xl font-extralight tracking-[0.1em] text-gray-900 uppercase">Beauty & Care</h1>

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-pink-600 uppercase tracking-widest">
                  Sort
                  <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-pink-500" />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.name}>
                      <button
                        onClick={() => setSelectedFilters(prev => ({ ...prev, sort: option.value }))}
                        className={classNames(
                          option.value === selectedFilters.sort ? "font-bold text-pink-600 bg-pink-50" : "text-gray-500",
                          "block w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-pink-50 transition-colors"
                        )}
                      >
                        {option.name}
                      </button>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            <button onClick={() => setMobileFiltersOpen(true)} className="-m-2 ml-4 p-2 text-gray-400 hover:text-pink-600 sm:ml-6 lg:hidden">
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <section className="pb-24 pt-12">
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <form className="hidden lg:block space-y-8">
              <div>
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-6">Categories</h3>
                <ul className="space-y-4 border-b border-pink-50 pb-8 text-sm font-medium">
                  {subCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => handleFilterChange("subCategory", category.id)}
                        className={classNames(
                          selectedFilters.subCategory.includes(category.id) ? "text-pink-600 font-bold translate-x-1" : "text-gray-400 hover:text-pink-400 transform hover:translate-x-1",
                          "transition-all duration-300 uppercase text-[11px] tracking-widest flex items-center"
                        )}
                      >
                        <span className={classNames(selectedFilters.subCategory.includes(category.id) ? "w-2 h-2 bg-pink-600 mr-2 rounded-full" : "w-0 mr-0 transition-all")}></span>
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {filters.map((section) => (
                <Disclosure key={section.id} as="div" className="border-b border-pink-50 py-6" defaultOpen={true}>
                  <h3 className="-my-3 flow-root">
                    <DisclosureButton className="flex w-full items-center justify-between bg-transparent py-3 text-sm text-gray-400 hover:text-pink-500">
                      <span className="font-black text-gray-900 uppercase tracking-[0.2em] text-[11px]">{section.name}</span>
                      <span className="ml-6 flex items-center">
                        <PlusIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel className="pt-6">
                    <div className="space-y-4">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center group cursor-pointer">
                          <input
                            id={`filter-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            type="checkbox"
                            checked={selectedFilters[section.id]?.includes(option.value)}
                            onChange={() => handleFilterChange(section.id, option.value)}
                            className="h-4 w-4 rounded border-pink-200 text-pink-600 focus:ring-pink-500 cursor-pointer"
                          />
                          <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-xs uppercase tracking-widest text-gray-500 group-hover:text-pink-500 transition-colors cursor-pointer">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ))}
              
              <button 
                onClick={clearFilters}
                type="button"
                className="mt-10 w-full py-3 bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-pink-100 transition-all duration-300"
              >
                Reset Selection
              </button>
            </form>

            {/* Product grid */}
            <div className="lg:col-span-3">
               {loading ? (
                <div className="flex justify-center items-center h-96">
                   <div className="relative">
                      <div className="h-20 w-20 rounded-full border-2 border-pink-100"></div>
                      <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-t-2 border-pink-600 animate-spin"></div>
                   </div>
                </div>
               ) : products.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <Link key={product._id} href={`/product/${product._id}`} className="group relative flex flex-col">
                      <div className="aspect-square w-full overflow-hidden rounded-3xl bg-white relative shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 border border-pink-50">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                           <button className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl hover:bg-pink-600 hover:text-white transition-all text-pink-600">
                             <i className="ti ti-heart text-xl" />
                           </button>
                        </div>
                        {product.rating > 4.5 && (
                           <div className="absolute top-5 left-5 bg-pink-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                              Bestseller
                           </div>
                        )}
                      </div>
                      <div className="mt-6 flex flex-col items-center flex-1 px-4">
                        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-pink-300 mb-2">{product.subCategory || 'Essentials'}</h3>
                        <p className="text-sm font-semibold text-gray-800 text-center leading-relaxed h-10 overflow-hidden mb-1 uppercase tracking-tight">{product.name}</p>
                        <div className="flex items-center gap-2 mb-4">
                           <div className="flex text-pink-400">
                              {[...Array(5)].map((_, i) => (
                                 <i key={i} className={`ti ti-star-filled text-[10px] ${i < Math.floor(product.rating || 5) ? 'opacity-100' : 'opacity-20'}`} />
                              ))}
                           </div>
                           <span className="text-[10px] font-bold text-gray-300">({product.reviewsCount || 0})</span>
                        </div>
                        <p className="text-xl font-light text-gray-900 tracking-tighter">₹{product.price}</p>
                        <div className="w-8 h-0.5 bg-pink-100 my-4 group-hover:w-20 transition-all duration-500"></div>
                        <button className="text-[10px] font-black tracking-[0.3em] uppercase text-pink-600 opacity-0 group-hover:opacity-100 transition-all duration-500">
                           Add to Bag
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
               ) : (
                <div className="text-center py-40 bg-white rounded-[40px] border-2 border-dashed border-pink-50 transition-all hover:border-pink-200">
                   <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-8">
                      <XMarkIcon className="h-10 w-10 text-pink-200" />
                   </div>
                   <h2 className="text-2xl font-light text-gray-400 uppercase tracking-[0.2em] mb-4">Discovery Empty</h2>
                   <p className="text-gray-300 text-sm max-w-xs mx-auto mb-10 leading-loose uppercase tracking-widest">Adjust your filters to reveal our curated beauty selection</p>
                   <button onClick={clearFilters} className="px-12 py-4 bg-pink-600 text-white font-black tracking-[0.3em] text-[10px] uppercase rounded-2xl hover:bg-pink-700 transition shadow-2xl shadow-pink-200 hover:scale-105 active:scale-95 duration-300">
                     Explore All
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
