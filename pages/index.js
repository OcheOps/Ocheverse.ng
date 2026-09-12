import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { createParser, parseFeedResilient } from "../lib/rssParser";
import * as cheerio from "cheerio";

// ------- data helpers -------
const stripToText = (html) =>
  cheerio.load(html || "").root().text().replace(/\s+/g, " ").trim();

const readingTime = (html) =>
  Math.max(1, Math.ceil(stripToText(html).split(/\s+/).length / 200));

const slugFromLink = (link) => {
  let s = (link || "").split("/").pop() || "";
  return s.includes("?") ? s.split("?")[0] : s;
};

const mapPost = (item, source) => {
  const html = item["content:encoded"] || item.content || "";
  const plain = stripToText(html);
  return {
    title: item.title || "",
    slug: slugFromLink(item.link),
    source,
    isoDate: item.isoDate || (item.pubDate ? new Date(item.pubDate).toISOString() : null),
    excerpt: plain.length > 155 ? plain.slice(0, 155) + "…" : plain,
    readingTime: readingTime(html),
  };
};

export async function getStaticProps() {
  const parser = createParser();
  let ocheversePosts = [];
  let bpurPosts = [];
  let ok = { ocheverse: false, bpur: false };

  try {
    const feed = await parseFeedResilient(parser, "ocheverse");
    ocheversePosts = feed.items.map((i) => mapPost(i, "ocheverse"));
    ok.ocheverse = ocheversePosts.length > 0;
  } catch (e) {
    console.warn("[home] Ocheverse feed unavailable:", e.message);
  }
  try {
    const feed = await parseFeedResilient(parser, "bpur");
    bpurPosts = feed.items.map((i) => mapPost(i, "bpur"));
    ok.bpur = bpurPosts.length > 0;
  } catch (e) {
    console.warn("[home] BPUR feed unavailable:", e.message);
  }

  // Featured post per publication — the hero can switch between them
  const featured = {
    ocheverse: ocheversePosts[0] || null,
    bpur: bpurPosts[0] || null,
  };

  // Latest strip skips the featured for each shelf
  const ocheverseLatest = ocheversePosts.slice(1, 4);
  const bpurLatest = bpurPosts.slice(1, 4);

  const marquee = [...ocheversePosts.slice(0, 3), ...bpurPosts.slice(0, 3)]
    .map((p) => p.title)
    .filter(Boolean);

  return {
    props: {
      featured,
      ocheverseLatest,
      bpurLatest,
      totals: { ocheverse: ocheversePosts.length, bpur: bpurPosts.length },
      marquee,
    },
    revalidate: ok.ocheverse && ok.bpur ? 3600 : 60,
  };
}

// ------- date helpers -------
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
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};
const issueNumber = (total) => String(40 + (total || 0)).padStart(3, "0");

// ------- word splitter for hero wiggle -------
const splitWords = (text) =>
  text.split(/(\s+)/).map((chunk, i) =>
    /^\s+$/.test(chunk) ? (
      <span key={i}> </span>
    ) : (
      <span key={i} className="word">
        {chunk}
      </span>
    )
  );

export default function Home({ featured, ocheverseLatest, bpurLatest, totals, marquee }) {
  // Which publication is the cover story right now?
  // Default to whichever has a fresher post.
  const initialTab = (() => {
    const o = featured?.ocheverse?.isoDate || "";
    const b = featured?.bpur?.isoDate || "";
    if (!featured?.ocheverse) return "bpur";
    if (!featured?.bpur) return "ocheverse";
    return b > o ? "bpur" : "ocheverse";
  })();

  const [activeTab, setActiveTab] = useState(initialTab);

  const totalPosts = (totals?.ocheverse || 0) + (totals?.bpur || 0);
  const issue = issueNumber(totalPosts);
  const today = new Date();

  const activePost = featured?.[activeTab] || featured?.ocheverse || featured?.bpur;
  const tabToneColor = activeTab === "ocheverse" ? "var(--blue)" : "var(--red)";
  const otherTab = activeTab === "ocheverse" ? "bpur" : "ocheverse";
  const otherPost = featured?.[otherTab];

  const featuredHref = activePost
    ? `/blog/${activePost.source}/${activePost.slug}`
    : "/blog";

  const marqueeItems =
    marquee && marquee.length
      ? marquee
      : [
          "observability is harder than they told you",
          "the system was up · the system was lying",
          "adventures in homelabbing · DNS · AdGuard",
          "notes on ambition, from Lagos",
        ];

  return (
    <>
      <Head>
        <title>Ocheverse — David Gideon</title>
        <meta
          name="description"
          content="Two publications, one author. Engineering war stories from Ocheverse and long-form essays on BPUR — by David Gideon, from Lagos."
        />
        <meta property="og:title" content="Ocheverse — David Gideon" />
        <meta
          property="og:description"
          content="Two publications, one author. Engineering war stories from Ocheverse and long-form essays on BPUR."
        />
        <meta property="og:url" content="https://ocheverse.ng" />
        <meta
          property="og:image"
          content="https://ocheverse.ng/api/og?title=Ocheverse&category=David%20Gideon"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "David Gideon",
              alternateName: "OcheOps",
              url: "https://ocheverse.ng",
              image: "https://ocheverse.ng/profile.jpg",
              jobTitle: "DevOps Engineer & Solutions Architect",
              description:
                "DevOps engineer & infrastructure storyteller. Two publications, one author.",
              sameAs: [
                "https://github.com/OcheOps",
                "https://www.linkedin.com/in/gideonodavid/",
                "https://ocheverse.substack.com",
                "https://bpur.substack.com",
              ],
            }),
          }}
        />
      </Head>

      <main className="min-h-screen">
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-4 sm:pt-6">

          {/* ============ SUB-STRIP (issue meta) ============ */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-2.5 sm:py-3 border-y border-rule font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.06em] text-ink-soft">
            <span>
              Issue №<b className="text-ink font-medium">{issue}</b>
            </span>
            <span aria-hidden="true">·</span>
            <span>Two publications · One author</span>
            <span className="ml-auto hidden sm:inline-flex items-center gap-2 text-ink">
              <span className="ed-live-dot" aria-hidden="true" />
              Weekly-ish
            </span>
          </div>

          {/* ============ HERO ============ */}
          <section
            className="relative pt-10 sm:pt-16 pb-14 sm:pb-24"
            aria-labelledby="featured-title"
          >
            {/* Tab picker — pick a cover story */}
            <TabPicker
              active={activeTab}
              onChange={setActiveTab}
              ocheversePost={featured?.ocheverse}
              bpurPost={featured?.bpur}
            />

            <div className="grid gap-y-6 sm:gap-y-8 lg:gap-y-7 gap-x-6 lg:gap-x-10 lg:grid-cols-[1fr_5fr_1fr] lg:[grid-template-areas:'kicker_headline_aside''kicker_headline_aside''meta_headline_cta']">
              {/* floating issue number — only on very large screens where it can breathe */}
              <div
                aria-hidden="true"
                className="hidden xl:block absolute top-24 -right-4 font-editorial italic pointer-events-none select-none z-0"
                style={{
                  fontSize: "clamp(80px, 10vw, 170px)",
                  lineHeight: 0.85,
                  letterSpacing: "-0.05em",
                  color: "transparent",
                  WebkitTextStroke: "1.2px var(--rule-strong)",
                }}
              >
                {issue[0]}
                <span style={{ color: "var(--red)", WebkitTextStroke: 0 }}>{issue[1]}</span>
                {issue[2]}
              </div>

              {/* kicker */}
              <div className="lg:[grid-area:kicker] font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] text-ink-soft leading-normal relative z-[1]">
                <div className="w-11 h-0.5 bg-ink mb-3 sm:mb-4" />
                <b
                  className="block font-semibold mb-1.5 tracking-[0.18em]"
                  style={{ color: tabToneColor }}
                >
                  Featured essay
                </b>
                From the desk<br />
                {activeTab === "bpur" ? "BPUR" : "Ocheverse"}
                {activePost?.isoDate ? (
                  <>
                    ,<br />
                    Filed {longDate(activePost.isoDate)}
                  </>
                ) : null}
              </div>

              {/* headline */}
              <h1
                id="featured-title"
                className="ed-headline ed-hero-headline lg:[grid-area:headline] m-0 cursor-default relative z-[1]"
                style={{
                  fontSize: "clamp(38px, 8.4vw, 128px)",
                  lineHeight: 0.98,
                }}
                key={activeTab}
              >
                <span
                  className="font-editorial not-italic"
                  style={{ color: tabToneColor }}
                >
                  “
                </span>
                {activePost
                  ? splitWords(activePost.title)
                  : splitWords("A field guide to shipping software that lives out here.")}
                <span
                  className="font-editorial not-italic"
                  style={{ color: tabToneColor }}
                >
                  ”
                </span>
              </h1>

              {/* meta */}
              <div className="lg:[grid-area:meta] lg:self-end font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.1em] text-ink-soft space-y-1 relative z-[1]">
                <div>
                  <b className="text-ink font-medium">David Gideon</b>
                </div>
                <div>
                  {activeTab === "bpur" ? "BPUR" : "Ocheverse"}
                  {activePost?.readingTime ? ` · ${activePost.readingTime} min read` : ""}
                </div>
                {activePost?.isoDate && (
                  <div>
                    Published{" "}
                    <b className="text-ink font-medium">{shortDate(activePost.isoDate)}</b>
                  </div>
                )}
              </div>

              {/* aside */}
              <aside className="lg:[grid-area:aside] flex flex-col gap-3 sm:gap-4 pt-3 relative z-[1]">
                {/* Cross-feature card — link to the OTHER publication's latest */}
                {otherPost && (
                  <Link
                    href={`/blog/${otherPost.source}/${otherPost.slug}`}
                    className="group border border-rule-strong p-4 font-mono text-[11.5px] leading-relaxed hover:-translate-y-0.5 transition-transform"
                    style={{ background: "color-mix(in oklab, var(--paper-2) 60%, transparent)" }}
                  >
                    <div
                      className="flex items-center gap-2 font-semibold uppercase tracking-[0.12em] mb-2 pb-1.5 border-b border-dashed border-rule-strong"
                      style={{ color: otherTab === "bpur" ? "var(--red)" : "var(--blue)" }}
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: otherTab === "bpur" ? "var(--red)" : "var(--blue)" }}
                        aria-hidden="true"
                      />
                      Also in {otherTab === "bpur" ? "BPUR" : "Ocheverse"}
                    </div>
                    <div className="ed-title-link font-editorial italic not-italic text-ink text-[14.5px] leading-snug normal-case tracking-normal">
                      <em className="italic">{otherPost.title}</em>
                    </div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                      Read →
                    </div>
                  </Link>
                )}
                {/* Shipping status card */}
                <div
                  className="border border-rule-strong p-4 font-mono text-[11.5px] leading-relaxed"
                  style={{ background: "color-mix(in oklab, var(--paper-2) 60%, transparent)" }}
                >
                  <div className="flex items-center gap-2 text-ink font-semibold uppercase tracking-[0.12em] mb-2 pb-1.5 border-b border-dashed border-rule-strong">
                    <span className="ed-live-dot" aria-hidden="true" />
                    Shipping
                  </div>
                  <div className="text-ink-soft normal-case tracking-normal">
                    <strong className="text-ink font-semibold">Homepage v2</strong> live · self-hosted runner over Tailscale
                  </div>
                </div>
              </aside>

              {/* CTA — full width on mobile, right-justified on desktop */}
              <Link
                href={featuredHref}
                className="lg:[grid-area:cta] lg:justify-self-end inline-flex items-center justify-center gap-2.5 font-mono text-[12px] sm:text-[11.5px] uppercase tracking-[0.14em] text-paper px-6 py-4 sm:py-3.5 rounded-full hover:-translate-y-0.5 transition-all w-full lg:w-fit relative z-[1]"
                style={{ background: tabToneColor }}
              >
                Read the essay
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>

          {/* ============ MARQUEE BAND ============ */}
          <div className="border-t border-rule-strong border-b border-rule py-3 flex items-center font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.12em] text-ink-soft overflow-hidden">
            <span className="hidden sm:inline-block font-editorial italic text-[14px] normal-case tracking-normal text-ink pr-5 mr-5 border-r border-rule-strong whitespace-nowrap">
              In this issue —
            </span>
            <div
              className="flex-1 overflow-hidden flex gap-10"
              style={{
                maskImage:
                  "linear-gradient(90deg, transparent, black 40px, black calc(100% - 40px), transparent)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent, black 40px, black calc(100% - 40px), transparent)",
              }}
            >
              <div className="ed-marquee-track flex gap-10 whitespace-nowrap">
                {[...marqueeItems, ...marqueeItems].map((title, i) => (
                  <span key={i}>
                    <span className="text-ed-red">◇ </span>
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ============ SHELVES ============ */}
          <section className="relative pt-14 sm:pt-24 pb-10 grid gap-y-14 sm:gap-y-16 lg:gap-x-20 lg:grid-cols-2">
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-24 bottom-0 left-1/2 w-px bg-rule"
            />
            <Shelf
              tone="ocheverse"
              name="Ocheverse"
              tag="Engineering · Weekly"
              blurb="Main Branch Mayhem — war stories from distributed systems, DevOps, and the servers I broke on the way here."
              posts={ocheverseLatest}
              total={totals?.ocheverse}
              archiveHref="/blog#ocheverse"
            />
            <Shelf
              tone="bpur"
              name="BPUR"
              tag="Essays · When it hits"
              blurb="Big picture, unfiltered, real. Long-form on ambition, slowness, and the meta-work behind the work."
              posts={bpurLatest}
              total={totals?.bpur}
              archiveHref="/blog#bpur"
            />
          </section>

          {/* ============ PRESS STRIP ============ */}
          <section
            className="mt-12 sm:mt-20 pt-8 sm:pt-10 pb-11 grid gap-6 md:grid-cols-[200px_1fr] md:gap-10"
            style={{
              borderTop: "3px double var(--rule-strong)",
              borderBottom: "3px double var(--rule-strong)",
            }}
          >
            <div className="font-editorial italic text-[24px] sm:text-[26px] leading-none text-ink">
              As we go
              <br />
              <em>to press —</em>
              <small className="block mt-2 font-mono not-italic text-[10.5px] tracking-[0.14em] uppercase text-ink-soft">
                Live from the homelab
              </small>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-7">
              <PressItem eb="Shipping" tone="deploy">
                <em className="not-italic">Ocheverse</em> · self-hosted runner in place
              </PressItem>
              <PressItem eb="Reading" tone="read">
                <em className="not-italic">Working in Public</em> · Nadia Eghbal
              </PressItem>
              <PressItem eb="Listening" tone="listen">
                Sons of Kemet — <em>My Queen Is Ada Eastman</em>
              </PressItem>
              <PressItem eb="Broken" tone="broken">
                Homelab uplink · <em>40 KB/s and mad about it</em>
              </PressItem>
              <PressItem eb="Learning" tone="read">
                Tailscale ACLs · rewriting from scratch
              </PressItem>
              <PressItem eb="Playing" tone="listen">
                <em>Balatro</em> · still trying for the Blue Deck run
              </PressItem>
              <PressItem eb="Open PR" tone="deploy">
                <em>ocheverse.ng</em> · Tailscale registry
              </PressItem>
              <PressItem eb="Thinking" tone="read">
                Why my CV needs a &ldquo;systems I&rsquo;ve broken&rdquo; section.
              </PressItem>
            </div>
          </section>

          {/* ============ TOYBOX ============ */}
          <section className="pt-14 sm:pt-20 pb-6 grid gap-6 md:gap-10 md:grid-cols-[1fr_auto] items-end border-b border-rule">
            <div>
              <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-soft mb-2">
                Also in the back pages
              </div>
              <p
                className="font-editorial italic leading-[0.95] tracking-tight text-ink max-w-[20ch] text-wrap-balance m-0"
                style={{ fontSize: "clamp(26px, 5.5vw, 58px)" }}
              >
                A <em className="not-italic italic" style={{ color: "var(--blue)" }}>snake</em>, a{" "}
                <em className="not-italic italic" style={{ color: "var(--green)" }}>2048</em>, and one{" "}
                <em className="not-italic italic" style={{ color: "var(--red)" }}>guestbook</em>{" "}
                nobody signs.
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <ToyLink href="/game" tone="blue" label="Snake">🐍</ToyLink>
              <ToyLink href="/2048" tone="green" label="2048">2⁵</ToyLink>
              <ToyLink href="/guestbook" tone="red" label="Guestbook">✍︎</ToyLink>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

// ---------------- TabPicker ----------------
function TabPicker({ active, onChange, ocheversePost, bpurPost }) {
  const options = [
    { id: "ocheverse", label: "Ocheverse", tone: "var(--blue)", disabled: !ocheversePost },
    { id: "bpur", label: "BPUR", tone: "var(--red)", disabled: !bpurPost },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8 font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] text-ink-soft">
      <span className="text-ink-soft">Cover story —</span>
      <div className="flex gap-2" role="tablist" aria-label="Featured publication">
        {options.map((o) => {
          const isActive = active === o.id;
          return (
            <button
              key={o.id}
              onClick={() => !o.disabled && onChange(o.id)}
              disabled={o.disabled}
              role="tab"
              aria-selected={isActive}
              className={`px-3 sm:px-3.5 py-1.5 rounded-full border transition-colors ${
                isActive
                  ? "text-paper"
                  : o.disabled
                  ? "text-ink-soft opacity-40 cursor-not-allowed"
                  : "text-ink-soft hover:text-ink border-rule hover:border-rule-strong"
              }`}
              style={
                isActive
                  ? { background: o.tone, borderColor: o.tone }
                  : {}
              }
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Shelf ----------------
function Shelf({ tone, name, tag, blurb, posts, total, archiveHref }) {
  const nameColor = tone === "ocheverse" ? "var(--blue)" : "var(--red)";
  const hoverBorder = tone === "ocheverse" ? "hover:border-ed-blue" : "hover:border-ed-red";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-rule-strong">
        <h2
          className="font-editorial italic font-normal m-0 leading-none tracking-tight"
          style={{ fontSize: "clamp(30px, 5vw, 42px)", color: nameColor }}
        >
          {name}
        </h2>
        <span className="font-mono text-[10px] sm:text-[10.5px] tracking-[0.16em] uppercase text-ink-soft">
          {tag}
        </span>
      </div>
      <p className="font-editorial italic text-ink-soft text-[14.5px] -mt-4 sm:-mt-5 mb-6 sm:mb-8 pl-0.5">
        {blurb}
      </p>
      <ol className="list-none p-0 m-0 flex flex-col">
        {posts.length === 0 && (
          <li className="font-mono text-[11px] text-ink-soft py-6 border-t border-rule">
            Nothing loaded — check back in a minute.
          </li>
        )}
        {posts.map((p, i) => (
          <li key={p.slug || i}>
            <Link
              href={`/blog/${p.source}/${p.slug}`}
              className={`ed-post group grid grid-cols-[28px_1fr_auto] sm:grid-cols-[34px_1fr_auto] items-baseline gap-3 sm:gap-5 py-4 sm:py-5 border-t border-rule text-ink first:border-t-0`}
            >
              <span className="font-mono text-[11px] tracking-[0.1em] text-ink-soft pt-1.5">
                {String(i + 1).padStart(2, "0")}/
              </span>
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] sm:text-[10.5px] tracking-[0.14em] uppercase text-ink-soft">
                  <em className="not-italic font-semibold" style={{ color: nameColor }}>
                    {tone === "ocheverse" ? "Ocheverse" : "Essay"}
                  </em>{" "}
                  · {p.readingTime} min · {shortDate(p.isoDate)}
                </span>
                <span
                  className="ed-title-link font-editorial italic text-[17px] sm:text-[20px] leading-[1.2] text-ink max-w-[34ch]"
                  style={{ color: "var(--ink)" }}
                >
                  {p.title}
                </span>
              </div>
              <span className="font-mono text-[10px] sm:text-[10.5px] tracking-[0.1em] uppercase text-ink-soft pt-2 whitespace-nowrap">
                {p.readingTime}′
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="flex justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-rule-strong font-mono text-[10.5px] sm:text-[11px] tracking-[0.12em] uppercase text-ink-soft">
        <span>{total || posts.length} posts in the archive</span>
        <Link
          href={archiveHref}
          className={`text-ink pb-0.5 border-b-[1.5px] border-transparent transition-colors ${hoverBorder}`}
        >
          All {name} →
        </Link>
      </div>
    </div>
  );
}

// ---------------- PressItem ----------------
function PressItem({ eb, tone, children }) {
  const dotStyle = (() => {
    switch (tone) {
      case "deploy":
        return {
          background: "var(--green-live)",
          boxShadow: "0 0 0 3px color-mix(in oklab, var(--green-live) 25%, transparent)",
          animation: "ed-pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        };
      case "read":
        return { background: "var(--blue)" };
      case "listen":
        return { background: "var(--red)" };
      case "broken":
        return {
          background: "var(--red)",
          boxShadow: "0 0 0 3px color-mix(in oklab, var(--red) 25%, transparent)",
        };
      default:
        return { background: "var(--dust)" };
    }
  })();
  return (
    <div className="flex flex-col gap-1.5 font-editorial text-[14.5px] leading-[1.4] text-ink">
      <span className="font-mono not-italic text-[10px] tracking-[0.16em] uppercase text-ink-soft flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full" style={dotStyle} aria-hidden="true" />
        {eb}
      </span>
      <span>{children}</span>
    </div>
  );
}

// ---------------- ToyLink ----------------
function ToyLink({ href, tone, children, label }) {
  const color =
    tone === "blue" ? "var(--blue)" : tone === "green" ? "var(--green)" : "var(--red)";
  return (
    <Link
      href={href}
      aria-label={label}
      className="grid place-items-center w-[64px] h-[64px] sm:w-[74px] sm:h-[74px] border-[1.5px] border-rule-strong bg-paper font-editorial italic text-[26px] sm:text-[30px] hover:-translate-y-1 hover:-rotate-3 transition-transform"
      style={{
        color,
        boxShadow: "4px 4px 0 var(--rule-strong)",
      }}
    >
      {children}
    </Link>
  );
}
