import Head from "next/head";
import dynamic from "next/dynamic";
import NowPlaying from "../components/NowPlaying";
import GitHubActivity from "../components/GitHubActivity";

const VisitorGlobe = dynamic(() => import("../components/VisitorGlobe"), { ssr: false });

const GIST_ID = "b5f56f22ac86666cba5f33034ca087b8";
const GIST_URL = `https://gist.githubusercontent.com/OcheOps/${GIST_ID}/raw/now.json`;

const FALLBACK = {
  lastUpdated: "May 2026",
  location: "Nigeria",
  sections: [
    {
      title: "Building",
      icon: "🔧",
      items: [
        "Scaling Ocheverse.ng — my personal engineering hub",
        "Self-hosted infrastructure: monitoring, VPN tunnels, and secret management with HashiCorp Vault",
        "Open source CLI tools in Go",
      ],
    },
    {
      title: "Learning",
      icon: "📚",
      items: [
        "Deep-diving into distributed systems internals",
        "Kubernetes operators and custom controllers",
        "Writing more consistently on Substack",
      ],
    },
    {
      title: "Reading",
      icon: "📖",
      items: [
        "Designing Data-Intensive Applications — Martin Kleppmann",
        "The Staff Engineer's Path — Tanya Reilly",
      ],
    },
    {
      title: "Listening",
      icon: "🎧",
      items: [
        "Ship It! (Changelog podcast)",
        "Afrobeats & lo-fi while deploying",
      ],
    },
    {
      title: "Life",
      icon: "⚡",
      items: [
        "Liverpool FC — through thick and thin",
        "Finding stillness in the terminal",
        "Trying to touch grass occasionally",
      ],
    },
  ],
};

// Section → dot color in the editorial system
const TONE_FOR_SECTION = {
  Building: "green",
  Shipping: "green",
  Learning: "blue",
  Reading: "blue",
  Listening: "red",
  Life: "red",
  Playing: "red",
};

export async function getStaticProps() {
  let data = FALLBACK;
  try {
    const res = await fetch(`${GIST_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) {
      const parsed = await res.json();
      if (parsed && Array.isArray(parsed.sections)) data = parsed;
    }
  } catch (e) {
    console.warn("[/now] Gist fetch failed, using fallback:", e.message);
  }
  return { props: { data }, revalidate: 600 };
}

const toneColor = (name) => {
  const t = TONE_FOR_SECTION[name] || "blue";
  return t === "green" ? "var(--green)" : t === "red" ? "var(--red)" : "var(--blue)";
};

export default function Now({ data }) {
  return (
    <>
      <Head>
        <title>Now — Ocheverse</title>
        <meta name="description" content="What David Gideon is focused on right now — building, learning, reading, listening." />
        <meta property="og:title" content="Now — Ocheverse" />
        <meta property="og:description" content="A living log of what I'm focused on right now." />
        <meta property="og:url" content="https://ocheverse.ng/now" />
        <meta property="og:image" content="https://ocheverse.ng/api/og?title=What%20I%27m%20focused%20on%20right%20now&category=Now" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">

        {/* Masthead row */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div>
            The Log · Live from <b className="text-ink font-medium">{data.location || "Lagos"}</b>
          </div>
          <div className="inline-flex items-center gap-2 text-ink">
            <span className="ed-live-dot" aria-hidden="true" />
            Last filed <b className="font-medium">{data.lastUpdated}</b>
          </div>
        </div>

        {/* Hero */}
        <section className="pt-16 pb-14 grid gap-y-8 lg:grid-cols-[5fr_2fr] gap-x-10 items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
              <span className="w-11 h-0.5 bg-ink inline-block" />
              <em className="not-italic text-ed-green font-semibold tracking-[0.18em]">Live document</em>
            </div>
            <h1
              className="ed-headline m-0"
              style={{ fontSize: "clamp(46px, 8vw, 116px)", lineHeight: 0.98 }}
            >
              What I&rsquo;m{" "}
              <em style={{ color: "var(--green)" }}>focused</em> on{" "}
              <em style={{ color: "var(--blue)" }}>right</em> now.
            </h1>
          </div>
          <div className="font-editorial italic text-ink-soft text-[15.5px] leading-relaxed max-w-[36ch]">
            A living page in the tradition of{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noreferrer"
              className="text-ed-blue border-b border-rule hover:border-ed-blue"
            >
              nownownow.com
            </a>
            . Updated whenever the shape of the day changes.
          </div>
        </section>

        {/* Shipping (live GitHub) */}
        <section className="pt-8 border-t border-rule-strong">
          <SectionHeader eyebrow="Filed under" title="Shipping" tone="green" />
          <div className="grid gap-6 md:grid-cols-[1fr_1fr] items-start pb-14">
            <div>
              <p className="font-editorial italic text-ink text-[16.5px] leading-relaxed max-w-[46ch]">
                What&rsquo;s moving through the pipeline. Straight from git.
              </p>
            </div>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft mb-3">
                Recent commits
              </div>
              <GitHubActivity />
            </div>
          </div>
        </section>

        {/* Now Playing */}
        <section className="pt-8 border-t border-rule-strong">
          <SectionHeader eyebrow="Filed under" title="Listening" tone="red" />
          <div className="pb-14">
            <NowPlaying />
          </div>
        </section>

        {/* Gist-driven sections */}
        {data.sections.map((section) => {
          const tone = TONE_FOR_SECTION[section.title] === "green"
            ? "green"
            : TONE_FOR_SECTION[section.title] === "red"
            ? "red"
            : "blue";
          return (
            <section key={section.title} className="pt-8 border-t border-rule-strong">
              <SectionHeader eyebrow="Filed under" title={section.title} tone={tone} />
              <ul className="list-none p-0 m-0 pb-14 max-w-[54ch]">
                {section.items.map((item, j) => (
                  <li
                    key={j}
                    className="grid grid-cols-[22px_1fr] items-baseline gap-4 py-4 border-b border-rule"
                  >
                    <span
                      className="font-mono text-[10.5px] text-ink-soft"
                      aria-hidden="true"
                    >
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span className="font-editorial italic text-ink text-[17px] leading-[1.5]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {/* Visitors */}
        <section className="pt-8 border-t border-rule-strong">
          <SectionHeader eyebrow="Filed under" title="From the desk" tone="blue" />
          <div className="grid gap-6 md:grid-cols-[2fr_3fr] items-start pb-14">
            <p className="font-editorial italic text-ink-soft text-[16px] leading-relaxed max-w-[36ch]">
              A pin drops on this globe whenever someone reads a post. Lagos to Lisbon in one hop.
            </p>
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft mb-3">
                Readers, this week
              </div>
              <VisitorGlobe />
            </div>
          </div>
        </section>

        <div className="pt-10 text-center">
          <p className="font-editorial italic text-ink-soft text-[15px] leading-relaxed max-w-[48ch] mx-auto">
            This page is a living document — I update it whenever the focus shifts. Come back in a week and it will read differently.
          </p>
        </div>
      </div>
    </>
  );
}

function SectionHeader({ eyebrow, title, tone }) {
  const color = tone === "green" ? "var(--green)" : tone === "red" ? "var(--red)" : "var(--blue)";
  return (
    <div className="flex items-baseline justify-between gap-4 mb-8 pb-3 border-b border-rule">
      <div>
        <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">
          {eyebrow}
        </div>
        <h2
          className="font-editorial italic font-normal m-0 leading-none tracking-tight"
          style={{ fontSize: 42, color }}
        >
          {title}
        </h2>
      </div>
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ background: color }}
        aria-hidden="true"
      />
    </div>
  );
}
