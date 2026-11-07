import Head from "next/head";
import Link from "next/link";
import { profile } from "../../data/career";

// ---- Edit prices and schedule here ----
const SCHEDULE = { when: "Flexible times, scheduled around you", where: "Online" };

const PLANS = [
  {
    id: "group",
    name: "Group class",
    price: "₦8,000",
    unit: "per person / session",
    tone: "var(--blue)",
    perks: ["2-hour live class + Q&A", "Recording shared after class", "Beginner-friendly, real projects"],
    cta: { label: "Join on WhatsApp", href: "group" },
  },
  {
    id: "coaching",
    name: "1-on-1 coaching",
    price: "₦10,000",
    unit: "per session",
    tone: "var(--red)",
    perks: ["Personalized roadmap", "Hands-on guidance & feedback", "We work on your goals"],
    cta: { label: "Book a session", href: "booking" },
  },
];

const CURRICULUM = [
  { title: "Cloud 101", body: "IaaS, PaaS, SaaS · Public vs private vs hybrid · Regions and availability zones" },
  { title: "Core services", body: "Compute (EC2), storage (S3), networking (VPC) and IAM basics" },
  { title: "Hands-on", body: "Deploy a tiny app, monitor it, and keep it alive in the cloud." },
];
// ---------------------------------------

const WHATSAPP = "https://wa.me/2348138776065";
const waLink = (msg) => `${WHATSAPP}?text=${encodeURIComponent(msg)}`;

export default function Learn() {
  const ctaHref = (key) =>
    key === "booking" && profile.bookingUrl
      ? profile.bookingUrl
      : waLink("Hi Oche, I'm interested in joining the DevOps class!");

  return (
    <>
      <Head>
        <title>Classes — Come Learn With Oche</title>
        <meta
          name="description"
          content={`Beginner-friendly cloud & DevOps classes with Oche. ${SCHEDULE.when}. Group class ${PLANS[0].price}, 1-on-1 ${PLANS[1].price}.`}
        />
        <meta property="og:title" content="Come Learn With Oche — Cloud & DevOps classes" />
        <meta property="og:url" content="https://ocheverse.ng/learn" />
        <meta property="og:image" content="https://ocheverse.ng/api/og?title=Come%20Learn%20With%20Oche&category=Classes" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div>
            The Classroom · <b className="text-ink font-medium">{SCHEDULE.when}</b> · {SCHEDULE.where}
          </div>
          <div className="inline-flex items-center gap-2 text-ink">
            <span className="ed-live-dot" aria-hidden="true" />
            Enrolling now
          </div>
        </div>

        {/* Hero */}
        <section className="pt-16 pb-14 grid gap-y-8 lg:grid-cols-[5fr_2fr] gap-x-10 items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
              <span className="w-11 h-0.5 bg-ink inline-block" />
              Beginner-friendly · Live
            </div>
            <h1 className="ed-headline m-0" style={{ fontSize: "clamp(46px, 8.4vw, 116px)", lineHeight: 0.96 }}>
              Come <em style={{ color: "var(--green)" }}>learn</em> with Oche.
            </h1>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-editorial italic text-ink-soft text-[16px] leading-relaxed max-w-[36ch] m-0">
              No gatekeeping, just practical cloud and DevOps. Simple, real and hands-on, so you can actually ship.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={waLink("Hi Oche, I'm interested in joining the DevOps class!")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-paper bg-ed-green px-5 py-3 rounded-full hover:-translate-y-0.5 transition-all"
              >
                Chat on WhatsApp →
              </a>
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent("Come Learn With Oche")}`}
                className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink border border-ink px-5 py-3 rounded-full hover:bg-ink hover:text-paper transition-all"
              >
                Email to register
              </a>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="pt-10 pb-14 border-t border-rule-strong">
          <div className="mb-8 pb-3 border-b border-rule">
            <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">Pricing</div>
            <h2 className="font-editorial italic font-normal m-0 leading-none tracking-tight" style={{ fontSize: "clamp(30px, 4.4vw, 42px)", color: "var(--blue)" }}>
              Two ways to learn
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col border border-rule-strong p-7"
                style={{ background: "color-mix(in oklab, var(--paper-2) 45%, transparent)", boxShadow: "6px 6px 0 var(--rule-strong)" }}
              >
                <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] mb-3 flex items-center gap-2" style={{ color: plan.tone }}>
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: plan.tone }} aria-hidden="true" />
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-editorial italic text-ink leading-none tracking-tight" style={{ fontSize: "clamp(48px, 6vw, 68px)" }}>
                    {plan.price}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">{plan.unit}</span>
                </div>
                <ul className="list-none p-0 m-0 mt-6 mb-7 flex flex-col">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="grid grid-cols-[22px_1fr] py-2.5 border-b border-rule font-editorial text-ink text-[16px]">
                      <span style={{ color: plan.tone }} aria-hidden="true">◇</span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <a
                  href={ctaHref(plan.cta.href)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto self-start inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-paper px-6 py-3.5 rounded-full hover:-translate-y-0.5 transition-all"
                  style={{ background: plan.tone }}
                >
                  {plan.cta.label} →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Curriculum */}
        <section className="pt-10 pb-14 border-t border-rule-strong">
          <div className="mb-8 pb-3 border-b border-rule">
            <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">The syllabus</div>
            <h2 className="font-editorial italic font-normal m-0 leading-none tracking-tight" style={{ fontSize: "clamp(30px, 4.4vw, 42px)", color: "var(--green)" }}>
              What you’ll learn
            </h2>
          </div>
          <ol className="list-none p-0 m-0 grid gap-px md:grid-cols-3 border border-rule" style={{ background: "var(--rule)" }}>
            {CURRICULUM.map((c, i) => (
              <li key={c.title} className="p-6 bg-paper flex flex-col gap-2">
                <span className="font-mono text-[11px] tracking-[0.1em] text-ink-soft">{String(i + 1).padStart(2, "0")}/</span>
                <span className="font-editorial italic text-ink text-[26px] leading-tight">{c.title}</span>
                <span className="font-editorial text-ink-soft text-[15.5px] leading-relaxed">{c.body}</span>
              </li>
            ))}
          </ol>
          <p className="font-editorial italic text-ink-soft text-[15px] mt-6 mb-0">
            Prefer to learn at your own pace? Start with the free{" "}
            <Link href="/guides" className="text-ed-blue border-b border-rule hover:border-ed-blue">guides</Link>.
          </p>
        </section>

        {/* Closing CTA */}
        <section
          className="mt-6 pt-10 pb-10 grid gap-6 md:grid-cols-[1fr_auto] items-end"
          style={{ borderTop: "3px double var(--rule-strong)", borderBottom: "3px double var(--rule-strong)" }}
        >
          <h2 className="ed-headline m-0" style={{ fontSize: "clamp(28px, 4.2vw, 52px)", lineHeight: 1 }}>
            Ready to start? We’ll find a time that <em style={{ color: "var(--green)" }}>works for you</em>.
          </h2>
          <a
            href={waLink("Hi Oche, I'm ready to start learning!")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-paper bg-ed-green px-6 py-3.5 rounded-full hover:-translate-y-0.5 transition-all"
          >
            Start on WhatsApp →
          </a>
        </section>
      </div>
    </>
  );
}
