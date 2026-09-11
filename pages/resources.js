import Head from "next/head";
import { useState, useMemo } from "react";
import { resources as initialResources } from "../data/siteData";

export default function Resources() {
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");

  const categories = ["All", ...new Set(initialResources.map((r) => r.category))];

  const filtered = useMemo(() => {
    let out = activeTab === "All" ? initialResources : initialResources.filter((r) => r.category === activeTab);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.desc || "").toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }
    return out;
  }, [activeTab, query]);

  return (
    <>
      <Head>
        <title>The Vault — Ocheverse</title>
        <meta
          name="description"
          content="A curated vault of DevOps study guides, cheatsheets, and roadmaps."
        />
        <meta property="og:title" content="The Vault — Ocheverse" />
        <meta
          property="og:description"
          content="A curated vault of DevOps study guides, cheatsheets, and roadmaps."
        />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">

        {/* Masthead row */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div>
            The Vault · <b className="text-ink font-medium">{initialResources.length}</b> entries filed
          </div>
          <div>Study material for engineers</div>
        </div>

        {/* Hero */}
        <section className="pt-16 pb-14 grid gap-y-8 lg:grid-cols-[5fr_2fr] gap-x-10 items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
              <span className="w-11 h-0.5 bg-ink inline-block" />
              Filed under — Resources
            </div>
            <h1
              className="ed-headline m-0"
              style={{ fontSize: "clamp(46px, 8.6vw, 120px)", lineHeight: 0.96 }}
            >
              The <em style={{ color: "var(--blue)" }}>vault</em>.<br />
              Study material for{" "}
              <em style={{ color: "var(--green)" }}>engineers</em>.
            </h1>
          </div>
          <p className="font-editorial italic text-ink-soft text-[16px] leading-relaxed max-w-[36ch]">
            A curated shelf of study guides, cheat sheets, roadmaps, and receipts — the ones I keep coming back to.
          </p>
        </section>

        {/* Filter strip */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 py-4 border-y border-rule-strong font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
          <div className="flex flex-wrap items-center gap-2">
            <span>Section —</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-2.5 py-1 rounded-full border transition-colors ${
                  activeTab === cat
                    ? "border-ink text-ink"
                    : "border-rule text-ink-soft hover:text-ink hover:border-rule-strong"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 min-w-[220px] flex items-center gap-2 border-b border-rule pb-1">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Find in the vault…"
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

        {/* Entries */}
        {filtered.length === 0 ? (
          <div className="pt-20 text-center">
            <p className="font-editorial italic text-ink text-[22px] mb-2">Nothing filed here yet.</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
              Try a different section or a broader search.
            </p>
          </div>
        ) : (
          <ol className="list-none p-0 m-0 pt-4">
            {filtered.map((r, i) => (
              <li key={r.id}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ed-post group grid grid-cols-[40px_1fr_auto] items-baseline gap-6 py-6 border-t border-rule text-ink first:border-t-0"
                >
                  <span className="font-mono text-[11px] tracking-[0.1em] text-ink-soft pt-1.5">
                    {String(i + 1).padStart(2, "0")}/
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-soft">
                      <em className="not-italic font-semibold text-ed-blue">{r.category}</em>
                    </span>
                    <span className="ed-title-link font-editorial italic text-[22px] leading-[1.2] text-ink max-w-[44ch] text-wrap-balance">
                      {r.title}
                    </span>
                    {r.desc && (
                      <span className="text-[13.5px] text-ink-soft font-editorial leading-snug max-w-[58ch]">
                        {r.desc}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink-soft pt-2 whitespace-nowrap">
                    ↗ Open
                  </span>
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
