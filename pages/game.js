import Head from "next/head";
import Link from "next/link";
import SnakeGame from "../components/SnakeGame";

export default function Game() {
    return (
        <>
            <Head>
                <title>The Arcade — Snake · Ocheverse</title>
                <meta name="description" content="Bored? Kill some latency with a quick game of Snake." />
            </Head>

            <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">

                {/* Masthead row */}
                <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                    <div>
                        The Arcade · <b className="text-ink font-medium">Insert 01</b>
                    </div>
                    <div className="inline-flex items-center gap-2 text-ink">
                        <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{ background: "var(--green-live)" }}
                            aria-hidden="true"
                        />
                        Ready · use arrow keys
                    </div>
                </div>

                {/* Hero */}
                <section className="pt-16 pb-12 grid gap-y-8 lg:grid-cols-[5fr_2fr] gap-x-10 items-end">
                    <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
                            <span className="w-11 h-0.5 bg-ink inline-block" />
                            Filed under — Arcade
                        </div>
                        <h1
                            className="ed-headline m-0"
                            style={{ fontSize: "clamp(46px, 8.6vw, 120px)", lineHeight: 0.96 }}
                        >
                            <em style={{ color: "var(--green)" }}>Terminal</em> Snake.
                            <br />
                            Kill some <em style={{ color: "var(--red)" }}>latency</em>.
                        </h1>
                    </div>
                    <p className="font-editorial italic text-ink-soft text-[16px] leading-relaxed max-w-[36ch]">
                        The oldest game in engineering. Also the metaphor most of us live by.
                        Eat the pixels, don&rsquo;t hit the wall.
                    </p>
                </section>

                {/* Cabinet */}
                <div className="pt-4 border-t border-rule-strong">
                    <div className="mb-8 pb-3 border-b border-rule flex items-baseline justify-between gap-4">
                        <div>
                            <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">
                                Press ▶ to play
                            </div>
                            <h2
                                className="font-editorial italic font-normal m-0 leading-none tracking-tight"
                                style={{ fontSize: 32, color: "var(--green)" }}
                            >
                                Cabinet
                            </h2>
                        </div>
                        <Link
                            href="/2048"
                            className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft hover:text-ed-blue transition-colors"
                        >
                            Try 2048 →
                        </Link>
                    </div>

                    {/* Arcade screen — dark inset panel */}
                    <div
                        className="mx-auto max-w-[640px] p-6 sm:p-10 flex flex-col items-center"
                        style={{
                            background: "color-mix(in oklab, var(--ink) 92%, var(--paper))",
                            color: "var(--paper)",
                            border: "1px solid var(--rule-strong)",
                            boxShadow: "6px 6px 0 var(--rule-strong)",
                        }}
                    >
                        <div className="w-full flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] opacity-70 mb-5">
                            <span>~ / terminal-snake</span>
                            <span className="inline-flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--red)" }} />
                                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#f5c744" }} />
                                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--green-live)" }} />
                            </span>
                        </div>
                        <SnakeGame />
                    </div>

                    <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft text-center pt-8">
                        Written in a browser · No score is saved · Reload to start over
                    </p>
                </div>
            </div>
        </>
    );
}
