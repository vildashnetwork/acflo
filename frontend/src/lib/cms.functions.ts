import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Server-side ACFLO backend base URL. API_URL wins on the server,
// VITE_API_URL is the build-time override, localhost for local dev.
const API_BASE = (
  (typeof process !== "undefined" && process.env["API_URL"]) ||
  import.meta.env["VITE_API_URL"] ||
  "http://localhost:5000"
).replace(/\/+$/, "");

async function apiGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    // Backend offline — fall back gracefully (static content still renders).
    return fallback;
  }
}

export const listPublicContent = createServerFn({ method: "GET" }).handler(async () => {
  const [content, admins] = await Promise.all([
    apiGet<{ items?: any[] }>("/api/content?published=true&limit=200", {}),
    apiGet<{ admins?: any[] }>("/api/auth/admins", {}),
  ]);
  return { items: content.items ?? [], admins: admins.admins ?? [] };
});

export const getContentItem = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ kind: z.string(), slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const item = await apiGet<any | null>(
      `/api/content/${encodeURIComponent(data.kind)}/${encodeURIComponent(data.slug)}`,
      null,
    );
    if (!item || item.error) return null;
    return item;
  });
