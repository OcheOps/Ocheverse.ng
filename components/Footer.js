import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full py-8 text-center bg-transparent">
            <div className="flex justify-center gap-6 mb-4 text-gray-400">
                <a href="https://github.com/OcheOps" target="_blank" className="hover:text-gray-900 dark:hover:text-white transition-colors">GitHub</a>
                <a href="https://www.linkedin.com/in/gideonodavid/" target="_blank" className="hover:text-gray-900 dark:hover:text-white transition-colors">LinkedIn</a>
                <a href="mailto:ocheworks@gmail.com" className="hover:text-gray-900 dark:hover:text-white transition-colors">Email</a>
            </div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-gray-400">
                    © {new Date().getFullYear()} Ocheverse.ng
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    All Systems Operational
                </div>
            </div>
        </footer>
    );
}
