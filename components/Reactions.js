import { useState, useEffect } from 'react';

const REACTION_EMOJIS = {
  fire: { emoji: '🔥', label: 'Fire' },
  rocket: { emoji: '🚀', label: 'Rocket' },
  brain: { emoji: '🧠', label: 'Big Brain' },
  heart: { emoji: '❤️', label: 'Love' },
  clap: { emoji: '👏', label: 'Clap' },
};

export default function Reactions({ slug }) {
  const [counts, setCounts] = useState({});
  const [reacted, setReacted] = useState({});
  const [animating, setAnimating] = useState(null);

  useEffect(() => {
    fetch(`/api/reactions?slug=${slug}`)
      .then((r) => r.json())
      .then(setCounts)
      .catch(() => {});

    const saved = localStorage.getItem(`reactions-${slug}`);
    if (saved) setReacted(JSON.parse(saved));
  }, [slug]);

  const handleReaction = async (reaction) => {
    if (reacted[reaction]) return;

    setAnimating(reaction);
    setTimeout(() => setAnimating(null), 600);

    const newReacted = { ...reacted, [reaction]: true };
    setReacted(newReacted);
    localStorage.setItem(`reactions-${slug}`, JSON.stringify(newReacted));

    try {
      const res = await fetch(`/api/reactions?slug=${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction }),
      });
      const data = await res.json();
      setCounts(data);
    } catch {}
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {Object.entries(REACTION_EMOJIS).map(([key, { emoji, label }]) => (
        <button
          key={key}
          onClick={() => handleReaction(key)}
          disabled={reacted[key]}
          title={label}
          className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
            reacted[key]
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-default'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 hover:scale-110 active:scale-95 cursor-pointer shadow-sm'
          } ${animating === key ? 'animate-bounce' : ''}`}
        >
          <span className={`text-lg ${animating === key ? 'animate-ping' : ''}`}>{emoji}</span>
          <span className="tabular-nums">{counts[key] || 0}</span>
        </button>
      ))}
    </div>
  );
}
