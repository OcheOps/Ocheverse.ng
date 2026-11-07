import { recency } from "../lib/github";

export default function ProjectCard({ p }) {
  const fresh = recency(p.pushedAt);
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      className="ed-post group flex flex-col border border-rule-strong p-6 hover:-translate-y-0.5 transition-transform"
      style={{ background: "color-mix(in oklab, var(--paper-2) 45%, transparent)" }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft flex flex-wrap gap-x-2">
        {p.language && <span>{p.language}</span>}
        {fresh && (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-ed-green">{fresh}</span>
          </>
        )}
        {p.showStars && p.stars ? (
          <>
            <span aria-hidden="true">·</span>
            <span>★ {p.stars}</span>
          </>
        ) : null}
      </div>
      <div className="ed-title-link font-editorial italic text-ink text-[26px] leading-tight mt-2 self-start">{p.name}</div>
      <p className="font-editorial text-ink-soft text-[15px] leading-snug mt-2 mb-4">{p.tagline}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <span key={s} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft border border-rule px-2 py-0.5">
            {s}
          </span>
        ))}
      </div>
    </a>
  );
}
