import { createFileRoute } from "@tanstack/react-router";
import { JoinPage } from "../components/pages";
export const Route = createFileRoute("/join")({
  head: () => ({ meta: [
    { title: "Join ACFLO — Connect With the Network" },
    { name: "description", content: "Apply to connect with the ACFLO network using a frontend demonstration form." },
    { property: "og:title", content: "Join ACFLO — Connect With the Network" },
    { property: "og:description", content: "Apply to connect with the ACFLO network using a frontend demonstration form." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: JoinPage,
});
