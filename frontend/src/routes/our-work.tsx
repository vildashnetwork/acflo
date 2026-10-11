import { createFileRoute } from "@tanstack/react-router";
import { WorkPage } from "../components/pages";
export const Route = createFileRoute("/our-work")({
  head: () => ({ meta: [
    { title: "Our Work — ACFLO" },
    { name: "description", content: "Explore ACFLO’s focus on capacity building, collaboration, knowledge sharing and community development." },
    { property: "og:title", content: "Our Work — ACFLO" },
    { property: "og:description", content: "Explore ACFLO’s focus on capacity building, collaboration, knowledge sharing and community development." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: WorkPage,
});
