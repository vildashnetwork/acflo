import { createFileRoute } from "@tanstack/react-router";
import { NewsPage } from "../components/pages";
export const Route = createFileRoute("/news")({
  head: () => ({ meta: [
    { title: "News & Media — ACFLO" },
    { name: "description", content: "Read stories and perspectives about locally led action and collaboration across Africa." },
    { property: "og:title", content: "News & Media — ACFLO" },
    { property: "og:description", content: "Read stories and perspectives about locally led action and collaboration across Africa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NewsPage,
});
