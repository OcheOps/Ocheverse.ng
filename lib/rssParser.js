import Parser from "rss-parser";

const RSS_PROXY = process.env.RSS_PROXY_URL || 'https://rss.ocheverse.ng';

export function createParser() {
  return new Parser();
}

export const FEEDS = {
  ocheverse: `${RSS_PROXY}/ocheverse`,
  bpur: `${RSS_PROXY}/bpur`,
};

// Direct upstream URLs — used as a fallback when the proxy is rate-limited.
// Server-side fetches (getStaticProps) can hit Substack directly since the
// Next server IP isn't rate-limited the way Cloudflare Workers IPs are.
export const DIRECT_FEEDS = {
  ocheverse: 'https://ocheverse.substack.com/feed',
  bpur: 'https://bpur.substack.com/feed',
};

// Fetch + parse with retry/backoff on 429 and transient network errors.
// Substack (via the CF worker proxy) rate-limits sporadically; a bare parseURL
// on a 429 wipes the blog page for an ISR window, so we retry a few times.
async function fetchXml(url, { retries = 2, baseDelayMs = 400 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; OcheverseBot/1.0; +https://ocheverse.ng)',
          'accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
        },
      });
      if (res.status === 429 || res.status >= 500) {
        throw new Error(`Upstream ${res.status} for ${url}`);
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      return await res.text();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, baseDelayMs * Math.pow(2, attempt)));
      }
    }
  }
  throw lastErr;
}

export async function parseFeedWithRetry(parser, url, opts = {}) {
  const xml = await fetchXml(url, opts);
  return parser.parseString(xml);
}

// Try direct upstream first (fast, not rate-limited from our origin IP);
// fall back to the CF worker proxy if direct fails.
export async function parseFeedResilient(parser, feedName) {
  try {
    const xml = await fetchXml(DIRECT_FEEDS[feedName]);
    return await parser.parseString(xml);
  } catch (directErr) {
    console.warn(`[RSS] Direct fetch failed for ${feedName}, trying proxy:`, directErr.message);
    const xml = await fetchXml(FEEDS[feedName]);
    return parser.parseString(xml);
  }
}
