import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/pages";
export const Route = createFileRoute("/terms")({
 head: () => ({ meta: [{ title: "Terms — ACFLO" }, { name: "description", content: "Read participation and website terms for the ACFLO demonstration website." }, { property: "og:title", content: "Terms — ACFLO" }, { property: "og:description", content: "Read participation and website terms for the ACFLO demonstration website." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: () => <LegalPage type="Terms" />,
});
