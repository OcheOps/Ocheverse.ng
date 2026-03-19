import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function NowPlaying() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchNowPlaying = () =>
            fetch('/api/now-playing')
                .then((r) => r.json())
                .then(setData)
                .catch(() => {});

        fetchNowPlaying();
        const interval = setInterval(fetchNowPlaying, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!data) {
        return <div className="animate-pulse h-20 w-full bg-gray-100 dark:bg-gray-800 rounded-2xl" />;
    }

    return (
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800/50 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full max-w-xl mx-auto backdrop-blur-sm transition-all hover:scale-[1.01]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                {data.albumImageUrl ? (
                    <Image
                        src={data.albumImageUrl}
                        alt={data.album || 'Album art'}
                        fill
                        className={`rounded-lg object-cover shadow-md ${data.isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full bg-green-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                    </div>
                )}

                <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5">
                    <div className={`w-3 h-3 rounded-full ${data.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-bold text-green-600 dark:text-green-400 tracking-widest mb-1">
                    {data.isPlaying ? '♫ Now Playing' : 'Spotify · Offline'}
                </p>

                {data.title ? (
                    <>
                        <a href={data.songUrl} target="_blank" rel="noopener noreferrer" className="block truncate hover:underline">
                            <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg truncate leading-tight">
                                {data.title}
                            </h3>
                        </a>
                        <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                            {data.artist}
                        </p>
                    </>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Not listening to anything right now</p>
                )}
            </div>

            {data.isPlaying && (
                <div className="flex gap-[3px] items-end h-5 flex-shrink-0">
                    {[1, 1.2, 0.8, 1.1].map((dur, i) => (
                        <span
                            key={i}
                            className="w-[3px] bg-green-500 rounded-full"
                            style={{
                                animation: `nowPlayingBar ${dur}s ease-in-out infinite`,
                                animationDelay: `${i * 0.1}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            <style jsx>{`
                @keyframes nowPlayingBar {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
            `}</style>
        </div>
    );
}
