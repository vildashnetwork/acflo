import { createFileRoute } from "@tanstack/react-router";
import { ResourcesPage } from "../components/pages";
export const Route = createFileRoute("/resources")({
  head: () => ({ meta: [
    { title: "Resources & Publications — ACFLO" },
    { name: "description", content: "Browse demonstration toolkits, publications and materials for locally led organizations." },
    { property: "og:title", content: "Resources & Publications — ACFLO" },
    { property: "og:description", content: "Browse demonstration toolkits, publications and materials for locally led organizations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ResourcesPage,
});
