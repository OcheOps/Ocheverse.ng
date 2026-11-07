// Renders a guide's block list (see data/guides.js) in the editorial style.

// `inline code` inside paragraphs
function Inline({ text }) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={i}
        className="font-mono text-[0.86em] px-1.5 py-0.5 rounded-[3px]"
        style={{ background: "color-mix(in oklab, var(--ink) 8%, transparent)" }}
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function GuideBody({ blocks }) {
  return (
    <div className="font-editorial text-ink text-[18.5px] leading-[1.7] max-w-[68ch]">
      {blocks.map((b, i) => {
        if (b.h2) {
          const id = b.h2.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return (
            <h2 key={i} id={id} className="font-editorial italic font-normal text-ink text-[30px] leading-tight mt-12 mb-4 scroll-mt-24">
              {b.h2}
            </h2>
          );
        }
        if (b.p) {
          return (
            <p key={i} className="m-0 mb-5">
              <Inline text={b.p} />
            </p>
          );
        }
        if (b.code) {
          return (
            <div key={i} className="mb-6 -mx-1 sm:mx-0">
              {b.lang && (
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft mb-1.5">{b.lang}</div>
              )}
              <pre
                className="m-0 p-4 sm:p-5 overflow-x-auto text-[13.5px] leading-[1.6] rounded-[4px]"
                style={{ background: "color-mix(in oklab, var(--ink) 92%, var(--paper))", color: "var(--paper)" }}
              >
                <code className="font-mono">{b.code}</code>
              </pre>
            </div>
          );
        }
        if (b.list) {
          return (
            <ul key={i} className="m-0 mb-6 pl-0 list-none flex flex-col gap-2">
              {b.list.map((item, j) => (
                <li key={j} className="grid grid-cols-[22px_1fr]">
                  <span className="text-ed-red" aria-hidden="true">◇</span>
                  <span><Inline text={item} /></span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.note) {
          return (
            <aside
              key={i}
              className="mb-6 pl-4 py-1 border-l-2 italic text-ink-soft text-[16.5px]"
              style={{ borderColor: "var(--green)" }}
            >
              <span className="not-italic font-mono text-[10px] uppercase tracking-[0.16em] text-ed-green block mb-1">Note</span>
              <Inline text={b.note} />
            </aside>
          );
        }
        return null;
      })}
    </div>
  );
}
