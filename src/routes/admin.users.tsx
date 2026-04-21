import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({ component: Users });

type Profile = { id: string; email: string | null; display_name: string | null; created_at: string };
type RoleRow = { user_id: string; role: "admin" | "editor" | "user" };

function Users() {
  const { isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [rolesByUser, setRolesByUser] = useState<Record<string, string[]>>({});

  const load = async () => {
    const [{ data: ps }, { data: rs }] = await Promise.all([
      supabase.from("profiles").select("id,email,display_name,created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    setProfiles(ps ?? []);
    const map: Record<string, string[]> = {};
    (rs as RoleRow[] ?? []).forEach((r) => { (map[r.user_id] ??= []).push(r.role); });
    setRolesByUser(map);
  };
  useEffect(() => { load(); }, []);

  const setRole = async (userId: string, role: "admin" | "editor" | "user", on: boolean) => {
    if (on) {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) return toast.error(error.message);
    }
    toast.success("Updated");
    load();
  };

  if (!isAdmin) return <p className="text-muted-foreground">Admin only.</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-foreground">Users</h1>
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-card/60 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr><th className="px-3 py-2">User</th><th className="px-3 py-2">Roles</th><th className="px-3 py-2">Joined</th></tr>
          </thead>
          <tbody>
            {profiles.map((p) => {
              const roles = rolesByUser[p.id] ?? [];
              return (
                <tr key={p.id} className="border-t border-border/40">
                  <td className="px-3 py-2">
                    <div className="text-foreground">{p.display_name || p.email}</div>
                    <div className="text-xs text-muted-foreground">{p.email}</div>
                  </td>
                  <td className="px-3 py-2">
                    {(["admin", "editor", "user"] as const).map((r) => (
                      <label key={r} className="mr-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <input type="checkbox" checked={roles.includes(r)} onChange={(e) => setRole(p.id, r, e.target.checked)} />
                        {r}
                      </label>
                    ))}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
