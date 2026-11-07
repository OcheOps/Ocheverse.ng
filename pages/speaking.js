import Head from "next/head";
import Link from "next/link";
import { profile, talks, speakingTopics, speakingFormats } from "../data/career";

export default function Speaking() {
  const invite = `mailto:${profile.email}?subject=${encodeURIComponent("Speaking invitation")}`;

  return (
    <>
      <Head>
        <title>Speaking — David Gideon</title>
        <meta
          name="description"
          content="Invite David Gideon to speak on platform engineering, cloud cost, DevSecOps and building a tech career from Nigeria."
        />
        <meta property="og:title" content="Speaking — David Gideon" />
        <meta property="og:url" content="https://ocheverse.ng/speaking" />
        <meta
          property="og:image"
          content="https://ocheverse.ng/api/og?title=Speaking&category=David%20Gideon"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div>
            The Podium · <b className="text-ink font-medium">Talks, workshops &amp; podcasts</b>
          </div>
          <div className="inline-flex items-center gap-2 text-ink">
            <span className="ed-live-dot" aria-hidden="true" />
            Accepting invitations
          </div>
        </div>

        <section className="pt-16 pb-14 grid gap-y-8 lg:grid-cols-[5fr_2fr] gap-x-10 items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
              <span className="w-11 h-0.5 bg-ink inline-block" />
              Speaking
            </div>
            <h1 className="ed-headline m-0" style={{ fontSize: "clamp(46px, 8.4vw, 116px)", lineHeight: 0.96 }}>
              War stories from <em style={{ color: "var(--blue)" }}>production</em>, told{" "}
              <em style={{ color: "var(--red)" }}>honestly</em>.
            </h1>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-editorial italic text-ink-soft text-[16px] leading-relaxed max-w-[36ch] m-0">
              I talk about the parts of platform engineering that don’t make the slides: the bills, the
              outages, and the people.
            </p>
            <a
              href={invite}
              className="self-start inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-paper bg-ed-blue px-6 py-3.5 rounded-full hover:-translate-y-0.5 hover:bg-ed-blue-ink transition-all"
            >
              Invite me to speak →
            </a>
          </div>
        </section>

        {/* Topics */}
        <section className="pt-10 pb-14 border-t border-rule-strong">
          <div className="mb-8 pb-3 border-b border-rule">
            <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">What I can talk about</div>
            <h2 className="font-editorial italic font-normal m-0 leading-none tracking-tight" style={{ fontSize: "clamp(30px, 4.4vw, 42px)", color: "var(--green)" }}>
              Topics
            </h2>
          </div>
          <ol className="list-none p-0 m-0">
            {speakingTopics.map((t, i) => (
              <li key={t.title} className="grid grid-cols-[40px_1fr] gap-x-4 py-6 border-t border-rule first:border-t-0">
                <span className="font-mono text-[11px] tracking-[0.1em] text-ink-soft pt-2">{String(i + 1).padStart(2, "0")}/</span>
                <div>
                  <div className="font-editorial italic text-ink text-[24px] leading-tight">{t.title}</div>
                  <p className="font-editorial text-ink-soft text-[16px] leading-relaxed mt-1.5 mb-0 max-w-[64ch]">{t.blurb}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Formats */}
        <section className="pt-10 pb-14 border-t border-rule-strong">
          <div className="mb-6 pb-3 border-b border-rule">
            <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">Happy to do</div>
            <h2 className="font-editorial italic font-normal m-0 leading-none tracking-tight" style={{ fontSize: "clamp(30px, 4.4vw, 42px)", color: "var(--red)" }}>
              Formats
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {speakingFormats.map((f) => (
              <span key={f} className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink border border-rule-strong px-3 py-1.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
          <p className="font-editorial italic text-ink-soft text-[15px] mt-5 mb-0">
            In person in Lagos, or remote anywhere. I also teach small{" "}
            <Link href="/learn" className="text-ed-blue border-b border-rule hover:border-ed-blue">live cloud classes</Link>.
          </p>
        </section>

        {/* Past talks — only once there are some */}
        {talks.length > 0 && (
          <section className="pt-10 pb-14 border-t border-rule-strong">
            <div className="mb-8 pb-3 border-b border-rule">
              <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">On the record</div>
              <h2 className="font-editorial italic font-normal m-0 leading-none tracking-tight" style={{ fontSize: "clamp(30px, 4.4vw, 42px)", color: "var(--blue)" }}>
                Past talks
              </h2>
            </div>
            <ol className="list-none p-0 m-0">
              {talks.map((t) => (
                <li key={t.title + t.date} className="grid gap-x-8 md:grid-cols-[200px_1fr] py-5 border-t border-rule first:border-t-0">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-soft pt-1.5">
                    <div className="text-ink">{t.date}</div>
                    <div>{t.event}</div>
                  </div>
                  <div>
                    <div className="font-editorial italic text-ink text-[21px] leading-tight">{t.title}</div>
                    {t.url && (
                      <a href={t.url} target="_blank" rel="noreferrer" className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ed-blue">
                        Watch / slides ↗
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section
          className="mt-6 pt-10 pb-10 grid gap-6 md:grid-cols-[1fr_auto] items-end"
          style={{ borderTop: "3px double var(--rule-strong)", borderBottom: "3px double var(--rule-strong)" }}
        >
          <h2 className="ed-headline m-0" style={{ fontSize: "clamp(28px, 4.2vw, 52px)", lineHeight: 1 }}>
            Running a meetup, conference or podcast?
            <br />
            <em style={{ color: "var(--blue)" }}>I’d love to hear about it.</em>
          </h2>
          <a
            href={invite}
            className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-paper bg-ed-blue px-6 py-3.5 rounded-full hover:-translate-y-0.5 hover:bg-ed-blue-ink transition-all"
          >
            {profile.email}
          </a>
        </section>
      </div>
    </>
  );
}
