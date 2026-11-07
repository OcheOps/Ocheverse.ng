import Head from "next/head";
import Link from "next/link";
import { guides, getGuide } from "../../data/guides";
import GuideBody from "../../components/GuideBody";
import ReadingProgress from "../../components/ReadingProgress";

export async function getStaticPaths() {
  // Drafts are built too, so they can be reviewed by URL before publishing
  return { paths: guides.map((g) => ({ params: { slug: g.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const guide = getGuide(params.slug);
  if (!guide) return { notFound: true };
  return { props: { guide } };
}

export default function Guide({ guide }) {
  const url = `https://ocheverse.ng/guides/${guide.slug}`;
  const toc = guide.body.filter((b) => b.h2).map((b) => ({
    text: b.h2,
    id: b.h2.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  }));
  const date = new Date(guide.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <ReadingProgress />
      <Head>
        <title>{guide.title} — Ocheverse Guides</title>
        <meta name="description" content={guide.summary} />
        {guide.draft && <meta name="robots" content="noindex, nofollow" />}
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={guide.summary} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta
          property="og:image"
          content={`https://ocheverse.ng/api/og?title=${encodeURIComponent(guide.title)}&category=Guide`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={url} key="canonical" />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6">
        {guide.draft && (
          <div className="mt-2 mb-2 px-4 py-3 border border-dashed font-mono text-[11px] uppercase tracking-[0.12em]"
            style={{ borderColor: "var(--red)", color: "var(--red)" }}>
            Draft — not listed or indexed yet. Set <code>draft: false</code> in data/guides.js to publish.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <Link href="/guides" className="hover:text-ed-blue">← All guides</Link>
          <div>{date}</div>
        </div>

        <article className="grid gap-y-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-x-12 pt-14 pb-24">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft mb-6 flex flex-wrap gap-x-3 gap-y-1">
              <span className="text-ed-green">Guide · {guide.level}</span>
              <span aria-hidden="true">·</span>
              <span>{guide.minutes} min</span>
              <span aria-hidden="true">·</span>
              <span>{guide.tags.join(" · ")}</span>
            </div>
            <h1 className="ed-headline m-0 mb-6" style={{ fontSize: "clamp(36px, 5.2vw, 68px)", lineHeight: 1.03 }}>
              {guide.title}
            </h1>
            <p className="font-editorial italic text-ink-soft text-[19px] leading-relaxed m-0 mb-10 pb-8 border-b border-rule-strong max-w-[64ch]">
              {guide.summary}
            </p>

            <GuideBody blocks={guide.body} />

            <div
              className="mt-16 border p-8"
              style={{ borderColor: "var(--rule-strong)", background: "color-mix(in oklab, var(--paper-2) 55%, transparent)" }}
            >
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft mb-2">Found this useful?</div>
              <p className="font-editorial italic text-ink text-[22px] leading-snug m-0">
                More like this lands in{" "}
                <a href="https://ocheverse.substack.com/subscribe" target="_blank" rel="noreferrer" className="text-ed-blue border-b border-rule hover:border-ed-blue">
                  Ocheverse
                </a>
                . Or{" "}
                <Link href="/hire" className="text-ed-blue border-b border-rule hover:border-ed-blue">hire me</Link>{" "}
                to solve yours.
              </p>
            </div>
          </div>

          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-soft mb-4 pb-2 border-b border-rule-strong">
                  On this page
                </div>
                <ol className="list-none p-0 m-0 flex flex-col gap-2.5">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="block text-[13px] leading-snug text-ink-soft hover:text-ed-blue transition-colors">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          )}
        </article>
      </div>
    </>
  );
}
