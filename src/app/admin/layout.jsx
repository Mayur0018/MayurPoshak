import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123456";

export const metadata = {
  title: "Admin • Mayur Poshak",
  description: "Admin dashboard",
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let isAdmin = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (payload && payload.role === 'admin') {
        isAdmin = true;
      }
    } catch (error) {
      console.error("Admin layout auth error:", error);
    }
  }

  if (!isAdmin) {
    redirect('/Signin');
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col pt-4">
        <AdminHeader />

        {/* Content Box */}
        <div className="flex-1 px-8 pb-12">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </div>
      </main>
    </div>
  );
}
