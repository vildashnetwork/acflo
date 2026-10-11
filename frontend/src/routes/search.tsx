import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../components/pages";
export const Route = createFileRoute("/search")({
  head: () => ({ meta: [
    { title: "Search ACFLO — Discover the Network" },
    { name: "description", content: "Search demonstration organizations, stories, events, partners, videos and resources across ACFLO." },
    { property: "og:title", content: "Search ACFLO — Discover the Network" },
    { property: "og:description", content: "Search demonstration organizations, stories, events, partners, videos and resources across ACFLO." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SearchPage,
});
