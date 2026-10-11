import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "../components/pages";
export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact ACFLO — Start a Conversation" },
    { name: "description", content: "Get in touch with ACFLO about collaboration, participation and local action." },
    { property: "og:title", content: "Contact ACFLO — Start a Conversation" },
    { property: "og:description", content: "Get in touch with ACFLO about collaboration, participation and local action." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ContactPage,
});
