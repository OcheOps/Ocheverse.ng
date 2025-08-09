// pages/index.js
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Come Learn With Oche — Cloud & DevOps Basics</title>
        <meta
          name="description"
          content="Beginner-friendly cloud & DevOps sessions with Oche. Every Saturday 5pm WAT. ₦2,000 per class, ₦5,000 1-on-1."
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <main className="wrap">
        <section className="hero">
          <div>
            <span className="tag">Beginner-friendly · Live on Saturdays</span>
            <h1>Come Learn With Oche</h1>
            <p className="lead">
              No gatekeeping, just practical Cloud & DevOps. We keep it simple, real, and
              hands-on—so you can actually ship.
            </p>
            <div className="btns">
              <a className="btn primary" href="tel:+2348138776065">📞 Call / WhatsApp: 0813 877 6065</a>
              <a
                className="btn ghost"
                href="mailto:ochecodes@gmail.com?subject=Come%20Learn%20With%20Oche"
              >
                ✉️ Email to register
              </a>
            </div>
            <p className="footer">
              Time: <strong>Every Saturday, 5:00pm WAT</strong> · Location: Online (link sent after payment)
            </p>
          </div>

          <div className="card">
            <div className="grid">
              <div>
                <div className="pill">Group Session</div>
                <div className="price">₦2,000</div>
                <div className="muted">per person / per session</div>
                <div className="list">
                  <div className="item"><div className="bullet" /><div>2-hour live class + Q&A</div></div>
                  <div className="item"><div className="bullet" /><div>Recording shared after class</div></div>
                  <div className="item"><div className="bullet" /><div>Beginner-friendly, real projects</div></div>
                </div>
              </div>
              <div>
                <div className="pill">1-on-1 Coaching</div>
                <div className="price">₦5,000</div>
                <div className="muted">per session</div>
                <div className="list">
                  <div className="item"><div className="bullet" /><div>Personalized roadmap</div></div>
                  <div className="item"><div className="bullet" /><div>Hands-on guidance & feedback</div></div>
                  <div className="item"><div className="bullet" /><div>We work on <em>your</em> goals</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <div className="card">
            <h2 style={{ margin: "0 0 8px" }}>What you’ll learn</h2>
            <div className="list">
              <div className="item"><div className="bullet" /><div>Cloud 101: IaaS, PaaS, SaaS · Public vs Private vs Hybrid · Regions & AZs</div></div>
              <div className="item"><div className="bullet" /><div>Core services: Compute, Storage, Networking, IAM basics</div></div>
              <div className="item"><div className="bullet" /><div>Hands-on: Deploy a tiny app, monitor it, and keep it alive</div></div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <div className="card center">
            <p className="lead" style={{ margin: "0 0 10px" }}>Ready?</p>
            <a className="btn primary" href="https://wa.me/2348138776065">Chat on WhatsApp</a>
          </div>
        </section>
      </main>

      <style jsx global>{`
        :root { --bg:#0b0f1a; --fg:#e6e8ef; --muted:#9aa3b2; --card:#121829; --brand:#5b8cff; }
        * { box-sizing: border-box; }
        body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif; background:var(--bg); color:var(--fg); }
        .wrap { max-width: 920px; margin: 0 auto; padding: 32px 20px; }
        .hero { display:grid; gap:20px; grid-template-columns: 1fr; align-items:center; }
        .tag { display:inline-block; padding:6px 10px; border:1px solid #233; border-radius:999px; font-size:12px; color:var(--muted); letter-spacing:.3px; }
        h1 { font-size: clamp(28px, 4vw, 44px); line-height:1.05; margin:10px 0 6px; }
        p.lead { font-size: clamp(15px, 2.2vw, 18px); color: var(--muted); max-width: 60ch; }
        .card { background: var(--card); border:1px solid #1a2238; border-radius: 18px; padding: 20px; }
        .grid { display:grid; gap:16px; grid-template-columns: 1fr; }
        .btns { display:flex; gap:12px; flex-wrap:wrap; margin-top:14px; }
        .btn { text-decoration:none; padding:12px 16px; border-radius:12px; border:1px solid #25314f; }
        .primary { background: var(--brand); color:#081022; border-color:transparent; font-weight:600; }
        .ghost { color: var(--fg); }
        .list { display:grid; grid-template-columns: 1fr; gap:12px; margin:8px 0 0; }
        .item { display:flex; gap:10px; align-items:flex-start; }
        .bullet { width:8px; height:8px; border-radius:50%; background: var(--brand); margin-top:9px; flex:0 0 auto; }
        .pill { display:inline-block; padding:6px 10px; border-radius:999px; background:#0e1426; border:1px solid #1c2744; color:var(--muted); font-size:12px; }
        .footer { color:var(--muted); font-size:13px; margin-top:24px; }
        @media (min-width: 850px) {
          .hero { grid-template-columns: 1.15fr .85fr; }
          .grid { grid-template-columns: 1fr 1fr; }
        }
        .price { font-size:28px; font-weight:700; }
        .muted { color: var(--muted); }
        .center { text-align:center; }
      `}</style>
    </>
  );
}
