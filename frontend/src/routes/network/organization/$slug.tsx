import { createFileRoute } from "@tanstack/react-router";
import { OrganizationPage } from "../../../components/pages";
export const Route = createFileRoute("/network/organization/$slug")({
 head: () => ({ meta: [{ title: "Organization Profile — ACFLO Network" }, { name: "description", content: "Explore a demonstration organization profile in the ACFLO network." }, { property: "og:title", content: "Organization Profile — ACFLO Network" }, { property: "og:description", content: "Explore a demonstration organization profile in the ACFLO network." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: () => { const { slug } = Route.useParams(); return <OrganizationPage slug={slug} />; },
});
