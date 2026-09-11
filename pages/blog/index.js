import Head from "next/head";
import Link from "next/link";
import { useState, useMemo } from "react";
import { createParser, parseFeedResilient } from "../../lib/rssParser";
import * as cheerio from "cheerio";

// -------- data helpers --------
const stripToText = (html) =>
  cheerio.load(html || "").root().text().replace(/\s+/g, " ").trim();

const slugFromLink = (link) => {
  let s = (link || "").split("/").pop() || "";
  return s.includes("?") ? s.split("?")[0] : s;
};

const mapFeedItem = (item, source) => {
  const html = item["content:encoded"] || item.content || "";
  const plain = stripToText(html);
  return {
    title: item.title || "",
    slug: slugFromLink(item.link),
    source,
    isoDate: item.isoDate || (item.pubDate ? new Date(item.pubDate).toISOString() : null),
    excerpt: plain.length > 155 ? plain.slice(0, 155) + "…" : plain,
    readingTime: Math.max(1, Math.ceil(plain.split(/\s+/).length / 200)),
  };
};

export async function getStaticProps() {
  const parser = createParser();
  let ocheverseItems = [];
  let bpurItems = [];
  let ocheverseOk = false;
  let bpurOk = false;

  try {
    const f = await parseFeedResilient(parser, "ocheverse");
    ocheverseItems = f.items.map((i) => mapFeedItem(i, "ocheverse"));
    ocheverseOk = ocheverseItems.length > 0;
  } catch (e) {
    console.warn("[RSS] Ocheverse feed unavailable:", e.message);
  }
  try {
    const f = await parseFeedResilient(parser, "bpur");
    bpurItems = f.items.map((i) => mapFeedItem(i, "bpur"));
    bpurOk = bpurItems.length > 0;
  } catch (e) {
    console.warn("[RSS] BPUR feed unavailable:", e.message);
  }

  return {
    props: { ocheversePosts: ocheverseItems, bpurPosts: bpurItems },
    revalidate: ocheverseOk && bpurOk ? 3600 : 60,
  };
}

// -------- date helpers --------
const shortDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(-2);
  return `${dd}·${mm}·${yy}`;
};

// -------- page --------
const INITIAL = 8;

export default function Blog({ ocheversePosts, bpurPosts }) {
  const [filter, setFilter] = useState("all"); // all | ocheverse | bpur
  const [sort, setSort] = useState("newest"); // newest | oldest | longest
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState({ ocheverse: false, bpur: false });

  const applyFilters = (arr) => {
    let out = [...arr];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter(
        (p) => p.title.toLowerCase().includes(q) || (p.excerpt || "").toLowerCase().includes(q)
      );
    }
    if (sort === "oldest") out.sort((a, b) => (a.isoDate || "").localeCompare(b.isoDate || ""));
    else if (sort === "longest") out.sort((a, b) => (b.readingTime || 0) - (a.readingTime || 0));
    else out.sort((a, b) => (b.isoDate || "").localeCompare(a.isoDate || ""));
    return out;
  };

  const filteredOche = useMemo(() => applyFilters(ocheversePosts), [ocheversePosts, filter, sort, query]);
  const filteredBpur = useMemo(() => applyFilters(bpurPosts), [bpurPosts, filter, sort, query]);

  const showOche = filter === "all" || filter === "ocheverse";
  const showBpur = filter === "all" || filter === "bpur";

  const visibleOche = expanded.ocheverse ? filteredOche : filteredOche.slice(0, INITIAL);
  const visibleBpur = expanded.bpur ? filteredBpur : filteredBpur.slice(0, INITIAL);

  return (
    <>
      <Head>
        <title>Archive — Ocheverse</title>
        <meta
          name="description"
          content="The full archive: engineering war stories from Ocheverse and long-form essays from BPUR."
        />
        <meta property="og:title" content="Archive — Ocheverse" />
        <meta property="og:description" content="Engineering stories, essays, and everything in between." />
        <meta property="og:url" content="https://ocheverse.ng/blog" />
        <meta
          property="og:image"
          content="https://ocheverse.ng/api/og?title=The%20Archive&category=Ocheverse"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" type="application/rss+xml" title="Ocheverse Blog RSS" href="/api/feed" />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">

        {/* ============ MASTHEAD ROW ============ */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div>
            The Archive · <b className="text-ink font-medium">{ocheversePosts.length + bpurPosts.length}</b> posts across two publications
          </div>
          <a
            href="/api/feed"
            className="text-ed-red hover:text-ed-blue transition-colors inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">◇</span> Subscribe via RSS
          </a>
        </div>

        {/* ============ HERO ============ */}
        <section className="pt-16 pb-14 grid gap-y-6 lg:grid-cols-[5fr_1fr] gap-x-10">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
              <span className="w-11 h-0.5 bg-ink inline-block" />
              Every post, filed under paper
            </div>
            <h1
              className="ed-headline m-0"
              style={{ fontSize: "clamp(50px, 8.5vw, 120px)", lineHeight: 0.95 }}
            >
              The <em style={{ color: "var(--blue)" }}>Ocheverse</em> Archives —
              <br />
              <span style={{ color: "var(--ink-soft)" }}>engineering</span>,{" "}
              <em style={{ color: "var(--red)" }}>essays</em>, and everything in between.
            </h1>
          </div>
          <aside className="flex flex-col justify-end gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
            <div>
              <b className="text-ed-blue">Ocheverse</b> · {ocheversePosts.length} posts
            </div>
            <div>
              <b className="text-ed-red">BPUR</b> · {bpurPosts.length} posts
            </div>
            <div className="mt-2 pt-2 border-t border-rule text-ink">
              Filed weekly-ish
            </div>
          </aside>
        </section>

        {/* ============ FILTER STRIP ============ */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 py-4 border-y border-rule-strong font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
          {/* Publication filter */}
          <div className="flex items-center gap-2">
            <span>Filed under —</span>
            {[
              { id: "all", label: "Both" },
              { id: "ocheverse", label: "Ocheverse" },
              { id: "bpur", label: "BPUR" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-2.5 py-1 rounded-full border transition-colors ${
                  filter === f.id
                    ? "border-ink text-ink"
                    : "border-rule text-ink-soft hover:text-ink hover:border-rule-strong"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span>Sort —</span>
            {[
              { id: "newest", label: "Newest" },
              { id: "oldest", label: "Oldest" },
              { id: "longest", label: "Longest" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`px-2.5 py-1 rounded-full border transition-colors ${
                  sort === s.id
                    ? "border-ink text-ink"
                    : "border-rule text-ink-soft hover:text-ink hover:border-rule-strong"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[220px] flex items-center gap-2 border-b border-rule pb-1">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Find a post…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none font-mono text-[12px] tracking-[0.06em] uppercase text-ink placeholder-ink-soft"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-ink-soft hover:text-ed-red"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ============ SHELVES ============ */}
        <div className="relative pt-16 grid gap-y-24 lg:gap-x-20 lg:grid-cols-2">
          {filter === "all" && (
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-16 bottom-0 left-1/2 w-px bg-rule"
            />
          )}

          {showOche && (
            <ArchiveShelf
              tone="ocheverse"
              name="Ocheverse"
              tag="Engineering · Weekly"
              blurb="Main Branch Mayhem — war stories from distributed systems, DevOps, and the servers I broke on the way here."
              posts={visibleOche}
              total={filteredOche.length}
              rawTotal={ocheversePosts.length}
              onExpand={() => setExpanded((s) => ({ ...s, ocheverse: !s.ocheverse }))}
              expanded={expanded.ocheverse}
              substackHref="https://ocheverse.substack.com"
            />
          )}

          {showBpur && (
            <ArchiveShelf
              tone="bpur"
              name="BPUR"
              tag="Essays · When it hits"
              blurb="Big picture, unfiltered, real. Long-form on ambition, slowness, and the meta-work behind the work."
              posts={visibleBpur}
              total={filteredBpur.length}
              rawTotal={bpurPosts.length}
              onExpand={() => setExpanded((s) => ({ ...s, bpur: !s.bpur }))}
              expanded={expanded.bpur}
              substackHref="https://bpur.substack.com"
            />
          )}
        </div>

        {/* ============ SUBSCRIBE CTA ============ */}
        <section
          className="mt-24 grid gap-6 md:grid-cols-[1fr_auto] items-end pt-10 pb-4"
          style={{ borderTop: "3px double var(--rule-strong)", borderBottom: "3px double var(--rule-strong)" }}
        >
          <div>
            <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-soft mb-3">
              Don't miss the next filing
            </div>
            <h2
              className="ed-headline m-0"
              style={{ fontSize: "clamp(28px, 4.4vw, 52px)", lineHeight: 0.98 }}
            >
              Get new posts in your inbox<br />
              — <em style={{ color: "var(--blue)" }}>weekly-ish</em>, always <em style={{ color: "var(--green)" }}>free</em>.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://ocheverse.substack.com/subscribe"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-paper bg-ed-blue px-6 py-3.5 rounded-full hover:-translate-y-0.5 hover:bg-ed-blue-ink transition-all"
            >
              Subscribe to Ocheverse
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="https://bpur.substack.com/subscribe"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink border border-ed-red px-6 py-3.5 rounded-full hover:bg-ed-red hover:text-paper transition-all"
            >
              Subscribe to BPUR
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

// ---------------- ArchiveShelf ----------------
function ArchiveShelf({ tone, name, tag, blurb, posts, total, rawTotal, onExpand, expanded, substackHref }) {
  const toneColor = tone === "ocheverse" ? "var(--blue)" : "var(--red)";
  const label = tone === "ocheverse" ? "Ocheverse" : "Essay";
  const hoverBorder = tone === "ocheverse" ? "hover:border-ed-blue" : "hover:border-ed-red";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-8 pb-4 border-b border-rule-strong">
        <h2
          className="font-editorial italic font-normal m-0 leading-none tracking-tight"
          style={{ fontSize: 44, color: toneColor }}
        >
          {name}
        </h2>
        <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft">
          {tag}
        </span>
      </div>
      <p className="font-editorial italic text-ink-soft text-[14.5px] -mt-5 mb-8 pl-0.5">{blurb}</p>

      <ol className="list-none p-0 m-0 flex flex-col">
        {posts.length === 0 && (
          <li className="font-mono text-[11px] text-ink-soft py-6 border-t border-rule">
            No posts match the filter.
          </li>
        )}
        {posts.map((p, i) => (
          <li key={p.slug || i}>
            <Link
              href={`/blog/${p.source}/${p.slug}`}
              className="ed-post group grid grid-cols-[34px_1fr_auto] items-baseline gap-5 py-5 border-t border-rule text-ink first:border-t-0"
            >
              <span className="font-mono text-[11px] tracking-[0.1em] text-ink-soft pt-1.5">
                {String(i + 1).padStart(2, "0")}/
              </span>
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-soft">
                  <em className="not-italic font-semibold" style={{ color: toneColor }}>
                    {label}
                  </em>{" "}
                  · {p.readingTime} min · {shortDate(p.isoDate)}
                </span>
                <span
                  className="ed-title-link font-editorial italic text-[20px] leading-[1.2] text-ink max-w-[42ch] text-wrap-balance"
                >
                  {p.title}
                </span>
                {p.excerpt && (
                  <span className="text-[13.5px] text-ink-soft font-editorial max-w-[52ch] leading-snug">
                    {p.excerpt}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-ink-soft pt-2 whitespace-nowrap">
                {p.readingTime}′
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap justify-between items-center gap-3 mt-8 pt-5 border-t border-rule-strong font-mono text-[11px] tracking-[0.12em] uppercase text-ink-soft">
        <span>
          Showing <b className="text-ink font-medium">{posts.length}</b> of {total}
          {total !== rawTotal && ` (filtered from ${rawTotal})`}
        </span>
        <div className="flex items-center gap-4">
          {total > posts.length || expanded ? (
            <button
              onClick={onExpand}
              className={`text-ink pb-0.5 border-b-[1.5px] border-transparent transition-colors ${hoverBorder}`}
            >
              {expanded ? "← Show fewer" : `Show all ${total} →`}
            </button>
          ) : null}
          <a
            href={substackHref}
            target="_blank"
            rel="noreferrer"
            className={`text-ink-soft pb-0.5 border-b-[1.5px] border-transparent transition-colors ${hoverBorder}`}
          >
            On Substack ↗
          </a>
        </div>
      </div>
    </div>
  );
}
