<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to Lovable. Avoid rewriting published git history.
<!-- LOVABLE:END -->

- Keep all ACFLO demonstration content in `src/lib/content.ts` and render it through reusable page components; this makes a later content API replacement straightforward.
- Keep the public website frontend-only with mock submissions and no persistence; the brief expressly requests a frontend-first demo.
- Use separate TanStack route files for each shareable page and detail view; this preserves direct links and page-specific metadata.
- Keep the image slider CSS-based and mount the 3D network sculpture through a lazy, browser-only component with reduced-motion controls; this preserves SSR and limits graphics work to the visible section.
- Render the ZOZAC location through the Google Maps Embed API using the connected browser key, with a direct Maps link when setup is absent; this avoids public billable server lookups and keeps credentials private.
