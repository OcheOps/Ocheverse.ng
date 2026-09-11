import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import * as cheerio from "cheerio";
import slugify from "slugify";
import { createParser, parseFeedResilient } from "../../../lib/rssParser";
import ReadingProgress from "../../../components/ReadingProgress";
import BackToTop from "../../../components/BackToTop";
import CopyCodeButton from "../../../components/CopyCodeButton";
import Reactions from "../../../components/Reactions";

export async function getStaticPaths() {
  const parser = createParser();
  const paths = [];
  const feeds = [{ source: "ocheverse" }, { source: "bpur" }];

  for (const feed of feeds) {
    try {
      const parsed = await parseFeedResilient(parser, feed.source);
      parsed.items.forEach((item) => {
        const linkParts = item.link.split("/");
        let slug = linkParts[linkParts.length - 1];
        if (slug.includes("?")) slug = slug.split("?")[0];
        paths.push({ params: { source: feed.source, slug } });
      });
    } catch (e) {
      console.warn(`[RSS] Skipping ${feed.source} paths:`, e.message);
    }
  }

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const { source, slug } = params;
  const parser = createParser();

  try {
    const feed = await parseFeedResilient(parser, source);

    const item = feed.items.find((i) => {
      const parts = i.link.split("/");
      let s = parts[parts.length - 1];
      if (s.includes("?")) s = s.split("?")[0];
      return s === slug;
    });

    if (!item) return { notFound: true };

    let raw = item["content:encoded"] || item.content || "";
    const $ = cheerio.load(raw);
    const toc = [];

    $("h2, h3").each((i, el) => {
      const text = $(el).text();
      const slugId = slugify(text, { lower: true, strict: true }) || `heading-${i}`;
      $(el).attr("id", slugId);
      toc.push({
        id: slugId,
        text,
        level: el.tagName.toLowerCase() === "h2" ? 2 : 3,
      });
    });

    const content = $("body").html() || raw;
    const plain = cheerio.load(raw).root().text().replace(/\s+/g, " ").trim();
    const excerpt = plain.length > 155 ? plain.slice(0, 155) + "…" : plain;
    const imgMatch = raw.match(/<img[^>]+src="([^">]+)"/);
    const coverImage = imgMatch ? imgMatch[1] : null;

    const post = {
      title: item.title,
      content,
      toc,
      pubDate: item.isoDate || new Date(item.pubDate).toISOString(),
      link: item.link,
      author: item.creator || "David Gideon",
      sourceName: source === "ocheverse" ? "Ocheverse" : "BPUR",
      slug,
      source,
      excerpt,
      coverImage,
      readingTime: Math.max(1, Math.ceil(plain.split(/\s+/).length / 200)),
    };

    const relatedPosts = feed.items
      .filter((i) => {
        let s = i.link.split("/").pop();
        if (s.includes("?")) s = s.split("?")[0];
        return s !== slug;
      })
      .slice(0, 3)
      .map((i) => {
        let s = i.link.split("/").pop();
        if (s.includes("?")) s = s.split("?")[0];
        const r = i["content:encoded"] || i.content || "";
        const rp = cheerio.load(r).root().text().replace(/\s+/g, " ").trim();
        return {
          title: i.title,
          slug: s,
          source,
          readingTime: Math.max(1, Math.ceil(rp.split(/\s+/).length / 200)),
          pubDate: i.isoDate || new Date(i.pubDate).toISOString(),
        };
      });

    return { props: { post, relatedPosts }, revalidate: 3600 };
  } catch (e) {
    console.warn(`[RSS] Post ${source}/${slug} unavailable:`, e.message);
    return { notFound: true };
  }
}

const shortDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(-2);
  return `${dd}·${mm}·${yy}`;
};

const longDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function BlogPost({ post, relatedPosts = [] }) {
  const router = useRouter();
  const postUrl = `https://ocheverse.ng${router.asPath}`;
  const [views, setViews] = useState(null);

  useEffect(() => {
    const umamiHost = process.env.NEXT_PUBLIC_UMAMI_API_HOST;
    const umamiWebsiteId = "6c144afc-918f-4b7e-a28b-2eee9c535e40";
    const umamiApiKey = process.env.NEXT_PUBLIC_UMAMI_API_KEY;
    if (!umamiHost || !umamiApiKey) return;
    fetch(
      `${umamiHost}/api/websites/${umamiWebsiteId}/stats?startAt=0&endAt=${Date.now()}&url=${router.asPath}`,
      { headers: { "x-umami-api-key": umamiApiKey } }
    )
      .then((r) => r.json())
      .then((d) => {
        if (d?.pageviews?.value) setViews(d.pageviews.value);
      })
      .catch(() => {});
  }, [router.asPath]);

  if (!post) return <div>Post not found</div>;

  const toneColor = post.source === "ocheverse" ? "var(--blue)" : "var(--red)";
  const toneLabel = post.source === "ocheverse" ? "Ocheverse · Engineering" : "BPUR · Essays";

  return (
    <>
      <ReadingProgress />
      <CopyCodeButton />
      <BackToTop />
      <Head>
        <title>{post.title} — {post.sourceName} · Ocheverse</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} – ${post.sourceName}`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta
          property="og:image"
          content={
            post.coverImage ||
            `https://ocheverse.ng/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.sourceName)}`
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="article:published_time" content={post.pubDate} />
        <meta property="article:author" content={post.author} />
        <link rel="canonical" href={post.link} key="canonical" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              image:
                post.coverImage ||
                `https://ocheverse.ng/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.sourceName)}`,
              datePublished: post.pubDate,
              dateModified: post.pubDate,
              author: {
                "@type": "Person",
                name: post.author || "David Gideon",
                url: "https://ocheverse.ng",
              },
              publisher: {
                "@type": "Person",
                name: "David Gideon",
                url: "https://ocheverse.ng",
              },
              mainEntityOfPage: { "@type": "WebPage", "@id": post.link },
              url: postUrl,
            }),
          }}
        />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6">

        {/* ============ CRUMB ============ */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div className="flex items-center gap-3">
            <Link href="/blog" className="hover:text-ed-blue">← Archive</Link>
            <span>·</span>
            <span>Filed under <b className="text-ink font-medium" style={{ color: toneColor }}>{post.sourceName}</b></span>
          </div>
          <div>{shortDate(post.pubDate)}</div>
        </div>

        {/* ============ ARTICLE LAYOUT ============ */}
        <article className="grid gap-y-10 lg:grid-cols-[190px_minmax(0,1fr)_240px] lg:gap-x-12 pt-16 pb-24">

          {/* Left rail: reactions + share (sticky) */}
          <aside className="hidden lg:flex flex-col gap-8 order-2 lg:order-1">
            <div className="sticky top-24 flex flex-col gap-8">
              <div>
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-soft mb-3">
                  React
                </div>
                <Reactions slug={`${post.source}/${post.slug}`} />
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-soft mb-3">
                  Share
                </div>
                <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.1em]">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-soft hover:text-ed-blue transition-colors"
                  >
                    ↗ Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-soft hover:text-ed-blue transition-colors"
                  >
                    ↗ LinkedIn
                  </a>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-soft hover:text-ed-red transition-colors"
                  >
                    ↗ Substack
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Article body */}
          <div className="order-1 lg:order-2">
            {/* Kicker */}
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft mb-6 flex flex-wrap gap-x-3 gap-y-1 items-center">
              <span style={{ color: toneColor }}>{toneLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{longDate(post.pubDate)}</span>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
              {views !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{views.toLocaleString()} readers</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1
              className="ed-headline m-0 mb-8"
              style={{ fontSize: "clamp(38px, 5.6vw, 76px)", lineHeight: 1.02 }}
            >
              {post.title}
            </h1>

            {/* Byline */}
            <div className="flex flex-wrap items-center gap-3 pb-8 mb-10 border-b border-rule-strong font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
              <span>By <b className="text-ink font-medium">{post.author}</b></span>
              <span aria-hidden="true">·</span>
              <a href={post.link} target="_blank" rel="noreferrer" className="text-ink-soft hover:text-ed-blue">
                Original on Substack ↗
              </a>
            </div>

            {/* Prose */}
            <div
              className="ed-prose"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Mobile reactions */}
            <div className="lg:hidden mt-14 text-center">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-soft mb-3">
                React
              </div>
              <Reactions slug={`${post.source}/${post.slug}`} />
            </div>

            {/* Newsletter CTA */}
            <div
              className="mt-16 border p-8 sm:p-10"
              style={{
                borderColor: "var(--rule-strong)",
                background: "color-mix(in oklab, var(--paper-2) 55%, transparent)",
              }}
            >
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft mb-3">
                Read this? Get the next one.
              </div>
              <h3
                className="font-editorial italic text-ink m-0 mb-5"
                style={{ fontSize: "clamp(24px, 3.6vw, 36px)", lineHeight: 1.05 }}
              >
                Subscribe to <em style={{ color: toneColor }}>{post.sourceName}</em>.
              </h3>
              <form
                action={`https://${post.source === "ocheverse" ? "ocheverse" : "bpur"}.substack.com/subscribe`}
                target="_blank"
                method="GET"
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent border border-rule-strong px-4 py-3 font-mono text-[13px] text-ink placeholder-ink-soft focus:outline-none focus:border-ink"
                  style={{ borderRadius: 0 }}
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-paper px-6 py-3 whitespace-nowrap transition-all hover:-translate-y-0.5"
                  style={{ background: toneColor, borderRadius: 0 }}
                >
                  Subscribe
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            </div>

            {/* Related posts / back pages */}
            {relatedPosts.length > 0 && (
              <section className="mt-24">
                <div className="flex items-baseline justify-between gap-4 mb-8 pb-3 border-b border-rule-strong">
                  <h3
                    className="font-editorial italic m-0"
                    style={{ fontSize: 26, color: toneColor }}
                  >
                    More from {post.sourceName}
                  </h3>
                  <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-soft">
                    Back pages
                  </span>
                </div>
                <ol className="list-none p-0 m-0 grid gap-0">
                  {relatedPosts.map((r, i) => (
                    <li key={r.slug}>
                      <Link
                        href={`/blog/${r.source}/${r.slug}`}
                        className="ed-post group grid grid-cols-[34px_1fr_auto] items-baseline gap-5 py-5 border-t border-rule text-ink first:border-t-0"
                      >
                        <span className="font-mono text-[11px] tracking-[0.1em] text-ink-soft pt-1.5">
                          {String(i + 1).padStart(2, "0")}/
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-soft">
                            <em className="not-italic font-semibold" style={{ color: toneColor }}>
                              {post.sourceName}
                            </em>{" "}
                            · {r.readingTime} min · {shortDate(r.pubDate)}
                          </span>
                          <span className="ed-title-link font-editorial italic text-[20px] leading-[1.2] text-ink max-w-[42ch] text-wrap-balance">
                            {r.title}
                          </span>
                        </div>
                        <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-ink-soft pt-2 whitespace-nowrap">
                          {r.readingTime}′
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Comments */}
            <section className="mt-24 pt-10 border-t border-rule-strong">
              <div className="flex items-baseline justify-between gap-4 mb-8">
                <h3
                  className="font-editorial italic m-0 text-ink"
                  style={{ fontSize: 28 }}
                >
                  In the margins
                </h3>
                <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-soft">
                  Reader notes
                </span>
              </div>
              <div id="remark42"></div>
              <Script
                id="remark42-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    var remark_config = {
                      host: '${process.env.NEXT_PUBLIC_REMARK42_HOST || ''}',
                      site_id: '${process.env.NEXT_PUBLIC_REMARK42_SITE_ID || 'ocheverse'}',
                      components: ['embed'],
                      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
                    };
                  `,
                }}
              />
              {process.env.NEXT_PUBLIC_REMARK42_HOST && (
                <Script
                  src={`${process.env.NEXT_PUBLIC_REMARK42_HOST}/web/embed.js`}
                  strategy="afterInteractive"
                />
              )}
              {!process.env.NEXT_PUBLIC_REMARK42_HOST && (
                <div className="text-center py-10 border border-dashed border-rule-strong">
                  <p className="font-editorial italic text-ink text-[18px] mb-2">Comments coming soon.</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                    Share your thoughts on the <a href={post.link} target="_blank" rel="noreferrer" className="text-ed-blue hover:text-ed-red">original post</a> for now.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right rail: TOC (sticky) */}
          {post.toc && post.toc.length > 0 && (
            <aside className="hidden lg:block order-3">
              <div className="sticky top-24">
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-soft mb-4 pb-2 border-b border-rule-strong">
                  On this page
                </div>
                <nav className="max-h-[calc(100vh-180px)] overflow-y-auto pr-2 ed-toc">
                  <ol className="list-none p-0 m-0 flex flex-col gap-2.5">
                    {post.toc.map((h, i) => (
                      <li key={i}>
                        <a
                          href={`#${h.id}`}
                          className={`block text-[13px] leading-snug text-ink-soft hover:text-ed-blue transition-colors ${
                            h.level === 3 ? "pl-4 text-[12px]" : "font-medium"
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </aside>
          )}
        </article>
      </div>

      {/* Article-scoped prose + drop cap + TOC scrollbar styling */}
      <style jsx global>{`
        .ed-prose {
          font-family: Georgia, "Iowan Old Style", "Hoefler Text", "Palatino Linotype", "Book Antiqua", serif;
          font-size: 19px;
          line-height: 1.7;
          color: var(--ink);
          max-width: 68ch;
        }
        .ed-prose > p:first-of-type::first-letter {
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 400;
          font-size: 5.2em;
          line-height: 0.85;
          float: left;
          padding: 6px 12px 0 0;
          color: var(--red);
        }
        .ed-prose p { margin: 0 0 1.4em; }
        .ed-prose h2 {
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 400;
          font-size: 34px;
          line-height: 1.15;
          margin: 2.4em 0 0.6em;
          color: var(--ink);
          scroll-margin-top: 100px;
        }
        .ed-prose h3 {
          font-family: Georgia, serif;
          font-style: italic;
          font-weight: 400;
          font-size: 24px;
          line-height: 1.25;
          margin: 2em 0 0.4em;
          color: var(--ink);
          scroll-margin-top: 100px;
        }
        .ed-prose a {
          color: var(--blue);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
          transition: color 200ms;
        }
        .ed-prose a:hover { color: var(--red); }
        .ed-prose strong { color: var(--ink); font-weight: 600; }
        .ed-prose em { font-style: italic; }
        .ed-prose blockquote {
          border-left: 2px solid var(--red);
          padding: 0.4em 0 0.4em 1.4em;
          margin: 1.6em 0;
          font-style: italic;
          color: var(--ink-soft);
        }
        .ed-prose code {
          font-family: ui-monospace, "JetBrains Mono", "SF Mono", monospace;
          font-size: 0.88em;
          background: color-mix(in oklab, var(--ink) 8%, transparent);
          padding: 2px 6px;
          border-radius: 3px;
        }
        .ed-prose pre {
          background: color-mix(in oklab, var(--ink) 92%, var(--paper));
          color: var(--paper);
          padding: 1.2em 1.4em;
          overflow-x: auto;
          margin: 1.6em 0;
          border-radius: 4px;
          font-size: 14px;
          line-height: 1.55;
        }
        .ed-prose pre code {
          background: transparent;
          padding: 0;
          color: inherit;
          font-size: inherit;
        }
        .ed-prose img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 2em auto;
          border-radius: 3px;
          box-shadow: 0 2px 16px color-mix(in oklab, var(--ink) 18%, transparent);
        }
        .ed-prose figure { margin: 2em 0; }
        .ed-prose figcaption {
          font-family: ui-monospace, "JetBrains Mono", "SF Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          color: var(--ink-soft);
          margin-top: 0.6em;
        }
        .ed-prose ul, .ed-prose ol {
          margin: 1.2em 0 1.6em;
          padding-left: 1.4em;
        }
        .ed-prose ul li { list-style-type: "◇  "; }
        .ed-prose li { margin: 0.4em 0; padding-left: 0.2em; }
        .ed-prose hr {
          border: 0;
          border-top: 1px solid var(--rule-strong);
          margin: 3em auto;
          width: 40%;
        }
        .ed-prose .button-wrapper a {
          display: inline-block;
          background: var(--blue);
          color: var(--paper);
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          text-decoration: none;
          font-family: ui-monospace, monospace;
          font-size: 11.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin: 1rem 0;
        }
        .ed-toc::-webkit-scrollbar { width: 4px; }
        .ed-toc::-webkit-scrollbar-track { background: transparent; }
        .ed-toc::-webkit-scrollbar-thumb {
          background-color: var(--rule-strong);
          border-radius: 2px;
        }
      `}</style>
    </>
  );
}
