import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../components/pages";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ACFLO — Connecting Local Organizations Across Africa" },
    { name: "description", content: "Explore ACFLO, a flagship program of ZOZAC Community connecting local organizations and strengthening communities across Africa." },
    { property: "og:title", content: "ACFLO — Connecting Local Organizations Across Africa" },
    { property: "og:description", content: "Explore ACFLO, a flagship program of ZOZAC Community connecting local organizations and strengthening communities across Africa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});
