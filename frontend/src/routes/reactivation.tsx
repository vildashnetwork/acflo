import { createFileRoute } from "@tanstack/react-router";
import { ReactivationPage } from "../components/pages";
export const Route = createFileRoute("/reactivation")({
  head: () => ({ meta: [
    { title: "Strategic Reactivation — ACFLO" },
    { name: "description", content: "Explore the proposed agenda for ACFLO’s strategic reactivation and movement-building convening." },
    { property: "og:title", content: "Strategic Reactivation — ACFLO" },
    { property: "og:description", content: "Explore the proposed agenda for ACFLO’s strategic reactivation and movement-building convening." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ReactivationPage,
});
