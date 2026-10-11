import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../components/site";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Admin sign in — ACFLO" },
    { name: "description", content: "Sign in to the ACFLO dashboard to publish news, events, gallery photos and more." },
    { property: "og:title", content: "Admin sign in — ACFLO" },
    { property: "og:description", content: "Sign in to the ACFLO publishing dashboard." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const [setup, setSetup] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    try {
      if (setup) {
        const r = await fetch("/api/public/bootstrap-admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
        if (!r.ok) throw new Error(r.status === 403 ? "An admin already exists. Please sign in instead." : await r.text());
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      nav({ to: "/dashboard" });
    } catch (err) { setMsg((err as Error).message); } finally { setBusy(false); }
  }
  const field = "min-h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-primary";
  return <div className="container-site grid min-h-[70vh] place-items-center py-16"><form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-8">
    <p className="eyebrow">Dashboard</p>
    <h1 className="font-display text-3xl font-extrabold">{setup ? "Create first admin" : "Admin sign in"}</h1>
    <p className="text-sm text-muted-foreground">Only authorized ACFLO admins can access the dashboard.</p>
    <input className={field} type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
    <input className={field} type="password" required minLength={8} placeholder="Password (min 8 characters)" value={password} onChange={e => setPassword(e.target.value)} />
    {msg && <p className="text-sm text-destructive">{msg}</p>}
    <Button type="submit" disabled={busy} className="w-full">{busy ? "Please wait…" : setup ? "Create admin & sign in" : "Sign in"}</Button>
    <button type="button" onClick={() => setSetup(!setup)} className="text-xs text-muted-foreground underline">{setup ? "Back to sign in" : "First time? Set up the first admin account"}</button>
  </form></div>;
}
