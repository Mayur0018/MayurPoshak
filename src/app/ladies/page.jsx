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
  { name: "Price: Low to High", value: "price-asc", current: false },
  { name: "Price: High to Low", value: "price-desc", current: false },
  { name: "Best Rating", value: "rating", current: false },
];

const subCategories = [
  { name: "Sarees", id: "sarees" },
  { name: "Western Wear", id: "western" },
  { name: "Casual Wear", id: "casual" },
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
      { value: "pink", label: "Pink" },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function LadiesPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
        let url = `/api/products?category=women&sort=${selectedFilters.sort}`;
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
  }, [selectedFilters]);

  const clearFilters = () => {
    setSelectedFilters({ subCategory: [], size: [], color: [], sort: "createdAt" });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Filter Dialog */}
      <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
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
              <ul className="px-2 py-3 font-medium text-gray-900">
                {subCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleFilterChange("subCategory", cat.id)}
                      className={classNames(
                        selectedFilters.subCategory.includes(cat.id) ? "text-red-600 font-bold" : "text-gray-600",
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
                    <DisclosureButton className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">{section.name}</span>
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
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 className="text-4xl font-extralight tracking-tight text-gray-900 uppercase">Women&apos;s Collection</h1>

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 uppercase tracking-widest">
                  Sort
                  <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.name}>
                      <button
                        onClick={() => setSelectedFilters(prev => ({ ...prev, sort: option.value }))}
                        className={classNames(
                          option.value === selectedFilters.sort ? "font-medium text-gray-900 bg-gray-100" : "text-gray-500",
                          "block w-full text-left px-4 py-2 text-sm"
                        )}
                      >
                        {option.name}
                      </button>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            <button onClick={() => setMobileFiltersOpen(true)} className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <section className="pb-24 pt-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <form className="hidden lg:block">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Categories</h3>
              <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                {subCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => handleFilterChange("subCategory", category.id)}
                      className={classNames(
                        selectedFilters.subCategory.includes(category.id) ? "text-red-600 font-bold" : "text-gray-600 hover:text-black",
                        "transition-colors"
                      )}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>

              {filters.map((section) => (
                <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                  <h3 className="-my-3 flow-root">
                    <DisclosureButton className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-bold text-gray-900 uppercase tracking-widest">{section.name}</span>
                      <span className="ml-6 flex items-center">
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
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
                            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                          />
                          <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
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
                className="mt-8 w-full py-2 bg-gray-100 text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
              >
                CLEAR ALL FILTERS
              </button>
            </form>

            {/* Product grid */}
            <div className="lg:col-span-3">
               {loading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
               ) : products.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {products.map((product) => (
                    <Link key={product._id} href={`/product/${product._id}`} className="group relative flex flex-col">
                      <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 group-hover:opacity-75 relative shadow-sm transition-all duration-300 group-hover:shadow-xl">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="h-full w-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                             <i className="ti ti-heart text-lg text-gray-900" />
                           </button>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col items-center flex-1">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">{product.brand || 'Mayur Poshak'}</h3>
                        <p className="text-sm font-medium text-gray-900 text-center truncate w-full px-2">{product.name}</p>
                        <p className="mt-1 text-lg font-extralight text-gray-900">₹{product.price}</p>
                        <button className="mt-4 px-6 py-2 border border-black text-black text-[10px] font-bold tracking-[0.2em] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white">
                          EXPLORE
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
               ) : (
                <div className="text-center py-32 bg-gray-50 rounded-3xl">
                   <h2 className="text-2xl font-light text-gray-500 uppercase tracking-widest mb-6">No matches found</h2>
                   <button onClick={clearFilters} className="px-10 py-3 bg-black text-white font-bold tracking-[0.2em] rounded-full hover:bg-gray-800 transition shadow-lg">
                     RESET SELECTION
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
