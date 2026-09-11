import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [todayShort, setTodayShort] = useState('');
    const router = useRouter();

    // Sync theme: keep Tailwind's .dark class AND [data-theme] in step
    useEffect(() => {
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const dark = stored ? stored === 'dark' : prefersDark;
        applyTheme(dark);
        setTodayShort(
            new Date().toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
            })
        );
    }, []);

    const applyTheme = (dark) => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
        }
        setIsDark(dark);
    };

    const toggleTheme = () => {
        const next = !isDark;
        localStorage.setItem('theme', next ? 'dark' : 'light');
        applyTheme(next);
    };

    const isActive = (path) =>
        path === '/' ? router.pathname === '/' : router.pathname.startsWith(path);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Archive', path: '/blog' },
        { name: 'Now', path: '/now' },
        { name: 'Stack', path: '/stack' },
        { name: 'Music', path: '/music' },
        { name: 'Guestbook', path: '/guestbook' },
        { name: 'Resources', path: '/resources' },
    ];

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-rule-strong"
            style={{ background: 'color-mix(in oklab, var(--paper) 88%, transparent)' }}
        >
            <div className="max-w-[1240px] mx-auto px-5 sm:px-10 h-[60px] grid grid-cols-[1fr_auto_1fr] items-center gap-6">

                {/* Left: issue meta */}
                <div className="hidden md:flex gap-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-soft">
                    <span>Est. <b className="text-ink font-medium">2024</b></span>
                    <span>·</span>
                    <span>Lagos · <b className="text-ink font-medium">{todayShort || '—'}</b></span>
                </div>

                {/* Brand */}
                <Link
                    href="/"
                    data-easter-egg
                    className="justify-self-center inline-flex items-center gap-2 font-editorial italic text-[22px] text-ink leading-none"
                >
                    <span className="inline-block w-2 h-2 rounded-full bg-ed-red" aria-hidden="true" />
                    Ocheverse
                </Link>

                {/* Right: nav */}
                <nav className="hidden md:flex items-center gap-4 justify-end font-mono text-[11px] uppercase tracking-[0.12em]" aria-label="Primary">
                    {navLinks.slice(1).map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`relative py-1 transition-colors ${
                                isActive(link.path) ? 'text-ink' : 'text-ink-soft hover:text-ink'
                            }`}
                        >
                            {link.name}
                            {isActive(link.path) && (
                                <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-ed-blue" />
                            )}
                        </Link>
                    ))}

                    <span className="w-px h-4 bg-rule-strong mx-1" aria-hidden="true" />

                    <a
                        href="/DavidGideonNdfrekeabasi.pdf"
                        download
                        className="text-ink-soft hover:text-ink transition-colors"
                    >
                        CV
                    </a>

                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle color theme"
                        className="ml-1 inline-flex items-center gap-1.5 px-2.5 py-1 border border-rule-strong rounded-full hover:bg-paper-2 transition-colors"
                    >
                        <span
                            className="inline-block w-2.5 h-2.5 rounded-full border border-rule-strong"
                            style={{
                                background: isDark
                                    ? 'linear-gradient(135deg, var(--paper) 50%, transparent 50%)'
                                    : 'linear-gradient(135deg, var(--ed-blue, var(--blue)) 50%, var(--paper) 50%)',
                            }}
                            aria-hidden="true"
                        />
                        <span className="text-[10px] text-ink-soft">{isDark ? 'Dark' : 'Light'}</span>
                    </button>
                </nav>

                {/* Mobile toggle */}
                <button
                    onClick={() => setIsOpen((v) => !v)}
                    className="md:hidden justify-self-end text-ink"
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isOpen ? (
                            <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                        ) : (
                            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-rule-strong bg-paper">
                    <nav className="max-w-[1240px] mx-auto px-5 py-4 flex flex-col gap-1 font-mono text-[12px] uppercase tracking-[0.12em]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`py-2 border-b border-rule ${
                                    isActive(link.path) ? 'text-ink' : 'text-ink-soft'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <a href="/DavidGideonNdfrekeabasi.pdf" download className="py-2 border-b border-rule text-ink-soft">
                            Download CV
                        </a>
                        <a href="mailto:ocheworks@gmail.com" className="py-2 border-b border-rule text-ink-soft">
                            Contact
                        </a>
                        <button
                            onClick={toggleTheme}
                            className="py-2 text-left text-ink-soft"
                        >
                            {isDark ? 'Switch to Light' : 'Switch to Dark'}
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
}
