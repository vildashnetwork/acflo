import { createFileRoute } from "@tanstack/react-router";
import { VideosPage } from "../components/pages";
export const Route = createFileRoute("/videos")({
  head: () => ({ meta: [
    { title: "Video Library — ACFLO" },
    { name: "description", content: "Explore ACFLO’s demonstration video library of community stories, conversations and events." },
    { property: "og:title", content: "Video Library — ACFLO" },
    { property: "og:description", content: "Explore ACFLO’s demonstration video library of community stories, conversations and events." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: VideosPage,
});
