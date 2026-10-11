import { createFileRoute } from "@tanstack/react-router";
import { PartnersPage } from "../components/pages";
export const Route = createFileRoute("/partners")({
  head: () => ({ meta: [
    { title: "Partners — ACFLO" },
    { name: "description", content: "Explore demonstration partner profiles and opportunities to collaborate with ACFLO." },
    { property: "og:title", content: "Partners — ACFLO" },
    { property: "og:description", content: "Explore demonstration partner profiles and opportunities to collaborate with ACFLO." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PartnersPage,
});
