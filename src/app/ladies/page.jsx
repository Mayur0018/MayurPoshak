"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];

const subCategories = [
  { name: "T-Shirts", href: "#" },
  { name: "Shirts", href: "#" },
  { name: "Jeans", href: "#" },
  { name: "Jackets", href: "#" },
  { name: "Shoes", href: "#" },
  { name: "Accessories", href: "#" },
];

const filters = [
  {
    id: "size",
    name: "Size",
    options: [
      { value: "xs", label: "XS", checked: false },
      { value: "s", label: "S", checked: false },
      { value: "m", label: "M", checked: true },
      { value: "l", label: "L", checked: false },
      { value: "xl", label: "XL", checked: false },
      { value: "xxl", label: "XXL", checked: false },
    ],
  },
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "black", label: "Black", checked: false },
      { value: "blue", label: "Blue", checked: true },
      { value: "red", label: "Red", checked: false },
      { value: "green", label: "Green", checked: false },
      { value: "yellow", label: "Yellow", checked: false },
    ],
  },
  {
    id: "gender",
    name: "Gender",
    options: [
      { value: "men", label: "Men", checked: true },
      { value: "women", label: "Women", checked: false },
      { value: "kids", label: "Kids", checked: false },
      { value: "unisex", label: "Unisex", checked: false },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="bg-white">
      {/* Mobile Filter Dialog */}
      <Dialog
        open={mobileFiltersOpen}
        onClose={setMobileFiltersOpen}
        className="relative z-40 lg:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 flex z-40">
          <DialogPanel className="ml-auto w-full max-w-xs bg-white p-4 flex flex-col overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form className="space-y-6">
              <ul className="space-y-2 font-medium text-gray-900">
                {subCategories.map((cat) => (
                  <li key={cat.name}>
                    <a href={cat.href} className="block hover:underline">
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
              {filters.map((section) => (
                <Disclosure key={section.id}>
                  {({ open }) => (
                    <>
                      <DisclosureButton className="flex justify-between w-full text-gray-900 font-medium py-2">
                        {section.name}
                        <PlusIcon
                          className={classNames(
                            open ? "rotate-45" : "rotate-0",
                            "h-5 w-5 transition-transform"
                          )}
                        />
                      </DisclosureButton>
                      <DisclosurePanel className="pl-2 space-y-2">
                        {section.options.map((option, idx) => (
                          <div key={option.value} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`mobile-${section.id}-${idx}`}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`mobile-${section.id}-${idx}`}
                              className="text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              ))}
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            New Arrivals - Clothes
          </h1>
          <div className="flex items-center gap-4">
            {/* Sort menu */}
            <Menu as="div" className="relative inline-block text-left z-50">
              <MenuButton className="inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Sort
                <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400" />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md ring-1 ring-black/5 focus:outline-none">
                {sortOptions.map((option) => (
                  <MenuItem key={option.name}>
                    {({ active }) => (
                      <a
                        href={option.href}
                        className={classNames(
                          option.current ? "font-medium text-gray-900" : "text-gray-500",
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        {option.name}
                      </a>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
            <button
              className="p-2 text-gray-400 hover:text-gray-500 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10 pb-24">
          {/* Filters - left */}
          <form className="hidden lg:block">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {subCategories.map((cat) => (
                <li key={cat.name}>
                  <a href={cat.href} className="hover:underline">
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
            {filters.map((section) => (
              <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex justify-between w-full text-gray-900 font-medium py-2">
                      {section.name}
                      <PlusIcon
                        className={classNames(
                          open ? "rotate-45" : "rotate-0",
                          "h-5 w-5 transition-transform"
                        )}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="pl-2 space-y-2">
                      {section.options.map((option, idx) => (
                        <div key={option.value} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultValue={option.value}
                            defaultChecked={option.checked}
                            id={`desktop-${section.id}-${idx}`}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <label htmlFor={`desktop-${section.id}-${idx}`} className="text-gray-500">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ))}
          </form>

          {/* Products - right */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product,index) => (
              <Link
                key={product._id || index}
                href={`/product/${product._id}`}
              >
                <div className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                  <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
