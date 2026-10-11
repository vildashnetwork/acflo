import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "../components/pages";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About ACFLO — Local Strength, Continental Connection" },
    { name: "description", content: "Learn about ACFLO’s vision, mission, approach and relationship with ZOZAC Community." },
    { property: "og:title", content: "About ACFLO — Local Strength, Continental Connection" },
    { property: "og:description", content: "Learn about ACFLO’s vision, mission, approach and relationship with ZOZAC Community." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AboutPage,
});
