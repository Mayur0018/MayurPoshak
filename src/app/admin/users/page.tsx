import { getServerSupabase } from "@/lib/supabaseServer";
import { setUserRole, setUserBlocked } from "@/actions/users";

export default async function AdminUsers() {
  const supabase = await getServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  const { data: users } = await supabase
    .from("users")
    .select("id,email,role,blocked,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const { data: current } = session
    ? await supabase.from("users").select("id,email,role,blocked,created_at").eq("id", session.user.id).single()
    : { data: null };

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
    <div className="bg-white border rounded p-4">
      <h2 className="text-lg font-semibold mb-3">Users</h2>
      {current && (
        <div className="border rounded p-3 mb-4 bg-gray-50">
          <div className="font-medium">Current User</div>
          <div className="text-sm">{current.email}</div>
          <div className="text-xs text-gray-600">Role: {current.role} • Joined {new Date(current.created_at).toLocaleDateString()}</div>
          <div className="text-xs">Blocked: {current.blocked ? "Yes" : "No"}</div>
        </div>
      )}
      <div className="space-y-3">
        {(users ?? []).map((u: any) => (
          <div key={u.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{u.email}</div>
              <div className="text-xs text-gray-500">Role: {u.role} • Joined {new Date(u.created_at).toLocaleDateString()}</div>
              <div className="text-xs">Blocked: {u.blocked ? "Yes" : "No"}</div>
            </div>
            <div className="flex items-center gap-3">
              <form action={changeRole} className="flex items-center gap-2">
                <input type="hidden" name="id" value={u.id} />
                <select name="role" defaultValue={u.role} className="border px-2 py-1 text-sm">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button className="border px-3 py-1 text-sm">Update</button>
              </form>
              <form action={changeBlocked} className="flex items-center gap-2">
                <input type="hidden" name="id" value={u.id} />
                <select name="blocked" defaultValue={String(u.blocked)} className="border px-2 py-1 text-sm">
                  <option value="false">Unblock</option>
                  <option value="true">Block</option>
                </select>
                <button className="border px-3 py-1 text-sm">Apply</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
