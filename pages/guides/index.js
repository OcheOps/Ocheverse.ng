import Head from "next/head";
import Link from "next/link";
import { publishedGuides, draftGuides } from "../../data/guides";

export async function getStaticProps() {
  const strip = ({ body, ...rest }) => rest; // list page doesn't need the bodies
  return {
    props: {
      published: publishedGuides().map(strip),
      upcoming: draftGuides().map(({ title, summary, tags }) => ({ title, summary, tags })),
    },
  };
}

export default function Guides({ published, upcoming }) {
  return (
    <>
      <Head>
        <title>Guides — Ocheverse</title>
        <meta
          name="description"
          content="Hands-on guides to real infrastructure problems: self-hosted CI, Vault, Kubernetes, cloud cost and more, by David Gideon."
        />
        <meta property="og:title" content="Guides — Ocheverse" />
        <meta property="og:url" content="https://ocheverse.ng/guides" />
        <meta property="og:image" content="https://ocheverse.ng/api/og?title=Guides&category=Ocheverse" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div>
            The Field Guides · <b className="text-ink font-medium">Hands-on, from real incidents</b>
          </div>
          <Link href="/learn" className="text-ink hover:text-ed-blue">Prefer a live class? →</Link>
        </div>

        <section className="pt-16 pb-14 grid gap-y-8 lg:grid-cols-[5fr_2fr] gap-x-10 items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
              <span className="w-11 h-0.5 bg-ink inline-block" />
              Guides
            </div>
            <h1 className="ed-headline m-0" style={{ fontSize: "clamp(46px, 8.4vw, 116px)", lineHeight: 0.96 }}>
              Problems I hit, <em style={{ color: "var(--green)" }}>solved</em> so you don’t have to.
            </h1>
          </div>
          <p className="font-editorial italic text-ink-soft text-[16px] leading-relaxed max-w-[36ch]">
            Step-by-step, with the commands that actually worked and the mistakes that didn’t.
          </p>
        </section>

        {published.length > 0 && (
          <ol className="list-none p-0 m-0 border-t border-rule-strong">
            {published.map((g, i) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="ed-post group grid grid-cols-[40px_1fr_auto] items-baseline gap-6 py-7 border-b border-rule text-ink"
                >
                  <span className="font-mono text-[11px] tracking-[0.1em] text-ink-soft pt-1.5">{String(i + 1).padStart(2, "0")}/</span>
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-soft">
                      <em className="not-italic font-semibold text-ed-green">{g.level}</em> · {g.minutes} min · {g.tags.join(" · ")}
                    </span>
                    <span className="ed-title-link font-editorial italic text-[24px] leading-[1.2] text-ink max-w-[44ch] self-start">
                      {g.title}
                    </span>
                    <span className="font-editorial text-ink-soft text-[15px] leading-snug max-w-[64ch]">{g.summary}</span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft pt-2 whitespace-nowrap">Read →</span>
                </Link>
              </li>
            ))}
          </ol>
        )}

        {upcoming.length > 0 && (
          <section className="pt-10 border-t border-rule-strong">
            <div className="mb-6 pb-3 border-b border-rule">
              <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">In progress</div>
              <h2 className="font-editorial italic font-normal m-0 leading-none tracking-tight" style={{ fontSize: "clamp(28px, 4vw, 38px)", color: "var(--blue)" }}>
                On the drafting table
              </h2>
            </div>
            <ul className="list-none p-0 m-0">
              {upcoming.map((g) => (
                <li key={g.title} className="py-5 border-b border-rule">
                  <div className="font-editorial italic text-ink text-[21px] leading-tight">{g.title}</div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-soft mt-2">
                    {g.tags.join(" · ")} · coming soon
                  </div>
                </li>
              ))}
            </ul>
            <p className="font-editorial italic text-ink-soft text-[15px] mt-6 mb-0">
              Want them when they land?{" "}
              <a href="https://ocheverse.substack.com/subscribe" target="_blank" rel="noreferrer" className="text-ed-blue border-b border-rule hover:border-ed-blue">
                Subscribe to Ocheverse
              </a>
              .
            </p>
          </section>
        )}
      </div>
    </>
  );
}
