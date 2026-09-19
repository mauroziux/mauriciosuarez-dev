import rss from "@astrojs/rss";
import { getPublishedArticles } from "../../lib/articles";
import { t } from "../../i18n";

export async function GET(context) {
  const articles = await getPublishedArticles("en");
  return rss({
    title: "mauriciosuarez.dev — Writing",
    description: t("en", "meta.description.writing"),
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishedDate,
      link: `/en/writing/${article.data.routeSlug}/`,
    })),
    customData: "<language>en</language>",
  });
}
