import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

// Shown once a reader has reached the end of a post (sentinel scrolled into
// view) AND spent a minimum amount of time on the page. Uses Substack's
// official signup embed so readers subscribe without leaving the site.
const MIN_READ_MS = 15000;
const SNOOZE_DAYS = 14;

const storageKey = (source) => `ocv:subscribe:${source}`;

function readPref(source) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(source)) || "null");
  } catch {
    return null;
  }
}

function writePref(source, state) {
  try {
    localStorage.setItem(storageKey(source), JSON.stringify({ state, at: Date.now() }));
  } catch {
    /* storage unavailable (private mode etc.) — popup just won't remember */
  }
}

function isSuppressed(source) {
  const pref = readPref(source);
  if (!pref) return false;
  if (pref.state === "subscribed") return true;
  if (pref.state === "dismissed") {
    return Date.now() - pref.at < SNOOZE_DAYS * 24 * 60 * 60 * 1000;
  }
  return false;
}

export default function SubscribePrompt({ source, sourceName, toneColor }) {
  const [open, setOpen] = useState(false);
  const sentinelRef = useRef(null);
  const dialogRef = useRef(null);
  const lastFocused = useRef(null);
  const shownThisView = useRef(false);

  // Trigger: reader has reached (or scrolled/jumped past) the end of the
  // article, and has been on the page long enough. A scroll check rather than
  // IntersectionObserver, which misses jumps straight past the marker.
  useEffect(() => {
    if (isSuppressed(source)) return;
    const start = Date.now();
    let timer;
    let frame;

    const check = () => {
      frame = null;
      const el = sentinelRef.current;
      if (!el || shownThisView.current) return;
      if (el.getBoundingClientRect().top > window.innerHeight) return; // not there yet
      shownThisView.current = true;
      window.removeEventListener("scroll", onScroll);
      const wait = Math.max(800, MIN_READ_MS - (Date.now() - start));
      timer = setTimeout(() => {
        if (!isSuppressed(source)) setOpen(true);
      }, wait);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    check(); // short posts may already show the end on load
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [source]);

  const close = useCallback(
    (state) => {
      writePref(source, state);
      setOpen(false);
    },
    [source]
  );

  // While open: Esc closes, body scroll locked, focus moved in and restored after
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement;
    dialogRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") close("dismissed");
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus?.();
    };
  }, [open, close]);

  return (
    <>
      {/* Invisible marker at the end of the article */}
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />

      {/* Portal to <body>: escapes the article's stacking context so the
          footer and navbar can't paint over the popup */}
      {open &&
        createPortal(
        <div
          className="ed-sub-backdrop fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ background: "color-mix(in oklab, var(--ink) 45%, transparent)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close("dismissed");
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscribe-prompt-title"
            tabIndex={-1}
            className="ed-sub-dialog relative w-full sm:max-w-[520px] max-h-[92vh] overflow-y-auto border border-rule-strong outline-none"
            style={{
              background: "var(--paper)",
              boxShadow: "8px 8px 0 var(--rule-strong)",
            }}
          >
            <button
              type="button"
              onClick={() => close("dismissed")}
              aria-label="Close"
              className="absolute top-3 right-3 w-9 h-9 grid place-items-center font-mono text-[14px] text-ink-soft hover:text-ink"
            >
              ✕
            </button>

            <div className="px-6 sm:px-8 pt-7 pb-5">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft mb-2 flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: toneColor }}
                  aria-hidden="true"
                />
                You made it to the end
              </div>
              <h2
                id="subscribe-prompt-title"
                className="font-editorial italic text-ink m-0 pr-8"
                style={{ fontSize: "clamp(26px, 5vw, 34px)", lineHeight: 1.05 }}
              >
                Get the next one from{" "}
                <em style={{ color: toneColor }}>{sourceName}</em> in your inbox.
              </h2>
              <p className="font-editorial italic text-ink-soft text-[15px] mt-3 mb-0">
                Free, weekly-ish, no spam. Unsubscribe in one click.
              </p>
            </div>

            {/* Substack's own signup form — readers never leave the site */}
            <div className="mx-6 sm:mx-8 mb-5 border border-rule">
              <iframe
                src={`https://${source}.substack.com/embed`}
                title={`Subscribe to ${sourceName}`}
                width="100%"
                height="320"
                style={{ border: 0, display: "block" }}
                scrolling="no"
              />
            </div>

            <div className="px-6 sm:px-8 pb-6 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
              <button
                type="button"
                onClick={() => close("dismissed")}
                className="text-ink-soft hover:text-ink py-2"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={() => close("subscribed")}
                className="text-ink-soft hover:text-ink py-2 border-b border-rule-strong"
              >
                I already subscribe
              </button>
            </div>
          </div>
        </div>,
          document.body
        )}

      <style jsx global>{`
        @keyframes ed-sub-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ed-sub-rise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ed-sub-backdrop { animation: ed-sub-fade 220ms ease-out; }
        .ed-sub-dialog { animation: ed-sub-rise 320ms cubic-bezier(0.22, 1, 0.36, 1); }
        @media (prefers-reduced-motion: reduce) {
          .ed-sub-backdrop, .ed-sub-dialog { animation: none; }
        }
      `}</style>
    </>
  );
}
