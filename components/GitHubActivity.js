import { useState, useEffect } from 'react';

const EVENT_ICONS = {
  PushEvent: '⚡',
  CreateEvent: '✨',
  PullRequestEvent: '🔀',
  IssuesEvent: '🐛',
  WatchEvent: '⭐',
  ForkEvent: '🍴',
};

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export default function GitHubActivity() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/github')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse h-14 bg-gray-100 dark:bg-gray-700/50 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data?.activity?.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No recent GitHub activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.stats?.publicRepos && (
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9z"/></svg>
            {data.stats.publicRepos} repos
          </span>
          <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"/></svg>
            {data.stats.followers} followers
          </span>
        </div>
      )}

      <div className="space-y-2">
        {data.activity.map((event, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
            event.isPrivate
              ? 'bg-red-50/50 dark:bg-red-900/10 border border-dashed border-red-200 dark:border-red-900/30'
              : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}>
            <span className="text-lg mt-0.5 flex-shrink-0">
              {event.isPrivate ? '🔒' : EVENT_ICONS[event.type] || '📌'}
            </span>
            <div className="flex-1 min-w-0">
              {event.isPrivate ? (
                <p className="text-sm text-red-400 dark:text-red-300 italic">
                  {event.privateMessage}
                </p>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {event.action}{' '}
                  <a href={event.repoUrl} target="_blank" rel="noopener noreferrer"
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    {event.repo}
                  </a>
                </p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">{timeAgo(event.date)}</p>
            </div>
          </div>
        ))}
      </div>

      <a href="https://github.com/OcheOps" target="_blank" rel="noopener noreferrer"
        className="block text-center text-sm text-green-500 hover:text-green-400 transition-colors pt-2 font-medium">
        View full profile on GitHub →
      </a>
    </div>
  );
}
