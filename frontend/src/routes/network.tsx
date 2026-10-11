import { createFileRoute } from "@tanstack/react-router";
import { NetworkPage } from "../components/pages";
export const Route = createFileRoute("/network")({
  head: () => ({ meta: [
    { title: "Organization Network — ACFLO" },
    { name: "description", content: "Search a demonstration directory of local organizations and community actors across Africa." },
    { property: "og:title", content: "Organization Network — ACFLO" },
    { property: "og:description", content: "Search a demonstration directory of local organizations and community actors across Africa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NetworkPage,
});
