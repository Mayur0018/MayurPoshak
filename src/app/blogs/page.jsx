"use client";

import Image from "next/image";

const posts = [
  {
    id: 1,
    title: "Silk Sarees: A Guide to Timeless Elegance",
    href: "#",
    description:
      "Explore the rich heritage and exquisite craftsmanship of traditional silk sarees. Perfect for weddings and special occasions.",
    date: "Feb 10, 2025",
    datetime: "2025-02-10",
    image: "/Category/silksarees.jpg",
    category: { title: "Traditional Wear", href: "#" },
    author: {
      name: "Priya Sharma",
      role: "Fashion Historian",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 2,
    title: "Cotton Sarees: Comfort Meets Style",
    href: "#",
    description:
      "Discover why cotton sarees are the perfect choice for everyday wear. Breathable, comfortable, and elegantly designed.",
    date: "Feb 08, 2025",
    datetime: "2025-02-08",
    image: "/Category/cottonsarees.jpg",
    category: { title: "Daily Wear", href: "#" },
    author: {
      name: "Meera Desai",
      role: "Style Expert",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 3,
    title: "Party Wear Sarees: Make a Statement",
    href: "#",
    description:
      "Stunning designs and bold patterns that command attention. Your guide to choosing the perfect party saree.",
    date: "Feb 05, 2025",
    datetime: "2025-02-05",
    image: "/Category/partyweresarees.jpg",
    category: { title: "Party Wear", href: "#" },
    author: {
      name: "Rajesh Patel",
      role: "Design Expert",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 4,
    title: "Wedding Sarees: Your Big Day Deserves the Best",
    href: "#",
    description:
      "Explore exquisite wedding saree collections that blend tradition with contemporary design. Make your wedding day unforgettable.",
    date: "Feb 03, 2025",
    datetime: "2025-02-03",
    image: "/Category/wdingsarees.jpg",
    category: { title: "Wedding", href: "#" },
    author: {
      name: "Sophia Lee",
      role: "Bridal Stylist",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 5,
    title: "Banarshi Sarees: Heritage Woven Into Every Thread",
    href: "#",
    description:
      "Discover the legendary craftsmanship of Banarshi sarees. These handwoven masterpieces are an investment in timeless beauty.",
    date: "Jan 30, 2025",
    datetime: "2025-01-30",
    image: "/Category/banarshisarees.jpg",
    category: { title: "Heritage", href: "#" },
    author: {
      name: "Emily Carter",
      role: "Textile Expert",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 6,
    title: "Printed Sarees: Bold Colors & Vibrant Patterns",
    href: "#",
    description:
      "From traditional prints to modern designs, discover how printed sarees can express your unique personality and style.",
    date: "Jan 28, 2025",
    datetime: "2025-01-28",
    image: "/Category/printedsarees.jpg",
    category: { title: "Contemporary", href: "#" },
    author: {
      name: "Daniel Kim",
      role: "Design Consultant",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1531891437562-4301cf35b7a5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 7,
    title: "Summer Sarees: Stay Cool Without Compromising Style",
    href: "#",
    description:
      "Beat the heat with our curated collection of summer sarees. Light, breathable, and incredibly stylish for warm weather.",
    date: "Jan 25, 2025",
    datetime: "2025-01-25",
    image: "/Summer/summersarees.jpg",
    category: { title: "Seasonal", href: "#" },
    author: {
      name: "Priya Sharma",
      role: "Fashion Editor",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 8,
    title: "Classic Designs: Sarees That Never Go Out of Style",
    href: "#",
    description:
      "Timeless pieces that have graced generations. Discover why classic saree designs remain eternally elegant.",
    date: "Jan 22, 2025",
    datetime: "2025-01-22",
    image: "/Classic/classicsarees.jpg",
    category: { title: "Timeless", href: "#" },
    author: {
      name: "Meera Desai",
      role: "Style Historian",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

export default function BlogsPage() {
  return (
    <div className="bg-white">
      {/* HERO BANNER */}
      <section className="relative w-full h-80 md:h-96 overflow-hidden">
        <Image
          src="/Banner/bannerimg.jpg"
          alt="Mayur Poshak Blog"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-2">Fashion & Saree Guide</h1>
            <p className="text-lg md:text-xl">Expert tips on styling and saree tradition</p>
          </div>
        </div>
      </section>

      {/* BLOG POSTS */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              From the Blog
            </h2>
            <p className="mt-2 text-lg/8 text-gray-600">
              Discover styling tips, saree care guides, and fashion trends from our expert collection.
            </p>
          </div>

          {/* GRID */}
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex max-w-xl flex-col items-start justify-between rounded-lg overflow-hidden hover:shadow-lg transition group"
              >
                {/* Featured Image */}
                <div className="relative w-full h-56 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Category & Date */}
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={post.datetime} className="text-gray-500">
                    {post.date}
                  </time>
                  <a
                    href={post.category.href}
                    className="relative z-10 rounded-full bg-red-50 px-3 py-1.5 font-medium text-red-600 hover:bg-red-100"
                  >
                    {post.category.title}
                  </a>
                </div>

                {/* Title & Description */}
                <div className="group relative grow w-full">
                  <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-red-600 transition">
                    <a href={post.href}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
                    {post.description}
                  </p>
                </div>

                {/* Author */}
                <div className="relative mt-8 flex items-center gap-x-4 justify-self-end w-full">
                  <img
                    alt={post.author.name}
                    src={post.author.imageUrl}
                    className="size-10 rounded-full bg-gray-50"
                  />
                  <div className="text-sm/6">
                    <p className="font-semibold text-gray-900">
                      <a href={post.author.href}>
                        <span className="absolute inset-0" />
                        {post.author.name}
                      </a>
                    </p>
                    <p className="text-gray-600">{post.author.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Collections</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to find your perfect saree? Visit our collection pages to browse our complete range of traditional and contemporary designs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/ladies" className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Shop Sarees
            </a>
            <a href="/Contact" className="bg-white text-black border border-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
