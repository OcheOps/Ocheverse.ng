import { useEffect } from 'react';

export default function CopyCodeButton() {
    useEffect(() => {
        const addButtons = () => {
            document.querySelectorAll('.prose pre').forEach((pre) => {
                if (pre.querySelector('.copy-btn')) return;

                const btn = document.createElement('button');
                btn.className = 'copy-btn absolute top-2 right-2 px-2 py-1 text-xs font-mono rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100';
                btn.textContent = 'Copy';

                pre.style.position = 'relative';
                pre.classList.add('group');
                pre.appendChild(btn);

                btn.addEventListener('click', async () => {
                    const code = pre.querySelector('code')?.textContent || pre.textContent;
                    try {
                        await navigator.clipboard.writeText(code);
                        btn.textContent = 'Copied!';
                        btn.classList.add('bg-green-600');
                        setTimeout(() => {
                            btn.textContent = 'Copy';
                            btn.classList.remove('bg-green-600');
                        }, 2000);
                    } catch {
                        btn.textContent = 'Failed';
                        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
                    }
                });
            });
        };

        // Run after content renders
        const timer = setTimeout(addButtons, 500);
        return () => clearTimeout(timer);
    }, []);

    return null;
}
