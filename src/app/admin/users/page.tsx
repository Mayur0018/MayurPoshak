import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { setUserRole, setUserBlocked } from "@/actions/users";
import { checkAdmin } from "@/actions/auth";

export default async function AdminUsers() {
  // 1. Security Check
  await checkAdmin();
  
  // 2. Data Fetching
  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 }).limit(100);

  async function changeRole(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const role = String(formData.get("role")) as "user" | "admin";
    await setUserRole(id, role);
  }

  async function changeBlocked(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const blocked = String(formData.get("blocked")) === "true";
    await setUserBlocked(id, blocked);
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">Administration</p>
        <h2 className="text-2xl font-black uppercase tracking-tight">User Management</h2>
      </div>

      <div className="space-y-4">
        {users.map((u: any) => (
          <div key={u._id.toString()} className="group border border-gray-50 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-black transition-all">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center font-black text-xs">
                  {u.name?.charAt(0) || u.email.charAt(0).toUpperCase()}
               </div>
               <div>
                  <div className="font-bold text-sm tracking-tight">{u.name || "Anonymous User"}</div>
                  <div className="text-xs text-gray-400 font-medium">{u.email}</div>
                  <div className="mt-2 flex items-center gap-2">
                     <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {u.role}
                     </span>
                     {u.isBlocked && (
                       <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                          Blocked
                       </span>
                     )}
                  </div>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <form action={changeRole} className="flex items-center gap-2">
                <input type="hidden" name="id" value={u._id.toString()} />
                <select name="role" defaultValue={u.role} className="bg-gray-50 border-none rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-black">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button className="bg-white border border-gray-100 px-4 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-black hover:text-white transition">Role</button>
              </form>

              <form action={changeBlocked} className="flex items-center gap-2">
                <input type="hidden" name="id" value={u._id.toString()} />
                <select name="blocked" defaultValue={String(u.isBlocked)} className="bg-gray-50 border-none rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-black">
                  <option value="false">Active</option>
                  <option value="true">Block</option>
                </select>
                <button className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition ${u.isBlocked ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}>
                  {u.isBlocked ? 'Unlock' : 'Freeze'}
                </button>
              </form>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No users found in the modern database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
