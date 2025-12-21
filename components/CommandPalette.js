import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Toggle with Ctrl+K or Cmd+K
    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command) => {
        setOpen(false);
        command();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) setOpen(false);
            }}
        >
            <div className="w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <Command.Input
                    className="w-full px-4 py-3 text-lg border-b border-gray-100 dark:border-gray-800 outline-none bg-transparent dark:text-white placeholder-gray-400"
                    placeholder="Type a command or search..."
                />

                <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-py-2">
                    <Command.Empty className="p-4 text-center text-sm text-gray-500">No results found.</Command.Empty>

                    <Command.Group heading="Pages" className="text-xs font-bold text-gray-400 dark:text-gray-500 px-2 py-1 mb-1">
                        <Item onSelect={() => runCommand(() => router.push('/'))} icon="🏠">Home</Item>
                        <Item onSelect={() => runCommand(() => router.push('/blog'))} icon="✍️">Blog</Item>
                        <Item onSelect={() => runCommand(() => router.push('/learn'))} icon="🎓">Learn</Item>
                        <Item onSelect={() => runCommand(() => router.push('/game'))} icon="🐍">Snake Game</Item>
                    </Command.Group>

                    <Command.Group heading="Socials" className="text-xs font-bold text-gray-400 dark:text-gray-500 px-2 py-1 mb-1 mt-2">
                        <Item onSelect={() => runCommand(() => window.open('https://github.com/OcheOps', '_blank'))} icon="🐙">GitHub</Item>
                        <Item onSelect={() => runCommand(() => window.open('https://www.linkedin.com/in/gideonodavid/', '_blank'))} icon="💼">LinkedIn</Item>
                        <Item onSelect={() => runCommand(() => window.open('mailto:ocheworks@gmail.com', '_self'))} icon="✉️">Email Me</Item>
                    </Command.Group>

                    <Command.Group heading="Actions" className="text-xs font-bold text-gray-400 dark:text-gray-500 px-2 py-1 mb-1 mt-2">
                        <Item onSelect={() => runCommand(() => {
                            const link = document.createElement('a');
                            link.href = '/DavidGideonNdfrekeabasi.pdf';
                            link.download = 'DavidGideonNdfrekeabasi.pdf';
                            link.click();
                        })} icon="📄">Download CV</Item>

                        <Item onSelect={() => runCommand(() => {
                            if (document.documentElement.classList.contains('dark')) {
                                document.documentElement.classList.remove('dark');
                                localStorage.theme = 'light';
                            } else {
                                document.documentElement.classList.add('dark');
                                localStorage.theme = 'dark';
                            }
                        })} icon="🌗">Toggle Theme</Item>
                    </Command.Group>

                </Command.List>

                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 flex justify-between">
                    <span>Navigation</span>
                    <span><kbd className="bg-gray-100 dark:bg-gray-800 px-1 rounded">esc</kbd> to close</span>
                </div>
            </div>
        </Command.Dialog>
    );
}

function Item({ children, icon, onSelect }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-300 transition-colors"
        >
            <span className="text-base">{icon}</span>
            {children}
        </Command.Item>
    );
}
