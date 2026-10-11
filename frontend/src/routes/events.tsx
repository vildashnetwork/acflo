import { createFileRoute } from "@tanstack/react-router";
import { EventsPage } from "../components/pages";
export const Route = createFileRoute("/events")({
  head: () => ({ meta: [
    { title: "Events & Convenings — ACFLO" },
    { name: "description", content: "Explore demonstration events, convenings and learning opportunities across the ACFLO network." },
    { property: "og:title", content: "Events & Convenings — ACFLO" },
    { property: "og:description", content: "Explore demonstration events, convenings and learning opportunities across the ACFLO network." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: EventsPage,
});
