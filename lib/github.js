// Enrich projects with live GitHub data at build time. Falls back to the
// static fields in data/career.js if GitHub is unreachable or rate-limited.
export async function enrichProjects(projects) {
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  return Promise.all(
    projects.map(async (p) => {
      const base = { ...p, url: `https://github.com/${p.repo}`, stars: null, language: null, pushedAt: null };
      try {
        const res = await fetch(`https://api.github.com/repos/${p.repo}`, { headers });
        if (!res.ok) return base;
        const r = await res.json();
        return {
          ...base,
          stars: r.stargazers_count ?? null,
          language: r.language ?? null,
          pushedAt: r.pushed_at ?? null,
        };
      } catch {
        return base;
      }
    })
  );
}

// "updated this week" / "updated 3 months ago" — recruiters read recency as activity
export function recency(iso) {
  if (!iso) return null;
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return "updated today";
  if (days < 7) return "updated this week";
  if (days < 31) return `updated ${Math.floor(days / 7)} week${days < 14 ? "" : "s"} ago`;
  if (days < 365) return `updated ${Math.floor(days / 30)} month${days < 60 ? "" : "s"} ago`;
  return null; // older than a year: don't advertise it
}
