import Head from "next/head";
import Link from "next/link";
import { projects, profile } from "../data/career";
import { enrichProjects, recency } from "../lib/github";

export async function getStaticProps() {
  return { props: { projects: await enrichProjects(projects) }, revalidate: 3600 };
}

export default function Projects({ projects: live }) {
  return (
    <>
      <Head>
        <title>Projects — David Gideon</title>
        <meta
          name="description"
          content="Case studies: Clyra OSS, Infra Monitor, Passy and Paths-in-TECH — open-source cloud, observability and security tooling by David Gideon."
        />
        <meta property="og:title" content="Projects — David Gideon" />
        <meta property="og:url" content="https://ocheverse.ng/projects" />
        <meta
          property="og:image"
          content="https://ocheverse.ng/api/og?title=Projects&category=David%20Gideon"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div>
            The Workshop · <b className="text-ink font-medium">{live.length}</b> open-source projects
          </div>
          <Link href="/hire" className="text-ink hover:text-ed-blue">Hiring? Start here →</Link>
        </div>

        <section className="pt-16 pb-14 grid gap-y-8 lg:grid-cols-[5fr_2fr] gap-x-10 items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
              <span className="w-11 h-0.5 bg-ink inline-block" />
              Case studies
            </div>
            <h1 className="ed-headline m-0" style={{ fontSize: "clamp(46px, 8.4vw, 116px)", lineHeight: 0.96 }}>
              Things I <em style={{ color: "var(--blue)" }}>built</em> because I{" "}
              <em style={{ color: "var(--red)" }}>needed</em> them.
            </h1>
          </div>
          <p className="font-editorial italic text-ink-soft text-[16px] leading-relaxed max-w-[36ch]">
            Each one started as a problem at work or in my homelab. All open source, all on{" "}
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-ed-blue border-b border-rule hover:border-ed-blue">
              GitHub
            </a>
            .
          </p>
        </section>

        <ol className="list-none p-0 m-0">
          {live.map((p, i) => {
            const fresh = recency(p.pushedAt);
            const tone = ["var(--blue)", "var(--green)", "var(--red)", "var(--ink)"][i % 4];
            return (
              <li key={p.slug} id={p.slug} className="grid gap-y-6 lg:grid-cols-[280px_1fr] gap-x-12 py-12 border-t border-rule-strong scroll-mt-24">
                <div>
                  <div className="font-mono text-[11px] tracking-[0.1em] text-ink-soft mb-2">
                    {String(i + 1).padStart(2, "0")}/
                  </div>
                  <h2 className="font-editorial italic font-normal m-0 leading-none tracking-tight" style={{ fontSize: "clamp(34px, 4.4vw, 48px)", color: tone }}>
                    {p.name}
                  </h2>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-soft mt-3 flex flex-col gap-1">
                    {p.language && <span>{p.language}</span>}
                    {fresh && <span className="text-ed-green">{fresh}</span>}
                    {p.showStars && p.stars ? <span>★ {p.stars} on GitHub</span> : null}
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink border border-ink px-4 py-2 rounded-full hover:bg-ink hover:text-paper transition-all"
                  >
                    View on GitHub ↗
                  </a>
                </div>
                <div className="max-w-[68ch]">
                  <p className="font-editorial italic text-ink text-[22px] leading-snug m-0">{p.tagline}</p>
                  <dl className="mt-6 grid gap-5">
                    <div>
                      <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ed-red mb-1">The problem</dt>
                      <dd className="m-0 font-editorial text-ink-soft text-[16.5px] leading-relaxed">{p.problem}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ed-blue mb-1">What I built</dt>
                      <dd className="m-0 font-editorial text-ink-soft text-[16.5px] leading-relaxed">{p.built}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ed-green mb-2">Stack</dt>
                      <dd className="m-0 flex flex-wrap gap-1.5">
                        {p.stack.map((s) => (
                          <span key={s} className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-soft border border-rule px-2 py-0.5">
                            {s}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
