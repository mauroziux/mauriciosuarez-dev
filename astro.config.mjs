import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Cloudflare rules are authoritative; Astro mirrors article aliases for local/static preview.
const articleRedirects = Object.fromEntries(
  readFileSync(new URL("./public/_redirects", import.meta.url), "utf8")
    .split("\n")
    .map((line) => line.trim().split(/\s+/))
    .filter(([from]) => /^\/(?:en\/writing|es\/articulos)\/[^/*]+\/$/.test(from))
    .map(([from, destination, status]) => [from, { destination, status: Number(status) }]),
);

export default defineConfig({
  site: "https://mauriciosuarez.dev",
  output: "static",
  trailingSlash: "always",
  redirects: articleRedirects,
  integrations: [sitemap({ filter: (url) => !Object.hasOwn(articleRedirects, new URL(url).pathname) })],
  vite: {
    plugins: [tailwindcss()],
  },
});
