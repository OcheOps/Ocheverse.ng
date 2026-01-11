import useSWR from 'swr';
import Image from 'next/image';
import { useEffect } from 'react';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function NowPlaying() {
    const { data, error } = useSWR('/api/now-playing', fetcher, {
        refreshInterval: 10000
    });

    if (error) return <div />;
    if (!data) return <div className="animate-pulse h-16 w-full bg-gray-100 dark:bg-gray-800 rounded-lg" />;

    return (
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800/50 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full max-w-xl mx-auto backdrop-blur-sm transition-all hover:scale-[1.01]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                {data.albumImageUrl ? (
                    <Image
                        src={data.albumImageUrl}
                        alt={data.album}
                        fill
                        className={`rounded-lg object-cover shadow-md ${data.isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
                    />
                ) : (
                    <div className="w-full h-full bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-3xl">🎵</span>
                    </div>
                )}

                {/* Status Dot */}
                <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1">
                    <div className={`w-3 h-3 rounded-full ${data.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-1">
                    {data.isPlaying ? 'Now Playing' : 'Last Played / Offline'}
                </p>

                <a href={data.songUrl ?? '#'} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate leading-tight">
                        {data.title || 'Not Listening'}
                    </h3>
                </a>

                <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
                    {data.artist || 'Spotify'}
                </p>
            </div>

            {/* Equalizer Animation */}
            {data.isPlaying && (
                <div className="flex gap-1 items-end h-6 mx-2">
                    <span className="w-1 bg-green-500 rounded-t animate-[music_1s_ease-in-out_infinite]"></span>
                    <span className="w-1 bg-green-500 rounded-t animate-[music_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-1 bg-green-500 rounded-t animate-[music_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1 bg-green-500 rounded-t animate-[music_1.1s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }}></span>
                </div>
            )}

            <div className="ml-auto">
                <a href={data.songUrl ?? '#'} target="_blank" className="text-2xl text-green-500 hover:scale-110 transition-transform block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.38-1.381 9.841-.721 13.441 1.441.421.3.6.84.3 1.38zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                </a>
            </div>

            <style jsx>{`
        @keyframes music {
            0%, 100% { height: 20%; }
            50% { height: 100%; }
        }
      `}</style>
        </div>
    );
}
