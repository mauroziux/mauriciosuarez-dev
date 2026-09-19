import rss from "@astrojs/rss";
import { getPublishedArticles } from "../../lib/articles";
import { t } from "../../i18n";

export async function GET(context) {
  const articles = await getPublishedArticles("es");
  return rss({
    title: "mauriciosuarez.dev — Artículos",
    description: t("es", "meta.description.writing"),
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishedDate,
      link: `/es/articulos/${article.data.routeSlug}/`,
    })),
    customData: "<language>es</language>",
  });
}
