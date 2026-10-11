import { createFileRoute } from "@tanstack/react-router";

// One-time: creates the first admin only when no admin exists yet.
export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { email, password } = (await request.json()) as { email: string; password: string };
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { count } = await supabaseAdmin.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin");
        if ((count ?? 0) > 0) return new Response("Already set up", { status: 403 });
        const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: "ACFLO Admin", organization: "ACFLO" } });
        if (error || !data.user) return new Response(error?.message ?? "fail", { status: 500 });
        await supabaseAdmin.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
        return new Response("ok");
      },
    },
  },
});
