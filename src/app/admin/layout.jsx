import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import AdminShell from "@/components/admin/AdminShell";

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
    <AdminShell>
      {children}
    </AdminShell>
  );
}
