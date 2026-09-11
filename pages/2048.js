import Head from "next/head";
import Link from "next/link";
import Game2048 from "../components/Game2048";

export default function Game2048Page() {
    return (
        <>
            <Head>
                <title>The Arcade — 2048 · Ocheverse</title>
                <meta name="description" content="Logic. Strategy. Patience. Play the classic 2048." />
            </Head>

            <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">

                {/* Masthead row */}
                <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                    <div>
                        The Arcade · <b className="text-ink font-medium">Insert 02</b>
                    </div>
                    <div className="inline-flex items-center gap-2 text-ink">
                        <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{ background: "var(--red)" }}
                            aria-hidden="true"
                        />
                        Swipe / arrow keys
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
                            <em style={{ color: "var(--blue)" }}>Logic</em>.{" "}
                            <em style={{ color: "var(--green)" }}>Strategy</em>.{" "}
                            <em style={{ color: "var(--red)" }}>Patience</em>.
                        </h1>
                    </div>
                    <p className="font-editorial italic text-ink-soft text-[16px] leading-relaxed max-w-[36ch]">
                        Combine the tiles until one of them says <em className="not-italic" style={{ color: "var(--ink)" }}>2048</em>.
                        The math is trivial. The board is not.
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
                                style={{ fontSize: 32, color: "var(--red)" }}
                            >
                                Cabinet
                            </h2>
                        </div>
                        <Link
                            href="/game"
                            className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft hover:text-ed-green transition-colors"
                        >
                            ← Try Snake
                        </Link>
                    </div>

                    <div
                        className="mx-auto max-w-[520px] p-6 sm:p-10 flex flex-col items-center"
                        style={{
                            background: "color-mix(in oklab, var(--ink) 92%, var(--paper))",
                            color: "var(--paper)",
                            border: "1px solid var(--rule-strong)",
                            boxShadow: "6px 6px 0 var(--rule-strong)",
                        }}
                    >
                        <div className="w-full flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] opacity-70 mb-5">
                            <span>~ / 2048</span>
                            <span className="inline-flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--red)" }} />
                                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#f5c744" }} />
                                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--green-live)" }} />
                            </span>
                        </div>
                        <Game2048 />
                    </div>

                    <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft text-center pt-8">
                        Reload the page to reset the board
                    </p>
                </div>
            </div>
        </>
    );
}
