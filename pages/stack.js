import Head from "next/head";
import TechStack from "../components/TechStack";

export default function Stack() {
  return (
    <>
      <Head>
        <title>The Toolkit — Ocheverse</title>
        <meta name="description" content="The tools and technologies David Gideon works with day to day." />
        <meta property="og:title" content="The Toolkit — Ocheverse" />
        <meta property="og:description" content="The tools and technologies David Gideon works with day to day." />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">

        {/* Masthead row */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div>
            The Toolkit · <b className="text-ink font-medium">Set in Lagos</b>
          </div>
          <div>Tap to expand details</div>
        </div>

        {/* Hero */}
        <section className="pt-16 pb-14 grid gap-y-8 lg:grid-cols-[5fr_2fr] gap-x-10 items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
              <span className="w-11 h-0.5 bg-ink inline-block" />
              Filed under — Stack
            </div>
            <h1
              className="ed-headline m-0"
              style={{ fontSize: "clamp(46px, 8.6vw, 120px)", lineHeight: 0.96 }}
            >
              The <em style={{ color: "var(--blue)" }}>tools</em>,
              the <em style={{ color: "var(--green)" }}>knives</em>,
              and the <em style={{ color: "var(--red)" }}>duct tape</em>.
            </h1>
          </div>
          <p className="font-editorial italic text-ink-soft text-[16px] leading-relaxed max-w-[36ch]">
            DevOps · Platform engineering · Solutions architecture. Nothing here is theoretical — it&rsquo;s all in production somewhere.
          </p>
        </section>

        {/* Stack body */}
        <div className="pt-10 border-t border-rule-strong">
          <TechStack />
        </div>
      </div>
    </>
  );
}
