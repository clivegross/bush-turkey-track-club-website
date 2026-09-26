// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { legacyRedirectFiles } from "./src/redirects.mjs";

export default defineConfig({
  site: "https://www.bushturkey.club",
  trailingSlash: "ignore",
  integrations: [sitemap(), legacyRedirectFiles()],
  vite: {
    plugins: [tailwindcss()],
  },
});
