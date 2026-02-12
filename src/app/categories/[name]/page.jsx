// app/categories/[name]/page.jsx

import { category } from "@/Data/Category";
import Image from "next/image";

export default async function CategoryPage({ params }) {
  // Await params (required in Next.js 15+ for dynamic routes)
  const { name } = await params;

  // Find the category data based on the slug
  const categoryData = category.find((item) => item.slug === name);

  // If category not found → show not found message
  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-red-600">
          Category Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-10">
          {categoryData.text}
        </h1>

        {/* Main Image Section */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={categoryData.Image}
              alt={categoryData.text}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority
              quality={85}
            />
          </div>
        </div>

        {/* Optional description / call-to-action area */}
        <div className="mt-12 text-center">
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Discover our amazing collection in the{" "}
            <span className="font-semibold text-indigo-600">
              {categoryData.text}
            </span>{" "}
            category
          </p>

          {/* You can add more content here later */}
          {/* <div className="mt-10">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-700 transition">
              Browse Products
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}