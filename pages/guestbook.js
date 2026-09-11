import Head from "next/head";
import Script from "next/script";

export default function Guestbook() {
  const remark42Host = process.env.NEXT_PUBLIC_REMARK42_HOST || "";

  return (
    <>
      <Head>
        <title>The Postbag — Ocheverse</title>
        <meta name="description" content="Leave a note. Say hi. Share a thought. Sign the guestbook." />
        <meta property="og:title" content="The Postbag — Ocheverse" />
        <meta property="og:description" content="Leave a note in the Ocheverse guestbook." />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">

        {/* Masthead row */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div>
            The Postbag · <b className="text-ink font-medium">Reader letters</b>
          </div>
          <div>No login required · Sign anonymously</div>
        </div>

        {/* Hero */}
        <section className="pt-16 pb-12 grid gap-y-8 lg:grid-cols-[5fr_2fr] gap-x-10 items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
              <span className="w-11 h-0.5 bg-ink inline-block" />
              <em className="not-italic text-ed-red font-semibold tracking-[0.18em]">
                Letters to the editor
              </em>
            </div>
            <h1
              className="ed-headline m-0"
              style={{ fontSize: "clamp(46px, 8.6vw, 120px)", lineHeight: 0.96 }}
            >
              Leave a{" "}
              <em style={{ color: "var(--red)" }}>mark</em>.
              <br />
              Say <em style={{ color: "var(--blue)" }}>hi</em>.
            </h1>
          </div>
          <p className="font-editorial italic text-ink-soft text-[16px] leading-relaxed max-w-[36ch]">
            A page for postcards, hot takes, long thanks, one-line reactions.
            No account. No tracking. Just a signature.
          </p>
        </section>

        {/* Guestbook body */}
        <div className="pt-10 border-t border-rule-strong">
          <div className="mb-8 pb-3 border-b border-rule">
            <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">
              Sign here
            </div>
            <h2
              className="font-editorial italic font-normal m-0 leading-none tracking-tight"
              style={{ fontSize: 32, color: "var(--red)" }}
            >
              Recent notes
            </h2>
          </div>

          {remark42Host ? (
            <div className="max-w-[800px]">
              <div id="remark42" />
              <Script
                id="remark42-guestbook-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    var remark_config = {
                      host: '${remark42Host}',
                      site_id: '${process.env.NEXT_PUBLIC_REMARK42_SITE_ID || 'ocheverse'}',
                      components: ['embed'],
                      url: 'https://ocheverse.ng/guestbook',
                      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
                      no_footer: true,
                    };
                  `,
                }}
              />
              <Script src={`${remark42Host}/web/embed.js`} strategy="afterInteractive" />
            </div>
          ) : (
            <div className="max-w-[600px] py-10 px-8 border border-dashed border-rule-strong text-center">
              <p className="font-editorial italic text-ink text-[22px] mb-3">
                Postbag coming soon.
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
                The comment system is being wired. Come back in a minute.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
