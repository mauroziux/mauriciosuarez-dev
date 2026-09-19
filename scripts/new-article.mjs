#!/usr/bin/env node
// Scaffolds a new article: npm run new:article -- "Title" [--lang es|en] [--slug custom]
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES_DIR = resolve(ROOT, "src/content/articles");

const LANGS = ["en", "es"];
const ROUTE_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const positional = [];
  const options = { lang: "en", slug: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--lang") {
      const value = argv[++i];
      if (!LANGS.includes(value)) {
        fail(`--lang must be one of: ${LANGS.join(", ")} (received "${value}")`);
      }
      options.lang = value;
    } else if (arg === "--slug") {
      const value = argv[++i];
      if (!value) fail("--slug requires a value");
      options.slug = value;
    } else if (arg.startsWith("--")) {
      fail(`unknown option "${arg}"`);
    } else {
      positional.push(arg);
    }
  }
  return { title: positional.join(" ").trim(), ...options };
}

/** NFD accent-strip, lowercase, invalid chars → dash, collapse, trim. */
function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Quote a string so it is safe inside double quotes in YAML. */
function yamlQuote(value) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

const { title, lang, slug: slugOverride } = parseArgs(process.argv.slice(2));
if (!title) fail('missing title: npm run new:article -- "Article title" [--lang es|en] [--slug custom-slug]');

const slug = slugOverride ?? slugify(title);
if (!ROUTE_SLUG_RE.test(slug)) {
  fail(
    `invalid routeSlug "${slug}" (from title${slugOverride ? " (--slug override)" : ""}). ` +
      "Use lowercase letters and digits separated by single hyphens, or pass --slug explicitly.",
  );
}

const filePath = resolve(ARTICLES_DIR, `${slug}-${lang}.md`);
if (existsSync(filePath)) {
  fail(`refusing to overwrite existing file: ${filePath}`);
}

const todayUtc = new Date().toISOString().slice(0, 10);
const frontmatter = [
  "---",
  `title: ${yamlQuote(title)}`,
  'description: "TODO: One-sentence summary shown in listings, SEO metadata and RSS."',
  `lang: ${yamlQuote(lang)}`,
  `routeSlug: ${yamlQuote(slug)}`,
  "tags: []",
  `publishedDate: ${todayUtc}`,
  "draft: true",
  "---",
  "",
  "TODO: Write the article.",
  "",
];

mkdirSync(ARTICLES_DIR, { recursive: true });
writeFileSync(filePath, frontmatter.join("\n"), { flag: "wx" });

const otherLang = lang === "en" ? "es" : "en";
console.log(`Created: ${filePath}`);
console.log("");
console.log("Next steps:");
console.log("  1. Write the article body.");
console.log(`  2. Translate later (reuse the SAME routeSlug):`);
console.log(`     npm run new:article -- "Translated title" --lang ${otherLang} --slug ${slug}`);
console.log(`  3. Publish: change draft: true to draft: false in the frontmatter.`);
