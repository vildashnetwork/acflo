import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { listPublicContent } from "./cms.functions";
import * as base from "./content";

export type Item = Tables<"content_items">;
export type Profile = Tables<"profiles">;

export const SITE_URL = "https://id-preview--6e97e86b-9184-4be8-856b-7c92096cfae3.lovable.app";
export const absUrl = (u: string) => (u.startsWith("http") ? u : `${SITE_URL}${u}`);

export const kinds = {
  news: { label: "News & articles", single: "Article", fields: { category: "Category", country: "Country", body: "Full story" } },
  event: { label: "Events", single: "Event", fields: { category: "Event type", country: "Country", location: "Location (city, country)", event_date: "Date", body: "Full details" } },
  gallery: { label: "Gallery", single: "Photo", fields: { category: "Category", country: "Location" } },
  video: { label: "Videos", single: "Video", fields: { category: "Category", country: "Country", video_url: "Video link (YouTube or MP4)" } },
  partner: { label: "Partners", single: "Partner", fields: { category: "Partner category", country: "Country", website: "Website" } },
  organization: { label: "Organizations", single: "Organization", fields: { category: "Sector", location: "Organization type", city: "City", country: "Country", website: "Website", body: "About" } },
  resource: { label: "Resources", single: "Resource", fields: { category: "Resource type", country: "Country", file_url: "File" } },
} as const;
export type Kind = keyof typeof kinds;
export const isKind = (k: string): k is Kind => k in kinds;

const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }) : "");
const img = (i: Item, fallback: string) => i.image_url || fallback;

export function mapItems(items: Item[], admins: Profile[]) {
  const of = (k: Kind) => items.filter((i) => i.kind === k);
  const news = [
    ...of("news").map((i) => ({ id: i.slug, title: i.title, category: i.category || "News", country: i.country, date: fmt(i.created_at), author: "ACFLO Editorial", readTime: `${Math.max(2, Math.round(i.body.split(/\s+/).length / 200))} min read`, excerpt: i.excerpt, image: img(i, base.images.community), body: i.body as string | undefined })),
    ...base.news.map((x) => ({ ...x, body: undefined as string | undefined })),
  ];
  const events = [
    ...of("event").map((i) => ({ id: i.slug, title: i.title, date: fmt(i.event_date ?? i.created_at), country: i.country, location: i.location, type: i.category || "Event", image: img(i, base.images.summit), description: i.excerpt, body: i.body as string | undefined })),
    ...base.events.map((x) => ({ ...x, body: undefined as string | undefined })),
  ];
  const organizations = [
    ...of("organization").map((i) => ({ id: i.slug, name: i.title, country: i.country, city: i.city, sector: i.category, type: i.location || "Organization", initials: i.title.split(" ").map((x) => x[0]).slice(0, 3).join(""), description: i.excerpt, website: i.website || "", image: img(i, base.images.community), body: i.body as string | undefined })),
    ...base.organizations.map((x) => ({ ...x, body: undefined as string | undefined })),
  ];
  const partners = [
    ...admins.map((p) => ({ name: p.organization || p.display_name, country: p.country || "", category: "Team & Admins", description: p.bio || `${p.display_name} helps run ACFLO.`, website: p.website || "", logo: p.avatar_url || "", person: p.display_name as string | undefined })),
    ...of("partner").map((i) => ({ name: i.title, country: i.country, category: i.category || "Partners", description: i.excerpt, website: i.website || "", logo: i.image_url || "", person: undefined as string | undefined })),
    ...base.partners.map((x) => ({ ...x, person: undefined as string | undefined })),
  ];
  const gallery = [...of("gallery").map((i) => ({ caption: i.title, category: i.category || "Community", location: i.country, date: fmt(i.created_at), image: img(i, base.images.field) })), ...base.gallery];
  const videos = [...of("video").map((i) => ({ title: i.title, category: i.category || "Community Stories", country: i.country, duration: "", image: img(i, base.images.field), videoUrl: i.video_url as string | undefined })), ...base.videos.map((x) => ({ ...x, videoUrl: undefined as string | undefined }))];
  const resources = [...of("resource").map((i) => ({ title: i.title, type: i.category || "Publications", date: fmt(i.created_at), description: i.excerpt, country: i.country, fileUrl: i.file_url as string | undefined })), ...base.resources.map((x) => ({ ...x, fileUrl: undefined as string | undefined }))];
  return { news, events, organizations, partners, gallery, videos, resources };
}

export const publicContentQuery = queryOptions({ queryKey: ["public-content"], queryFn: () => listPublicContent(), staleTime: 30_000 });

export function useCms() {
  const { data } = useQuery(publicContentQuery);
  return mapItems((data?.items ?? []) as Item[], (data?.admins ?? []) as Profile[]);
}

export function youtubeEmbed(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
