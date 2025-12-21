import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check local storage or system preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    const isActive = (path) => router.pathname === path;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'Learn', path: '/learn' },
        { name: 'Snake 🐍', path: '/game' },
    ];

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-full shadow-2xl px-6 py-3 flex items-center gap-8 transition-all hover:scale-[1.02] duration-300">

                {/* Minimal Logo */}
                <Link href="/" className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Ocheverse
                </Link>

                {/* Desktop Links */}
                <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                href={link.path}
                                className={`transition-colors relative ${isActive(link.path)
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                    }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
                                )}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <a href="/DavidGideonNdfrekeabasi.pdf" download className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            CV
                        </a>
                    </li>
                    <li>
                        <a href="mailto:ocheworks@gmail.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            Contact
                        </a>
                    </li>

                    {/* Dark Mode Toggle */}
                    <li>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDark ? '🌙' : '☀️'}
                        </button>
                    </li>
                </ul>

                {/* Mobile Toggle (Simple Dot Menu) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-gray-600 dark:text-gray-300"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>

                {/* Mobile Dropdown (Absolute) */}
                {isOpen && (
                    <div className="absolute top-16 right-0 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 flex flex-col gap-1 md:hidden">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                className="block px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <a href="/DavidGideonNdfrekeabasi.pdf" download className="block px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Download CV</a>
                        <a href="mailto:ocheworks@gmail.com" className="block px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Contact</a>
                        <button onClick={toggleTheme} className="block w-full text-left px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                            {isDark ? 'Switch to Light' : 'Switch to Dark'}
                        </button>
                    </div>
                )}
            </nav>
        </div>
    );
}
