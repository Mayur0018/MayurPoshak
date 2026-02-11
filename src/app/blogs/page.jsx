const posts = [
  {
    id: 1,
    title: "10 Summer Outfits That Never Go Out of Style",
    href: "#",
    description:
      "Discover timeless summer fashion staples that blend comfort and elegance. From flowy dresses to chic sandals, find your perfect look for every occasion.",
    date: "Jul 16, 2025",
    datetime: "2025-07-16",
    category: { title: "Style Tips", href: "#" },
    author: {
      name: "Emily Carter",
      role: "Fashion Editor",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 2,
    title: "Top 5 Accessories to Elevate Any Outfit",
    href: "#",
    description:
      "From statement earrings to bold handbags, discover the must-have accessories that add personality and polish to any look.",
    date: "Jul 10, 2025",
    datetime: "2025-07-10",
    category: { title: "Accessories", href: "#" },
    author: {
      name: "Daniel Kim",
      role: "Stylist",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1531891437562-4301cf35b7a5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 3,
    title: "How to Build a Capsule Wardrobe",
    href: "#",
    description:
      "Simplify your closet and upgrade your style. Learn how to create a capsule wardrobe with essential, versatile pieces that never go out of fashion.",
    date: "Jul 01, 2025",
    datetime: "2025-07-01",
    category: { title: "Wardrobe Essentials", href: "#" },
    author: {
      name: "Sophia Lee",
      role: "Sustainable Fashion Blogger",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.datetime} className="text-gray-500">
                  {post.date}
                </time>
                <a
                  href={post.category.href}
                  className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                >
                  {post.category.title}
                </a>
              </div>
              <div className="group relative grow">
                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                  <a href={post.href}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </a>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
                  {post.description}
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4 justify-self-end">
                <img
                  alt=""
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
  );
}
