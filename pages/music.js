import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import NowPlaying from '../components/NowPlaying';

const TIME_RANGES = [
  { key: 'short_term', label: 'Last 4 Weeks' },
  { key: 'medium_term', label: 'Last 6 Months' },
  { key: 'long_term', label: 'All Time' },
];

function formatDuration(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export default function Music() {
  const [tracks, setTracks] = useState([]);
  const [range, setRange] = useState('short_term');
  const [loading, setLoading] = useState(true);
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/top-tracks?range=${range}`)
      .then((r) => r.json())
      .then((data) => {
        setTracks(data.tracks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [range]);

  const handlePreview = (track) => {
    if (audio) {
      audio.pause();
      setAudio(null);
      if (hoveredTrack === track.rank) {
        setHoveredTrack(null);
        return;
      }
    }
    if (track.previewUrl) {
      const a = new Audio(track.previewUrl);
      a.volume = 0.3;
      a.play();
      setAudio(a);
      setHoveredTrack(track.rank);
      a.onended = () => { setHoveredTrack(null); setAudio(null); };
    }
  };

  useEffect(() => {
    return () => { if (audio) audio.pause(); };
  }, [audio]);

  return (
    <>
      <Head>
        <title>Music – Ocheverse</title>
        <meta name="description" content="What David Gideon is listening to on Spotify." />
        <meta property="og:title" content="Music – Ocheverse" />
        <meta property="og:description" content="What David Gideon is listening to on Spotify." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 pb-20">
        <div className="py-20 text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
            Music
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            What I've been vibing to. Live from Spotify.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <NowPlaying />

          <div className="flex justify-center gap-2">
            {TIME_RANGES.map((tr) => (
              <button
                key={tr.key}
                onClick={() => setRange(tr.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  range === tr.key
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tr.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : tracks.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">No top tracks data available yet.</p>
              <p className="text-sm mt-2">Spotify needs more listening history to generate this.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tracks.map((track) => (
                <div
                  key={track.rank}
                  onClick={() => handlePreview(track)}
                  className={`group flex items-center gap-4 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                    hoveredTrack === track.rank
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-lg shadow-green-500/10'
                      : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 hover:shadow-md'
                  }`}
                >
                  <span className={`w-8 text-center font-bold text-lg ${
                    track.rank <= 3 ? 'text-green-500' : 'text-gray-400'
                  }`}>
                    {track.rank}
                  </span>

                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                    {track.albumImageUrl && (
                      <Image
                        src={track.albumImageUrl}
                        alt={track.album}
                        fill
                        className={`rounded-lg object-cover ${hoveredTrack === track.rank ? 'animate-[spin_3s_linear_infinite]' : ''}`}
                        unoptimized
                      />
                    )}
                    {track.previewUrl && (
                      <div className={`absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 transition-opacity ${
                        hoveredTrack === track.rank ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <span className="text-white text-lg">{hoveredTrack === track.rank ? '⏸' : '▶'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <a href={track.songUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      className="font-semibold text-gray-900 dark:text-white truncate block hover:underline text-sm sm:text-base">
                      {track.title}
                    </a>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm truncate">{track.artist}</p>
                  </div>

                  <span className="text-xs text-gray-400 hidden sm:block">{formatDuration(track.duration)}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-xs text-gray-400 pt-4">
            {tracks.length > 0 && 'Click a track to preview • '}Data from Spotify API
          </p>
        </div>
      </main>
    </>
  );
}
