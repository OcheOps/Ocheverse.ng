import { createParser, parseFeedResilient } from "../../lib/rssParser";
import { publishedGuides } from "../../data/guides";

const SITE_URL = "https://ocheverse.ng";

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/blog", priority: "0.9", changefreq: "daily" },
  { path: "/hire", priority: "0.9", changefreq: "monthly" },
  { path: "/projects", priority: "0.8", changefreq: "weekly" },
  { path: "/guides", priority: "0.8", changefreq: "weekly" },
  { path: "/speaking", priority: "0.6", changefreq: "monthly" },
  { path: "/now", priority: "0.7", changefreq: "monthly" },
  { path: "/learn", priority: "0.6", changefreq: "monthly" },
  { path: "/resources", priority: "0.6", changefreq: "monthly" },
  { path: "/music", priority: "0.6", changefreq: "weekly" },
  { path: "/stack", priority: "0.5", changefreq: "monthly" },
  { path: "/guestbook", priority: "0.5", changefreq: "daily" },
  { path: "/game", priority: "0.3", changefreq: "yearly" },
  { path: "/2048", priority: "0.3", changefreq: "yearly" },
];

export default async function handler(req, res) {
  const parser = createParser();
  let blogEntries = [];

  const feeds = [{ source: "ocheverse" }, { source: "bpur" }];

  for (const feed of feeds) {
    try {
      const parsed = await parseFeedResilient(parser, feed.source);
      parsed.items.forEach((item) => {
        let slug = item.link.split("/").pop();
        if (slug.includes("?")) slug = slug.split("?")[0];
        blogEntries.push({
          path: `/blog/${feed.source}/${slug}`,
          lastmod: item.isoDate || new Date(item.pubDate).toISOString(),
          priority: "0.8",
          changefreq: "monthly",
        });
      });
    } catch (e) {
      console.error(`Sitemap feed error for ${feed.source}:`, e);
    }
  }

  const guideEntries = publishedGuides().map((g) => ({
    path: `/guides/${g.slug}`,
    lastmod: new Date(g.date).toISOString(),
    priority: "0.8",
    changefreq: "monthly",
  }));

  const allPages = [...staticPages, ...guideEntries, ...blogEntries];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod.split("T")[0]}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
  res.status(200).send(sitemap);
}
