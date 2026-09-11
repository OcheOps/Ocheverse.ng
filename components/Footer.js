import Link from 'next/link';

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="relative z-[3] border-t border-rule-strong mt-24">
            <div className="max-w-[1240px] mx-auto px-5 sm:px-10 py-10 grid gap-6 md:grid-cols-3 items-end">

                {/* Left: colophon */}
                <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft space-y-1.5">
                    <div>Set in Georgia italic &amp; ui-monospace</div>
                    <div>Handmade with self-hosted runners &amp; Tailscale</div>
                    <div>Printed in <b className="text-ink font-medium">Lagos</b> · Est. 2024</div>
                </div>

                {/* Middle: signature */}
                <div className="justify-self-center text-center">
                    <p className="font-editorial italic text-[26px] text-ink leading-none m-0">
                        Signed<span className="text-ed-blue">,</span> Oche.
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                        <span className="ed-live-dot" aria-hidden="true" />
                        All systems operational
                    </div>
                </div>

                {/* Right: elsewhere */}
                <div className="md:justify-self-end font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft">
                    <div className="mb-2 text-ink">Elsewhere —</div>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 list-none p-0 m-0">
                        <li>
                            <a href="https://github.com/OcheOps" target="_blank" rel="noreferrer" className="hover:text-ed-blue transition-colors">GitHub</a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/gideonodavid/" target="_blank" rel="noreferrer" className="hover:text-ed-blue transition-colors">LinkedIn</a>
                        </li>
                        <li>
                            <a href="https://ocheverse.substack.com" target="_blank" rel="noreferrer" className="hover:text-ed-blue transition-colors">Ocheverse</a>
                        </li>
                        <li>
                            <a href="https://bpur.substack.com" target="_blank" rel="noreferrer" className="hover:text-ed-red transition-colors">BPUR</a>
                        </li>
                        <li>
                            <a href="mailto:ocheworks@gmail.com" className="hover:text-ed-blue transition-colors">Email</a>
                        </li>
                        <li>
                            <a href="/feed.xml" className="hover:text-ed-blue transition-colors">RSS</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-rule">
                <div className="max-w-[1240px] mx-auto px-5 sm:px-10 py-4 flex flex-wrap justify-between items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                    <span>© {year} · Ocheverse.ng</span>
                    <span>No trackers · No pop-ups · <Link href="/guestbook" className="text-ink hover:text-ed-blue">Leave a note</Link></span>
                </div>
            </div>
        </footer>
    );
}
