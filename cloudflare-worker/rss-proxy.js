// Cloudflare Worker — proxies Substack RSS feeds
// Deploy: npx wrangler deploy --name rss-proxy cloudflare-worker/rss-proxy.js
// Or paste into Cloudflare Dashboard > Workers & Pages > Create Worker

const ALLOWED_FEEDS = {
  ocheverse: 'https://ocheverse.substack.com/feed',
  bpur: 'https://bpur.substack.com/feed',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const feed = url.pathname.replace(/^\//, '').replace(/\/$/, '');

    if (!feed || !ALLOWED_FEEDS[feed]) {
      return new Response(JSON.stringify({ feeds: Object.keys(ALLOWED_FEEDS) }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const feedUrl = ALLOWED_FEEDS[feed];

    const cache = caches.default;
    const cacheKey = new Request(url.toString(), { method: 'GET' });

    // Substack rate-limits by (IP + UA + feed), and Cloudflare Worker egress IPs
    // are shared/hot. Try a couple of UAs so a per-UA rate-limit doesn't kill us.
    const uaPool = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0',
      'feedparser/6.0.11 +https://ocheverse.ng',
    ];

    let response;
    for (let i = 0; i < uaPool.length; i++) {
      response = await fetch(feedUrl, {
        headers: {
          'User-Agent': uaPool[i],
          'Accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        cf: { cacheTtl: 0 },
      });
      if (response.status !== 429) break;
      if (i < uaPool.length - 1) {
        await new Promise(r => setTimeout(r, 400 * (i + 1)));
      }
    }

    // Only long-cache successful upstream responses. If Substack rate-limits us
    // (429) or errors, don't let CF cache that failure for an hour — instead try
    // to serve the last-known-good body from the edge cache.
    if (!response.ok) {
      const cached = await cache.match(cacheKey);
      if (cached) {
        const headers = new Headers(cached.headers);
        headers.set('X-Proxy-Stale', 'true');
        return new Response(cached.body, { status: 200, headers });
      }
      return new Response(await response.text(), {
        status: response.status,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': 'https://ocheverse.ng',
        },
      });
    }

    const body = await response.text();
    const successResponse = new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': 'https://ocheverse.ng',
      },
    });

    // Store a copy in the edge cache so future 429s can serve stale.
    ctx.waitUntil(cache.put(cacheKey, successResponse.clone()));
    return successResponse;
  },
};
