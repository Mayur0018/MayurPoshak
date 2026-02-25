export const metadata = {
  title: "Admin • Mayur Poshak",
  description: "Admin dashboard",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="bg-white border-r">
          <div className="p-4 font-bold text-lg">Admin</div>
          <nav className="px-2 space-y-1">
            <a href="/admin" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</a>
            <a href="/admin/products" className="block px-3 py-2 rounded hover:bg-gray-100">Products</a>
            <a href="/admin/orders" className="block px-3 py-2 rounded hover:bg-gray-100">Orders</a>
            <a href="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-100">Users</a>
            <a href="/admin/reviews" className="block px-3 py-2 rounded hover:bg-gray-100">Reviews</a>
            <a href="/admin/coupons" className="block px-3 py-2 rounded hover:bg-gray-100">Coupons</a>
            <a href="/admin/analytics" className="block px-3 py-2 rounded hover:bg-gray-100">Analytics</a>
            <a href="/admin/settings" className="block px-3 py-2 rounded hover:bg-gray-100">Settings</a>
          </nav>
        </aside>
        <main className="p-4">
          <div className="bg-white border rounded p-3 flex items-center justify-between">
            <input className="border px-3 py-2 rounded w-64" placeholder="Search..." />
            <div className="flex items-center gap-3">
              <span className="text-sm">Admin</span>
            </div>
          </div>
          <div className="mt-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
