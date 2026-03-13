import { createParser } from "../../lib/rssParser";

export default async function handler(req, res) {
  const parser = createParser();
  let allItems = [];

  const feeds = [
    { source: "ocheverse", url: "https://ocheverse.substack.com/feed", label: "Ocheverse" },
    { source: "bpur", url: "https://bpur.substack.com/feed", label: "BPUR" },
  ];

  for (const feed of feeds) {
    try {
      const parsed = await parser.parseURL(feed.url);
      parsed.items.forEach((item) => {
        let slug = item.link.split("/").pop();
        if (slug.includes("?")) slug = slug.split("?")[0];
        allItems.push({
          title: `[${feed.label}] ${item.title}`,
          link: `https://ocheverse.ng/blog/${feed.source}/${slug}`,
          pubDate: item.isoDate || new Date(item.pubDate).toISOString(),
          description:
            (item["content:encoded"] || item.content || "")
              .replace(/<[^>]*>?/gm, "")
              .slice(0, 300) + "...",
          author: item.creator || "David Gideon",
        });
      });
    } catch (e) {
      console.error(`RSS feed error for ${feed.source}:`, e);
    }
  }

  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  const rssItems = allItems
    .map(
      (item) => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid>${item.link}</guid>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      <author>${item.author}</author>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ocheverse Blog</title>
    <link>https://ocheverse.ng/blog</link>
    <description>Engineering war stories, philosophical essays, and everything in between by David Gideon.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://ocheverse.ng/api/feed" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.status(200).send(rss);
}
