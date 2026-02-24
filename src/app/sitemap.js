export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mayurposhak.com";
  const productApi = process.env.NEXT_PUBLIC_API_URL;

  const staticRoutes = ["/", "/ladies", "/profile", "/Signin"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  let productRoutes = [];
  try {
    if (productApi) {
      const res = await fetch(productApi, { next: { revalidate: 3600 } });
      const products = res.ok ? await res.json() : [];
      productRoutes = products.map((p) => ({
        url: `${baseUrl}/product/${p._id}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      }));
    }
  } catch {
    productRoutes = [];
  }

  return [...staticRoutes, ...productRoutes];
}

