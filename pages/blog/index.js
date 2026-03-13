import Head from "next/head";
import { createParser } from "../../lib/rssParser";
import Link from "next/link";
import { useState } from "react";

// Helper function to extract the first image from HTML content
const extractImage = (content) => {
  if (!content) return null;
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const match = imgRegex.exec(content);
  return match ? match[1] : null;
};

const extractExcerpt = (content, maxLen = 155) => {
  if (!content) return '';
  const text = content.replace(/<[^>]*>?/gm, '').trim();
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
};

const mapFeedItem = (item, source) => {
  let slug = item.link.split('/').pop();
  if (slug.includes('?')) slug = slug.split('?')[0];
  const rawContent = item['content:encoded'] || item.content || '';
  return {
    title: item.title,
    link: item.link,
    coverImage: extractImage(rawContent) || null,
    isoDate: item.isoDate || new Date(item.pubDate).toISOString(),
    slug,
    source,
    excerpt: extractExcerpt(rawContent),
    readingTime: Math.ceil((rawContent.replace(/<[^>]*>?/gm, '').split(/\s+/).length) / 200) || 1
  };
};

export async function getStaticProps() {
  const parser = createParser();

  let ocheverseItems = [];
  let bpurItems = [];

  try {
    const ocheverseFeed = await parser.parseURL("https://ocheverse.substack.com/feed");
    ocheverseItems = ocheverseFeed.items.map(item => mapFeedItem(item, 'ocheverse'));
  } catch (e) {
    console.error("Failed to fetch Ocheverse feed", e);
  }

  try {
    const bpurFeed = await parser.parseURL("https://bpur.substack.com/feed");
    bpurItems = bpurFeed.items.map(item => mapFeedItem(item, 'bpur'));
  } catch (e) {
    console.error("Failed to fetch BPUR feed", e);
  }

  return {
    props: {
      ocheversePosts: ocheverseItems,
      bpurPosts: bpurItems,
    },
    revalidate: 3600
  };
}

const INITIAL_COUNT = 6;

export default function Blog({ ocheversePosts, bpurPosts }) {
  const [showAllOcheverse, setShowAllOcheverse] = useState(false);
  const [showAllBpur, setShowAllBpur] = useState(false);

  const visibleOcheverse = showAllOcheverse ? ocheversePosts : ocheversePosts.slice(0, INITIAL_COUNT);
  const visibleBpur = showAllBpur ? bpurPosts : bpurPosts.slice(0, INITIAL_COUNT);

  return (
    <>
      <Head>
        <title>Blog – Ocheverse</title>
        <meta name="description" content="Read the latest engineering stories and essays from David Gideon." />
        <meta property="og:title" content="Blog – Ocheverse" />
        <meta property="og:description" content="Engineering war stories, philosophical essays, and everything in between." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ocheverse.ng/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog – Ocheverse" />
        <meta name="twitter:description" content="Engineering war stories, philosophical essays, and everything in between." />
        <link rel="alternate" type="application/rss+xml" title="Ocheverse Blog RSS" href="/api/feed" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 pb-20 animate-fade-in-down">

        {/* Hero / Header */}
        <div className="py-20 text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm">
            The Ocheverse Archives
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Engineering war stories, philosophical essays, and everything in between.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-24">

          {/* Ocheverse Blog Section */}
          <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl filter drop-shadow-md">✍🏽</span>
                <div>
                  <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400">Ocheverse</h2>
                  <p className="text-gray-500 font-medium">Engineering & DevOps Stories</p>
                </div>
              </div>
              <a href="https://ocheverse.substack.com" target="_blank" className="hidden sm:inline-block text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all">
                View on Substack →
              </a>
            </div>

            {/* Grid: 2 columns on mobile, 3 on large screens */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {visibleOcheverse.map((post, i) => (
                <BlogCard key={i} post={post} category="Engineering" colorClass="blue" delay={i * 0.05} />
              ))}
            </div>

            {ocheversePosts.length > INITIAL_COUNT && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAllOcheverse(!showAllOcheverse)}
                  className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all"
                >
                  {showAllOcheverse ? '← Show Less' : `Show All ${ocheversePosts.length} Posts →`}
                </button>
              </div>
            )}

            <div className="mt-4 text-center sm:hidden">
              <a href="https://ocheverse.substack.com" target="_blank" className="text-blue-600 font-semibold hover:underline">
                View all on Substack →
              </a>
            </div>
          </section>

          {/* Newsletter CTA Break */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl transform hover:scale-[1.01] transition-transform duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Don't Miss the Next Story</h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Join dozens of engineers reading about the chaotic beauty of distributed systems and life lessons.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="https://ocheverse.substack.com/subscribe" target="_blank" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                Subscribe to Ocheverse
              </a>
              <a href="https://bpur.substack.com/subscribe" target="_blank" className="bg-purple-800 bg-opacity-30 text-white border-2 border-purple-400 font-bold py-3 px-8 rounded-full hover:bg-purple-800 hover:bg-opacity-50 transition-colors">
                Subscribe to BPUR
              </a>
            </div>
          </section>

          {/* BPUR Blog Section */}
          <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl filter drop-shadow-md">🧠</span>
                <div>
                  <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-400">BPUR</h2>
                  <p className="text-gray-500 font-medium">Big Picture, Unfiltered, Real</p>
                </div>
              </div>
              <a href="https://bpur.substack.com" target="_blank" className="hidden sm:inline-block text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-all">
                View on Substack →
              </a>
            </div>

            {/* Grid: 2 columns on mobile, 3 on large screens */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {visibleBpur.map((post, i) => (
                <BlogCard key={i} post={post} category="Essay" colorClass="purple" delay={i * 0.05} />
              ))}
            </div>

            {bpurPosts.length > INITIAL_COUNT && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAllBpur(!showAllBpur)}
                  className="text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-all"
                >
                  {showAllBpur ? '← Show Less' : `Show All ${bpurPosts.length} Posts →`}
                </button>
              </div>
            )}

            <div className="mt-4 text-center sm:hidden">
              <a href="https://bpur.substack.com" target="_blank" className="text-purple-600 font-semibold hover:underline">
                View all on Substack →
              </a>
            </div>
          </section>

        </div>
      </main>

      {/* Simple Inline Styles for Animations (Quick wins without extra CSS files) */}
      <style jsx global>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        .animate-slide-up {
          opacity: 0;
          animation: slideUp 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
}

// Reusable Card Component
function BlogCard({ post, category, colorClass, delay }) {
  const date = new Date(post.isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit' // Shorter date for mobile space
  });

  const borderColor = colorClass === 'blue' ? 'border-blue-500' : 'border-purple-500';
  const bgColor = colorClass === 'blue' ? 'bg-blue-600' : 'bg-purple-600';
  const textColor = colorClass === 'blue' ? 'text-blue-600' : 'text-purple-600';
  const groupHoverText = colorClass === 'blue' ? 'group-hover:text-blue-500 dark:group-hover:text-blue-400' : 'group-hover:text-purple-500 dark:group-hover:text-purple-400';

  return (
    <Link
      href={`/blog/${post.source}/${post.slug}`}
      className={`group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full animate-slide-up`}
      style={{ animationDelay: `${0.2 + delay}s` }}
    >
      {/* Image Area - Reduced height on mobile to fit 2 cols */}
      <div className="h-28 sm:h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center opacity-20 ${bgColor}`}>
            <span className="text-2xl sm:text-4xl">📄</span>
          </div>
        )}
      </div>

      {/* Content Area - Compact padding for mobile */}
      <div className={`p-3 sm:p-6 flex flex-col flex-grow border-b-4 ${borderColor}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 text-xs sm:text-sm">
          <span className={`font-bold ${textColor} uppercase tracking-wider text-[10px] sm:text-xs truncate`}>{category}</span>
          <div className="text-gray-500 dark:text-gray-400 whitespace-nowrap space-x-1 sm:space-x-2">
            <span>{date}</span>
            <span className="hidden sm:inline">·</span>
            <span>{post.readingTime || 1} min read</span>
          </div>
        </div>

        <h3 className={`text-sm sm:text-xl font-bold mb-2 sm:mb-3 leading-tight ${groupHoverText} transition-colors line-clamp-3`}>
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
