import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "compliance";

export interface AdminSession {
  loading: boolean;
  userId: string | null;
  email: string | null;
  /**
   * Roles are read here only to decide what to render. They are never trusted:
   * every action re-checks the role server-side via has_role(), so editing this
   * value in the browser changes nothing an attacker can use.
   */
  roles: AppRole[];
  signOut: () => Promise<void>;
}

export function useAdminSession(): AdminSession {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);

  const loadRoles = useCallback(async (uid: string | null) => {
    if (!uid) {
      setRoles([]);
      return;
    }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles((data ?? []).map((r) => r.role as AppRole));
  }, []);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      setEmail(session?.user?.email ?? null);
      // Defer the database read out of the auth callback.
      setTimeout(() => {
        if (active) void loadRoles(uid);
      }, 0);
    });

    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      const uid = data.user?.id ?? null;
      setUserId(uid);
      setEmail(data.user?.email ?? null);
      await loadRoles(uid);
      if (active) setLoading(false);
    })();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadRoles]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setEmail(null);
    setRoles([]);
  }, []);

  return { loading, userId, email, roles, signOut };
}
