import { createFileRoute } from "@tanstack/react-router";
import { GovernancePage } from "../components/pages";
export const Route = createFileRoute("/governance")({
  head: () => ({ meta: [
    { title: "Governance — ACFLO" },
    { name: "description", content: "Explore the proposed governance structure and relationship between ACFLO and ZOZAC Community." },
    { property: "og:title", content: "Governance — ACFLO" },
    { property: "og:description", content: "Explore the proposed governance structure and relationship between ACFLO and ZOZAC Community." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: GovernancePage,
});
