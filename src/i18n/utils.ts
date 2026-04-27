/// <reference path="astro" />
import type { Lang, UIKey } from "./ui";
import { ui, defaultLang } from "./ui";

/**
 * Route mapping: lang → localized path segments.
 * Keys match the page directory names under src/pages/.
 */
export const routeMap: Record<
  Lang,
  {
    home: string;
    services: string;
    work: string;
    writing: string;
    about: string;
    contact: string;
  }
> = {
  en: {
    home: "/en/",
    services: "/en/services/",
    work: "/en/work/",
    writing: "/en/writing/",
    about: "/en/about/",
    contact: "/en/contact/",
  },
  es: {
    home: "/es/",
    services: "/es/servicios/",
    work: "/es/proyectos/",
    writing: "/es/articulos/",
    about: "/es/sobre-mi/",
    contact: "/es/contacto/",
  },
};

/** Get a translated UI string for the given language. */
export function t(lang: Lang, key: UIKey): string {
  return ui[lang][key] ?? ui[defaultLang][key];
}

/** Get the localized route for a page name. */
export function getRoute(lang: Lang, page: keyof (typeof routeMap)[Lang]): string {
  return routeMap[lang][page];
}

/** Derive the language from a URL path. */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

/** Build the alternate-language link for the current page. */
export function getAlternateUrl(url: URL, targetLang: Lang): string {
  const currentLang = getLangFromUrl(url);
  const pathname = url.pathname;

  // Replace the language segment
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === currentLang) {
    segments[0] = targetLang;
  }

  // Localize known page segments across languages (only when switching)
  if (targetLang !== currentLang) {
    const pageRemap: Record<string, Record<string, string>> = {
      en: {
        services: "servicios",
        work: "proyectos",
        writing: "articulos",
        about: "sobre-mi",
        contact: "contacto",
      },
      es: {
        servicios: "services",
        proyectos: "work",
        articulos: "writing",
        "sobre-mi": "about",
        contacto: "contact",
      },
    };

    for (let i = 1; i < segments.length; i++) {
      const remap = pageRemap[currentLang]?.[segments[i]];
      if (remap) segments[i] = remap;
    }
  }

  return "/" + segments.join("/") + (pathname.endsWith("/") ? "/" : "");
}
