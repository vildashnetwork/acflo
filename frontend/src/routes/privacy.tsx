import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/pages";
export const Route = createFileRoute("/privacy")({
 head: () => ({ meta: [{ title: "Privacy Policy — ACFLO" }, { name: "description", content: "Read privacy information for the ACFLO demonstration website." }, { property: "og:title", content: "Privacy Policy — ACFLO" }, { property: "og:description", content: "Read privacy information for the ACFLO demonstration website." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
 component: () => <LegalPage type="Privacy Policy" />,
});
