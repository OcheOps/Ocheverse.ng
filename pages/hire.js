import Head from "next/head";
import Link from "next/link";
import { profile, impact, experience, projects, certifications } from "../data/career";
import { enrichProjects } from "../lib/github";
import ProjectCard from "../components/ProjectCard";
import { createParser, parseFeedResilient } from "../lib/rssParser";

export async function getStaticProps() {
  const enriched = await enrichProjects(projects);

  // Real publishing record for the "teaching in public" section
  const parser = createParser();
  const counts = { ocheverse: 0, bpur: 0 };
  for (const source of ["ocheverse", "bpur"]) {
    try {
      const feed = await parseFeedResilient(parser, source);
      counts[source] = feed.items.length;
    } catch {
      /* leave at 0; section hides counts it doesn't have */
    }
  }

  return {
    props: { projects: enriched, postCounts: counts },
    revalidate: 3600,
  };
}

const ISSUER_COLOR = {
  AWS: "var(--red)",
  Microsoft: "var(--blue)",
  "Google Cloud": "var(--green)",
  Oracle: "var(--red)",
  CNCF: "var(--blue)",
};

export default function Hire({ projects: liveProjects, postCounts }) {
  const certCount = certifications.reduce((n, g) => n + g.items.length, 0);
  const totalPosts = (postCounts?.ocheverse || 0) + (postCounts?.bpur || 0);
  const pathsInTech = liveProjects.find((p) => p.slug === "paths-in-tech");
  const featured = liveProjects.filter((p) => p.slug !== "paths-in-tech").slice(0, 3);

  return (
    <>
      <Head>
        <title>Hire David Gideon — Cloud & Platform Engineer</title>
        <meta
          name="description"
          content="Cloud & platform engineer, solutions architect and DevSecOps engineer. 75% faster deploys, 50% lower cloud spend, 15 cloud certifications. Open to remote, hybrid, on-site and relocation."
        />
        <meta property="og:title" content="Hire David Gideon — Cloud & Platform Engineer" />
        <meta
          property="og:description"
          content="Platform engineering, solutions architecture and DevSecOps. Open to roles worldwide."
        />
        <meta property="og:url" content="https://ocheverse.ng/hire" />
        <meta
          property="og:image"
          content="https://ocheverse.ng/api/og?title=Hire%20David%20Gideon&category=Cloud%20%26%20Platform%20Engineer"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">
        {/* Masthead row */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div>
            The Hiring Desk · <b className="text-ink font-medium">{profile.location}</b>
          </div>
          <div className="inline-flex items-center gap-2 text-ink">
            <span className="ed-live-dot" aria-hidden="true" />
            Available for new roles
          </div>
        </div>

        {/* ============ HERO ============ */}
        <section className="pt-14 sm:pt-16 pb-14 grid gap-y-8 lg:grid-cols-[5fr_2fr] gap-x-12 items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
              <span className="w-11 h-0.5 bg-ink inline-block" />
              For recruiters &amp; hiring managers
            </div>
            <h1
              className="ed-headline m-0"
              style={{ fontSize: "clamp(40px, 7.4vw, 104px)", lineHeight: 0.98 }}
            >
              I build cloud platforms that ship{" "}
              <em style={{ color: "var(--blue)" }}>faster</em>, cost{" "}
              <em style={{ color: "var(--green)" }}>less</em>, and stay{" "}
              <em style={{ color: "var(--red)" }}>secure</em>.
            </h1>
            <p className="font-editorial italic text-ink-soft text-[17px] leading-relaxed mt-6 mb-0 max-w-[56ch]">
              {profile.name}: {profile.headline}. Five-plus years across regulated financial services,
              government infrastructure and AWS partner consulting — and I write about all of it in public.
            </p>
          </div>

          <aside className="border border-rule-strong p-5 font-mono text-[11.5px] leading-relaxed"
            style={{ background: "color-mix(in oklab, var(--paper-2) 60%, transparent)" }}>
            <div className="text-ink font-semibold uppercase tracking-[0.12em] mb-3 pb-2 border-b border-dashed border-rule-strong">
              Looking for
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-1.5 text-ink">
              {profile.rolesSought.map((r) => (
                <li key={r} className="flex items-baseline gap-2">
                  <span className="text-ed-blue" aria-hidden="true">◇</span>
                  {r}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-dashed border-rule-strong text-ink-soft normal-case tracking-normal">
              {profile.availability}
            </div>
          </aside>
        </section>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 pb-14">
          <a
            href={profile.cv}
            download
            className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-paper bg-ed-blue px-6 py-3.5 rounded-full hover:-translate-y-0.5 hover:bg-ed-blue-ink transition-all"
          >
            Download CV <span aria-hidden="true">↓</span>
          </a>
          <a
            href={`mailto:${profile.email}?subject=${encodeURIComponent("Role opportunity")}`}
            className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink border border-ink px-6 py-3.5 rounded-full hover:bg-ink hover:text-paper transition-all"
          >
            Email me <span aria-hidden="true">→</span>
          </a>
          {profile.bookingUrl && (
            <a
              href={profile.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink border border-rule-strong px-6 py-3.5 rounded-full hover:border-ink transition-all"
            >
              Book a call <span aria-hidden="true">↗</span>
            </a>
          )}
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-soft px-4 py-3.5 hover:text-ed-blue transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-soft px-4 py-3.5 hover:text-ed-blue transition-colors"
          >
            GitHub ↗
          </a>
        </div>

        {/* ============ IMPACT ============ */}
        <Section eyebrow="Track record" title="In numbers" tone="var(--blue)">
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 border border-rule" style={{ background: "var(--rule)" }}>
            {impact.map((m, i) => (
              <div key={m.label} className="p-6 flex flex-col gap-2" style={{ background: "var(--paper)" }}>
                <div
                  className="font-editorial italic leading-none tracking-tight"
                  style={{
                    fontSize: "clamp(48px, 6vw, 72px)",
                    color: ["var(--blue)", "var(--green)", "var(--red)", "var(--ink)"][i % 4],
                  }}
                >
                  {m.value}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink font-semibold">{m.label}</div>
                <div className="font-editorial text-[14.5px] text-ink-soft leading-snug">{m.detail}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft mt-auto pt-2">{m.where}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ============ EXPERIENCE ============ */}
        <Section eyebrow="Where I’ve worked" title="Experience" tone="var(--green)">
          <ol className="list-none p-0 m-0">
            {experience.map((e) => (
              <li
                key={e.company + e.role}
                className="grid gap-x-8 gap-y-1 md:grid-cols-[200px_1fr] py-5 border-t border-rule first:border-t-0"
              >
                <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-soft pt-1.5">
                  <div className="text-ink">{e.dates}</div>
                  <div>{e.type}</div>
                </div>
                <div>
                  <div className="font-editorial italic text-ink text-[21px] leading-tight">
                    {e.role} <span className="text-ink-soft">—</span>{" "}
                    <span className="not-italic font-editorial">{e.company}</span>
                  </div>
                  <p className="font-editorial text-ink-soft text-[15px] leading-relaxed mt-1.5 mb-0 max-w-[70ch]">
                    {e.summary}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-soft mt-5 mb-0">
            Earlier: Hoshis Tech Corp, Wejapa, Gokada (2020–2022) ·{" "}
            <a href={profile.cv} download className="text-ink hover:text-ed-blue">
              Full detail in the CV ↓
            </a>
          </p>
        </Section>

        {/* ============ PROJECTS ============ */}
        <Section eyebrow="Things I’ve built" title="Selected projects" tone="var(--red)"
          aside={<Link href="/projects" className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink hover:text-ed-blue">All case studies →</Link>}>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
        </Section>

        {/* ============ CERTIFICATIONS ============ */}
        <Section
          id="certifications"
          eyebrow={`${certCount} certifications`}
          title="Certified across every major cloud"
          tone="var(--blue)"
          aside={
            <a href={profile.certificationsUrl} target="_blank" rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink hover:text-ed-blue">
              Verify on LinkedIn ↗
            </a>
          }
        >
          <div className="grid gap-10 lg:grid-cols-3">
            {certifications.map((g) => (
              <div key={g.group}>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-soft mb-3 pb-2 border-b border-rule-strong">
                  {g.group}
                </div>
                <ul className="list-none p-0 m-0 flex flex-col">
                  {g.items.map((c) => (
                    <li key={c.issuer + c.name} className="py-3 border-b border-rule flex items-baseline gap-3">
                      <span
                        className="inline-block w-2 h-2 rounded-full flex-shrink-0 translate-y-[-1px]"
                        style={{ background: ISSUER_COLOR[c.issuer] || "var(--ink-soft)" }}
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">{c.issuer}</div>
                        <div className="font-editorial text-ink text-[15.5px] leading-snug">{c.name}</div>
                      </div>
                      {c.date && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft whitespace-nowrap">
                          {c.date}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ============ TEACHING IN PUBLIC (DevRel) ============ */}
        <Section eyebrow="Developer relations" title="I teach in public" tone="var(--green)">
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 border border-rule" style={{ background: "var(--rule)" }}>
            {totalPosts > 0 && (
              <Stat href="/blog" value={totalPosts} label="posts published" detail="Across two publications: Ocheverse (engineering) and BPUR (essays)" />
            )}
            {pathsInTech?.stars ? (
              <Stat href={pathsInTech.url} external value={`★ ${pathsInTech.stars}`} label="Paths-in-TECH" detail="A public career guide for people finding it hard in tech" />
            ) : null}
            <Stat href="/guides" value="Guides" label="hands-on tutorials" detail="Real infrastructure problems, solved step by step" />
            <Stat href="/speaking" value="Talks" label="topics & speaking" detail="Conference talks, meetups, workshops and podcasts" />
          </div>
        </Section>

        {/* ============ CLOSING CTA ============ */}
        <section
          className="mt-20 pt-10 pb-10 grid gap-6 md:grid-cols-[1fr_auto] items-end"
          style={{ borderTop: "3px double var(--rule-strong)", borderBottom: "3px double var(--rule-strong)" }}
        >
          <h2 className="ed-headline m-0" style={{ fontSize: "clamp(30px, 4.6vw, 56px)", lineHeight: 1 }}>
            Hiring for platform, cloud, security or <em style={{ color: "var(--green)" }}>DevRel</em>?
            <br />
            <em style={{ color: "var(--blue)" }}>Let’s talk.</em>
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent("Role opportunity")}`}
              className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-paper bg-ed-blue px-6 py-3.5 rounded-full hover:-translate-y-0.5 hover:bg-ed-blue-ink transition-all"
            >
              {profile.email}
            </a>
            <a
              href={profile.cv}
              download
              className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink border border-ink px-6 py-3.5 rounded-full hover:bg-ink hover:text-paper transition-all"
            >
              CV ↓
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

function Section({ id, eyebrow, title, tone, aside, children }) {
  return (
    <section id={id} className="pt-10 pb-14 border-t border-rule-strong scroll-mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8 pb-3 border-b border-rule">
        <div>
          <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">{eyebrow}</div>
          <h2 className="font-editorial italic font-normal m-0 leading-none tracking-tight" style={{ fontSize: "clamp(30px, 4.4vw, 42px)", color: tone }}>
            {title}
          </h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Stat({ href, external, value, label, detail }) {
  const inner = (
    <>
      <div className="font-editorial italic text-ink leading-none tracking-tight" style={{ fontSize: "clamp(36px, 4.6vw, 52px)" }}>
        {value}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink font-semibold">{label}</div>
      <div className="font-editorial text-[14.5px] text-ink-soft leading-snug">{detail}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ed-blue mt-auto pt-2">Open →</div>
    </>
  );
  const cls = "p-6 flex flex-col gap-2 bg-paper hover:bg-paper-2 transition-colors";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link href={href} className={cls}>{inner}</Link>
  );
}
