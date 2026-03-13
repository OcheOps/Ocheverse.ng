// Cloudflare Worker — proxies Substack RSS feeds
// Deploy: npx wrangler deploy --name rss-proxy cloudflare-worker/rss-proxy.js
// Or paste into Cloudflare Dashboard > Workers & Pages > Create Worker

const ALLOWED_FEEDS = {
  ocheverse: 'https://ocheverse.substack.com/feed',
  bpur: 'https://bpur.substack.com/feed',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const feed = url.pathname.replace(/^\//, '').replace(/\/$/, '');

    if (!feed || !ALLOWED_FEEDS[feed]) {
      return new Response(JSON.stringify({ feeds: Object.keys(ALLOWED_FEEDS) }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const feedUrl = ALLOWED_FEEDS[feed];

    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': 'https://ocheverse.ng',
      },
    });
  },
};
