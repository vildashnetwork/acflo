import { createFileRoute } from "@tanstack/react-router";
import { EventDetailPage } from "../../components/pages";
export const Route = createFileRoute("/events/$slug")({
 head: () => ({ meta: [{ title: "Event Details — ACFLO" }, { name: "description", content: "Explore event information, agenda and participation opportunities with ACFLO." }, { property: "og:title", content: "Event Details — ACFLO" }, { property: "og:description", content: "Explore event information, agenda and participation opportunities with ACFLO." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: () => { const { slug } = Route.useParams(); return <EventDetailPage slug={slug} />; },
});
