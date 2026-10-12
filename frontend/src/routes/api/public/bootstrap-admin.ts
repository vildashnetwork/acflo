import { createFileRoute } from "@tanstack/react-router";

// Proxies first-admin creation to the ACFLO backend (MongoDB admins).
// Kept for backward compatibility — the auth page now calls the backend directly.
export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const base = ((typeof process !== "undefined" && process.env["API_URL"]) || "http://localhost:5000").replace(
          /\/+$/,
          "",
        );
        try {
          const res = await fetch(`${base}/api/auth/bootstrap`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body,
          });
          const text = await res.text();
          return new Response(text, {
            status: res.status,
            headers: { "content-type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ error: "ACFLO backend is not reachable" }), {
            status: 502,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
