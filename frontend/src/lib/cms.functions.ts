import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function publicClient() {
  const url = process.env["SUPABASE_URL"] ?? import.meta.env.VITE_SUPABASE_URL;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return createClient<Database>(url!, key!, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const listPublicContent = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [{ data: items }, { data: admins }] = await Promise.all([
    sb.from("content_items").select("*").eq("published", true).order("created_at", { ascending: false }),
    sb.rpc("admin_profiles"),
  ]);
  return { items: items ?? [], admins: admins ?? [] };
});

export const getContentItem = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ kind: z.string(), slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { data: item } = await publicClient()
      .from("content_items").select("*").eq("kind", data.kind).eq("slug", data.slug).eq("published", true).maybeSingle();
    return item ?? null;
  });

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Response("Forbidden", { status: 403 });
}

export const createAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      email: z.string().trim().email().max(255),
      password: z.string().min(8).max(72),
      display_name: z.string().trim().min(1).max(100),
      organization: z.string().trim().max(150).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { display_name: data.display_name, organization: data.organization ?? null },
    });
    if (error || !created.user) throw new Error(error?.message ?? "Could not create admin");
    await supabaseAdmin.from("user_roles").insert({ user_id: created.user.id, role: "admin" });
    return { id: created.user.id };
  });

export const removeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("You cannot remove yourself");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", "admin");
    return { ok: true };
  });
