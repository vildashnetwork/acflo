import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "../../components/pages";
export const Route = createFileRoute("/news/$slug")({
 head: () => ({ meta: [{ title: "Story — ACFLO News & Media" }, { name: "description", content: "Read a story about community-driven collaboration across Africa." }, { property: "og:title", content: "Story — ACFLO News & Media" }, { property: "og:description", content: "Read a story about community-driven collaboration across Africa." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: () => { const { slug } = Route.useParams(); return <ArticlePage slug={slug} />; },
});
