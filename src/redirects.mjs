// @ts-check
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Old URLs from the pre-Astro site, so links already shared on Instagram and
// Facebook keep working. Add an entry whenever a legacy page is migrated
// into src/content/events/.
export const legacyRedirects = {
  "/events.html": "/events/",
  "/about.html": "/about/",
  "/records.html": "/records/",
  "/running-calculator.html": "/running-calculator/",
  "/store.html": "https://www.revolutionise.com.au/bushturkeytc/shop",
  "/store/index.html": "https://www.revolutionise.com.au/bushturkeytc/shop",
  "/bush-turkey-classic-2024.html": "/events/bush-turkey-classic-2024/",
  "/bush-turkey-relay-2025.html": "/events/bush-turkey-relay-2025/",
};

/**
 * Writes each redirect as a real file at the old path (e.g. dist/events.html).
 * Astro's built-in `redirects` option would create dist/events.html/index.html,
 * which GitHub Pages does not serve at /events.html.
 * @returns {import("astro").AstroIntegration}
 */
export function legacyRedirectFiles() {
  return {
    name: "legacy-redirect-files",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        for (const [from, to] of Object.entries(legacyRedirects)) {
          const file = fileURLToPath(new URL(`.${from}`, dir));
          const html = `<!doctype html>
<meta charset="utf-8">
<title>Redirecting…</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${to}">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.hash)</script>
<p>Moved to <a href="${to}">${to}</a>.</p>
`;
          await mkdir(dirname(file), { recursive: true });
          await writeFile(file, html);
        }
        logger.info(`Wrote ${Object.keys(legacyRedirects).length} legacy redirects`);
      },
    },
  };
}
