import Parser from "rss-parser";

const RSS_PROXY = process.env.RSS_PROXY_URL || '';

const RSS_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

export function createParser() {
  return new Parser({ headers: RSS_HEADERS });
}

// Feed URLs — routes through Cloudflare Worker proxy when configured
export const FEEDS = {
  ocheverse: RSS_PROXY ? `${RSS_PROXY}/ocheverse` : 'https://ocheverse.substack.com/feed',
  bpur: RSS_PROXY ? `${RSS_PROXY}/bpur` : 'https://bpur.substack.com/feed',
};
