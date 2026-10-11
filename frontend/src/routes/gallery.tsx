import { createFileRoute } from "@tanstack/react-router";
import { GalleryPage } from "../components/pages";
export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [
    { title: "Photo Stories — ACFLO" },
    { name: "description", content: "View images illustrating community connection, training and local action across Africa." },
    { property: "og:title", content: "Photo Stories — ACFLO" },
    { property: "og:description", content: "View images illustrating community connection, training and local action across Africa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: GalleryPage,
});
