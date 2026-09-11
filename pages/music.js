import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import NowPlaying from "../components/NowPlaying";

const TIME_RANGES = [
  { key: "short_term", label: "Last 4 weeks" },
  { key: "medium_term", label: "Last 6 months" },
  { key: "long_term", label: "All time" },
];

function formatDuration(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function Music() {
  const [tracks, setTracks] = useState([]);
  const [range, setRange] = useState("short_term");
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);
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

  useEffect(() => () => { if (audio) audio.pause(); }, [audio]);

  const handlePreview = (track) => {
    if (audio) {
      audio.pause();
      setAudio(null);
      if (playing === track.rank) {
        setPlaying(null);
        return;
      }
    }
    if (track.previewUrl) {
      const a = new Audio(track.previewUrl);
      a.volume = 0.3;
      a.play();
      setAudio(a);
      setPlaying(track.rank);
      a.onended = () => { setPlaying(null); setAudio(null); };
    }
  };

  return (
    <>
      <Head>
        <title>The Charts — Ocheverse</title>
        <meta name="description" content="What David Gideon has been listening to on Spotify." />
        <meta property="og:title" content="The Charts — Ocheverse" />
        <meta property="og:description" content="What I've been vibing to. Live from Spotify." />
      </Head>

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-10 pt-6 pb-24">

        {/* Masthead row */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-3 border-y border-rule font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
          <div>
            The Charts · <b className="text-ink font-medium">Live from Spotify</b>
          </div>
          <div className="inline-flex items-center gap-2 text-ink">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: "var(--green-live)" }}
              aria-hidden="true"
            />
            Now spinning
          </div>
        </div>

        {/* Hero */}
        <section className="pt-16 pb-12 grid gap-y-8 lg:grid-cols-[5fr_2fr] gap-x-10 items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-4 flex items-center gap-3">
              <span className="w-11 h-0.5 bg-ink inline-block" />
              Sound-tracking the deploys
            </div>
            <h1
              className="ed-headline m-0"
              style={{ fontSize: "clamp(46px, 8.6vw, 120px)", lineHeight: 0.96 }}
            >
              What&rsquo;s been on{" "}
              <em style={{ color: "var(--red)" }}>heavy</em>{" "}
              <em style={{ color: "var(--green)" }}>rotation</em>.
            </h1>
          </div>
          <p className="font-editorial italic text-ink-soft text-[16px] leading-relaxed max-w-[36ch]">
            The unofficial soundtrack of every incident, essay, and Terraform apply.
          </p>
        </section>

        {/* Now playing */}
        <div className="pt-8 border-t border-rule-strong">
          <div className="mb-8 pb-3 border-b border-rule">
            <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">
              At the console
            </div>
            <h2
              className="font-editorial italic font-normal m-0 leading-none tracking-tight"
              style={{ fontSize: 32, color: "var(--green)" }}
            >
              Now playing
            </h2>
          </div>
          <div className="pb-14">
            <NowPlaying />
          </div>
        </div>

        {/* Range switcher */}
        <div className="pt-8 border-t border-rule-strong">
          <div className="mb-8 pb-3 border-b border-rule flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-soft mb-1">
                The chart
              </div>
              <h2
                className="font-editorial italic font-normal m-0 leading-none tracking-tight"
                style={{ fontSize: 32, color: "var(--red)" }}
              >
                Top tracks
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
              {TIME_RANGES.map((tr) => (
                <button
                  key={tr.key}
                  onClick={() => setRange(tr.key)}
                  className={`px-3 py-1 rounded-full border transition-colors ${
                    range === tr.key
                      ? "border-ink text-ink"
                      : "border-rule text-ink-soft hover:text-ink hover:border-rule-strong"
                  }`}
                >
                  {tr.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <ul className="list-none p-0 m-0">
              {[...Array(6)].map((_, i) => (
                <li key={i} className="grid grid-cols-[36px_56px_1fr_60px] gap-4 items-center py-4 border-b border-rule">
                  <div className="h-4 bg-rule rounded animate-pulse" />
                  <div className="w-14 h-14 bg-rule rounded animate-pulse" />
                  <div className="flex flex-col gap-2">
                    <div className="h-3.5 bg-rule rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-rule rounded w-1/2 animate-pulse" />
                  </div>
                  <div className="h-3 bg-rule rounded animate-pulse" />
                </li>
              ))}
            </ul>
          ) : tracks.length === 0 ? (
            <div className="text-center py-14">
              <p className="font-editorial italic text-ink text-[18px] mb-2">No top tracks yet.</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                Spotify needs more listening history to generate this.
              </p>
            </div>
          ) : (
            <ol className="list-none p-0 m-0">
              {tracks.map((track) => {
                const isPlaying = playing === track.rank;
                const isTop = track.rank <= 3;
                return (
                  <li key={track.rank}>
                    <div
                      onClick={() => handlePreview(track)}
                      role={track.previewUrl ? "button" : undefined}
                      tabIndex={track.previewUrl ? 0 : -1}
                      onKeyDown={(e) => {
                        if (track.previewUrl && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          handlePreview(track);
                        }
                      }}
                      className={`grid grid-cols-[36px_56px_1fr_auto] items-center gap-4 py-4 border-b border-rule transition-colors ${
                        track.previewUrl ? "cursor-pointer" : ""
                      } ${isPlaying ? "text-ink" : "hover:text-ink"}`}
                    >
                      <span
                        className={`font-editorial italic text-[24px] leading-none ${
                          isTop ? "" : "text-ink-soft"
                        }`}
                        style={isTop ? { color: "var(--red)" } : {}}
                      >
                        {String(track.rank).padStart(2, "0")}
                      </span>

                      <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden">
                        {track.albumImageUrl && (
                          <Image
                            src={track.albumImageUrl}
                            alt={track.album}
                            fill
                            className={`object-cover ${isPlaying ? "animate-[spin_3s_linear_infinite]" : ""}`}
                            unoptimized
                          />
                        )}
                        {track.previewUrl && (
                          <div
                            className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                              isPlaying ? "opacity-100" : "opacity-0 hover:opacity-100"
                            }`}
                            style={{ background: "color-mix(in oklab, var(--ink) 55%, transparent)" }}
                          >
                            <span className="font-mono text-[16px] text-paper">{isPlaying ? "⏸" : "▶"}</span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <a
                          href={track.songUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="ed-title-link font-editorial italic text-[18px] leading-tight text-ink block truncate max-w-full"
                        >
                          {track.title}
                        </a>
                        <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-soft truncate mt-1">
                          {track.artist}
                        </div>
                      </div>

                      <span className="font-mono text-[10.5px] tracking-[0.1em] text-ink-soft hidden sm:block whitespace-nowrap">
                        {formatDuration(track.duration)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft text-center pt-8">
            {tracks.length > 0 && "Click a track to preview · "}Data from the Spotify API
          </p>
        </div>
      </div>
    </>
  );
}
