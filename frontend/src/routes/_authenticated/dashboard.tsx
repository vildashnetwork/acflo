import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, LogOut, Upload, Pencil, Eye, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { kinds, type Kind, type Item } from "@/lib/cms";
import { Button } from "../../components/site";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — ACFLO" },
    { name: "description", content: "Publish and manage ACFLO news, events, gallery, videos, partners and resources." },
    { property: "og:title", content: "Dashboard — ACFLO" },
    { property: "og:description", content: "ACFLO admin publishing dashboard." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Dashboard,
});

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) + "-" + Math.random().toString(36).slice(2, 6);
const field = "min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary";

function previewPath(i: Item): string {
  switch (i.kind as Kind) {
    case "news": return `/news/${i.slug}`;
    case "event": return `/events/${i.slug}`;
    case "organization": return `/network/organization/${i.slug}`;
    case "gallery": return "/gallery";
    case "video": return "/videos";
    case "partner": return "/partners";
    case "resource": return "/resources";
    default: return "/";
  }
}

function Dashboard() {
  const qc = useQueryClient(); const nav = useNavigate();
  const [kind, setKind] = useState<Kind>("gallery");
  const [editing, setEditing] = useState<Item | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => { supabase.auth.getUser().then(async ({ data }) => {
    const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user!.id, _role: "admin" }); setIsAdmin(!!ok);
  }); }, []);
  const items = useQuery({ queryKey: ["dash", kind], queryFn: async () => (await supabase.from("content_items").select("*").eq("kind", kind).order("created_at", { ascending: false })).data as Item[] ?? [] });

  async function signOut() { await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); nav({ to: "/auth", replace: true }); }
  async function remove(id: string) { if (!confirm("Delete this post?")) return; await supabase.from("content_items").delete().eq("id", id); refresh(); }
  function refresh() { qc.invalidateQueries({ queryKey: ["dash"] }); qc.invalidateQueries({ queryKey: ["public-content"] }); }
  function switchKind(k: Kind) { setKind(k); setEditing(null); }

  if (isAdmin === false) return <div className="container-site py-24 text-center"><h1 className="font-display text-3xl font-bold">Not authorized</h1><p className="mt-3 text-muted-foreground">This account is not an ACFLO admin.</p><Button className="mt-6" onClick={signOut}>Sign out</Button></div>;

  return <div className="container-site py-10">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Dashboard</p><h1 className="font-display text-3xl font-extrabold">Publish to ACFLO</h1></div><Button variant="outline" onClick={signOut}><LogOut size={16} /> Sign out</Button></div>
    <div className="mb-8 flex flex-wrap gap-2">{(Object.keys(kinds) as Kind[]).map(k => <button key={k} onClick={() => switchKind(k)} className={`rounded-full px-4 py-2 text-sm font-bold ${k === kind ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{kinds[k].label}</button>)}</div>
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <PostForm key={`${kind}-${editing?.id ?? "new"}`} kind={kind} item={editing} onDone={() => { setEditing(null); refresh(); }} onCancel={() => setEditing(null)} />
      <div><h2 className="mb-4 font-bold">Published {kinds[kind].label.toLowerCase()} ({items.data?.length ?? 0})</h2>
        <div className="space-y-3">{items.data?.map(i => <div key={i.id} className="flex items-center gap-4 rounded-md border border-border p-3">
          {i.image_url ? <img src={i.image_url} alt="" className="size-16 shrink-0 rounded object-cover" /> : <div className="size-16 shrink-0 rounded bg-muted" />}
          <div className="min-w-0 flex-1"><p className="truncate font-bold">{i.title}</p><p className="truncate text-xs text-muted-foreground">{i.category} · {new Date(i.created_at).toLocaleDateString()}</p></div>
          <Link to={previewPath(i)} target="_blank" aria-label="Preview" className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><Eye size={18} /></Link>
          <button aria-label="Edit" onClick={() => setEditing(i)} className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil size={18} /></button>
          <button aria-label="Delete" onClick={() => remove(i.id)} className="rounded p-2 text-destructive hover:bg-secondary"><Trash2 size={18} /></button>
        </div>)}{items.data?.length === 0 && <p className="text-sm text-muted-foreground">Nothing posted yet. Built-in demo content still shows on the site.</p>}</div>
      </div>
    </div>
  </div>;
}

function PostForm({ kind, item, onDone, onCancel }: { kind: Kind; item: Item | null; onDone: () => void; onCancel: () => void }) {
  const f = kinds[kind].fields as Record<string, string>;
  const [v, setV] = useState<Record<string, string>>(item ? {
    title: item.title, excerpt: item.excerpt, body: item.body, category: item.category,
    country: item.country, city: item.city, location: item.location,
    website: item.website ?? "", video_url: item.video_url ?? "", event_date: item.event_date ?? "",
  } : {});
  const [file, setFile] = useState<File | null>(null); const [attach, setAttach] = useState<File | null>(null);
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value });
  async function upload(fl: File) {
    const path = `${kind}/${Date.now()}-${fl.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error } = await supabase.storage.from("media").upload(path, fl, { contentType: fl.type });
    if (error) throw error;
    return `${window.location.origin}/api/public/media/${path}`;
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    try {
      const { data: u } = await supabase.auth.getUser();
      const image_url = file ? await upload(file) : item?.image_url ?? null;
      const file_url = attach ? await upload(attach) : item?.file_url ?? null;
      const row = {
        kind, title: v.title, excerpt: v.excerpt ?? "", body: v.body ?? "",
        category: v.category ?? "", country: v.country ?? "", city: v.city ?? "", location: v.location ?? "",
        website: v.website || null, video_url: v.video_url || null, event_date: v.event_date || null,
        image_url, file_url, published: true,
      };
      const { error } = item
        ? await supabase.from("content_items").update(row).eq("id", item.id)
        : await supabase.from("content_items").insert({ ...row, slug: slugify(v.title || "post"), author_id: u.user?.id });
      if (error) throw error;
      setMsg(item ? "Saved! The changes are live on the site." : "Published! It now appears on the site.");
      if (!item) { setV({}); setFile(null); setAttach(null); (e.target as HTMLFormElement).reset(); }
      onDone();
    } catch (err) { setMsg((err as Error).message); } finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="space-y-3 rounded-lg border border-border bg-card p-6">
    <div className="flex items-center justify-between">
      <h2 className="font-bold">{item ? `Edit ${kinds[kind].single.toLowerCase()}` : `New ${kinds[kind].single.toLowerCase()}`}</h2>
      {item && <button type="button" onClick={onCancel} aria-label="Cancel editing" className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><X size={16} /></button>}
    </div>
    {item?.image_url && !file && <img src={item.image_url} alt="" className="h-28 w-full rounded object-cover" />}
    <input className={field} required placeholder="Title" value={v.title ?? ""} onChange={set("title")} />
    <textarea className={`${field} py-2`} rows={2} placeholder="Short description (used in share previews)" value={v.excerpt ?? ""} onChange={set("excerpt")} />
    {Object.entries(f).map(([k, label]) => k === "file_url" ? null : k === "body"
      ? <textarea key={k} className={`${field} py-2`} rows={6} placeholder={label} value={v[k] ?? ""} onChange={set(k)} />
      : <input key={k} className={field} type={k === "event_date" ? "date" : "text"} placeholder={label} value={v[k] ?? ""} onChange={set(k)} />)}
    <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border p-3 text-sm"><Upload size={16} />{file ? file.name : item?.image_url ? "Replace image" : kind === "partner" ? "Upload logo" : "Upload image"}<input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label>
    {"file_url" in f && <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border p-3 text-sm"><Upload size={16} />{attach ? attach.name : item?.file_url ? "Replace downloadable file" : "Upload downloadable file"}<input type="file" className="hidden" onChange={e => setAttach(e.target.files?.[0] ?? null)} /></label>}
    {msg && <p className="text-sm text-primary">{msg}</p>}
    <Button type="submit" disabled={busy} className="w-full">{busy ? "Saving…" : item ? "Save changes" : "Publish"}</Button>
  </form>;
}
