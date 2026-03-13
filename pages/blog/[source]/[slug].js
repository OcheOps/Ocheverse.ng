import Head from "next/head";
import { createParser } from "../../../lib/rssParser";
import Link from "next/link";
import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import ReadingProgress from '../../../components/ReadingProgress';
import BackToTop from '../../../components/BackToTop';
import CopyCodeButton from '../../../components/CopyCodeButton';

export async function getStaticPaths() {
  const parser = createParser();
  let paths = [];

  const feeds = [
    { source: "ocheverse", url: "https://ocheverse.substack.com/feed" },
    { source: "bpur", url: "https://bpur.substack.com/feed" }
  ];

  for (const feed of feeds) {
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      const items = parsedFeed.items;
      items.forEach(item => {
        // extract slug from link, e.g., https://ocheverse.substack.com/p/the-slug
        const linkParts = item.link.split('/');
        let slug = linkParts[linkParts.length - 1]; // "the-slug"
        if (slug.includes('?')) {
          slug = slug.split('?')[0]; // remote query params if any
        }
        paths.push({
          params: { source: feed.source, slug: slug }
        });
      });
    } catch (error) {
      console.warn(`[RSS] Skipping ${feed.source} paths (will use fallback): ${error.message}`);
    }
  }

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { source, slug } = params;
  const parser = createParser();
  
  const feedUrl = source === 'ocheverse' 
    ? "https://ocheverse.substack.com/feed" 
    : "https://bpur.substack.com/feed";

  try {
    const feed = await parser.parseURL(feedUrl);
    
    // Find item with same slug in link
    const item = feed.items.find(i => {
       const linkParts = i.link.split('/');
       let itemSlug = linkParts[linkParts.length - 1];
       if (itemSlug.includes('?')) {
         itemSlug = itemSlug.split('?')[0];
       }
       return itemSlug === slug;
    });

    if (!item) {
      return { notFound: true };
    }

    let rawContent = item['content:encoded'] || item.content || '';
    const $ = cheerio.load(rawContent);
    const toc = [];

    $('h2, h3').each((i, el) => {
      const text = $(el).text();
      const slugId = slugify(text, { lower: true, strict: true }) || `heading-${i}`;
      $(el).attr('id', slugId);
      toc.push({
        id: slugId,
        text,
        level: el.tagName.toLowerCase() === 'h2' ? 2 : 3
      });
    });

    const parsedContent = $('body').html() || rawContent;

    const plainText = rawContent.replace(/<[^>]*>?/gm, '').trim();
    const excerpt = plainText.length > 155 ? plainText.slice(0, 155) + '...' : plainText;

    const imgMatch = rawContent.match(/<img[^>]+src="([^">]+)"/);
    const coverImage = imgMatch ? imgMatch[1] : null;

    const post = {
      title: item.title,
      content: parsedContent,
      toc,
      pubDate: item.isoDate || new Date(item.pubDate).toISOString(),
      link: item.link,
      author: item.creator || 'David Gideon',
      sourceName: source === 'ocheverse' ? 'Ocheverse' : 'BPUR',
      slug,
      source,
      excerpt,
      coverImage,
      readingTime: Math.ceil((plainText.split(/\s+/).length) / 200) || 1
    };

    // Related posts: up to 3 other posts from same feed
    const relatedPosts = feed.items
      .filter(i => {
        let s = i.link.split('/').pop();
        if (s.includes('?')) s = s.split('?')[0];
        return s !== slug;
      })
      .slice(0, 3)
      .map(i => {
        let s = i.link.split('/').pop();
        if (s.includes('?')) s = s.split('?')[0];
        const raw = i['content:encoded'] || i.content || '';
        const img = raw.match(/<img[^>]+src="([^">]+)"/);
        return {
          title: i.title,
          slug: s,
          source,
          coverImage: img ? img[1] : null,
          readingTime: Math.ceil((raw.replace(/<[^>]*>?/gm, '').split(/\s+/).length) / 200) || 1,
        };
      });

    return {
      props: { post, relatedPosts },
      revalidate: 3600
    };
  } catch (error) {
    console.warn(`[RSS] Post ${source}/${slug} not available at build time (will render on first visit): ${error.message}`);
    return { notFound: true };
  }
}

export default function BlogPost({ post, relatedPosts = [] }) {
  const router = useRouter();
  const postUrl = `https://ocheverse.ng${router.asPath}`;
  const [views, setViews] = useState(null);

  // Fetch view count from Umami API (if configured)
  useEffect(() => {
    const umamiHost = process.env.NEXT_PUBLIC_UMAMI_API_HOST;
    const umamiWebsiteId = '6c144afc-918f-4b7e-a28b-2eee9c535e40';
    const umamiApiKey = process.env.NEXT_PUBLIC_UMAMI_API_KEY;
    if (!umamiHost || !umamiApiKey) return;

    fetch(`${umamiHost}/api/websites/${umamiWebsiteId}/stats?startAt=0&endAt=${Date.now()}&url=${router.asPath}`, {
      headers: { 'x-umami-api-key': umamiApiKey },
    })
      .then(r => r.json())
      .then(data => { if (data?.pageviews?.value) setViews(data.pageviews.value); })
      .catch(() => {});
  }, [router.asPath]);

  if (!post) {
    return <div>Post not found</div>;
  }

  const date = new Date(post.pubDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <ReadingProgress />
      <CopyCodeButton />
      <BackToTop />
      <Head>
        <title>{post.title} – {post.sourceName} | Ocheverse</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} – ${post.sourceName}`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta name="twitter:card" content={post.coverImage ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.coverImage && <meta name="twitter:image" content={post.coverImage} />}
        <meta property="article:published_time" content={post.pubDate} />
        <meta property="article:author" content={post.author} />
      </Head>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 px-4 sm:py-20 animate-fade-in-down">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Main Article Container */}
          <article className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden order-1 lg:order-none">
            <div className="px-6 py-10 sm:px-12 sm:py-16">
              <Link href="/blog" className="text-blue-600 hover:text-blue-800 cursor-pointer font-semibold mb-8 inline-block">
                ← Back to Blog
              </Link>
              
              <header className="mb-10 text-center">
                <div className="flex justify-center items-center gap-2 mb-4 whitespace-nowrap">
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-500">
                    {post.sourceName}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  <span className="text-sm text-gray-500">{date}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  <span className="text-sm text-gray-500">{post.readingTime} min read</span>
                  {views && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      <span className="text-sm text-gray-500">{views.toLocaleString()} views</span>
                    </>
                  )}
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight">
                  {post.title}
                </h1>
                <div className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-4 flex-wrap">
                  <div>
                    By <span className="font-semibold text-gray-900 dark:text-white">{post.author}</span>
                  </div>
                  
                  {/* Quick Share Buttons */}
                  <div className="flex items-center gap-2 ml-4 border-l pl-4 border-gray-300 dark:border-gray-600">
                    <span className="text-sm font-semibold">Share:</span>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-600">
                      Twitter
                    </a>
                    <span>•</span>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-900 dark:text-blue-500">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </header>

              {/* Render the post content */}
              <div 
                className="prose prose-lg dark:prose-invert max-w-none 
                           prose-a:text-blue-600 hover:prose-a:text-blue-800 
                           prose-img:rounded-xl prose-img:shadow-md 
                           prose-headings:scroll-mt-24 mx-auto"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Internal Newsletter CTA */}
              <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 text-center border border-blue-100 dark:border-gray-600 shadow-sm">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Enjoyed this post?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto">
                  Subscribe for updates to get future articles on engineering and system design sent directly to your inbox.
                </p>
                <form action="https://ocheverse.substack.com/subscribe" target="_blank" method="GET" className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                  <input type="email" name="email" placeholder="jamie@example.com" className="px-4 py-3 rounded-full flex-1 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900" required />
                  <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition shadow-md">
                    Subscribe
                  </button>
                </form>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                <a 
                  href={post.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 underline font-medium"
                >
                  View Original Post on Substack
                </a>
              </div>
              
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold mb-6 text-center">More from {post.sourceName}</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {relatedPosts.map((related, i) => (
                      <Link
                        key={i}
                        href={`/blog/${related.source}/${related.slug}`}
                        className="group bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        <div className="h-28 bg-gray-200 dark:bg-gray-600 overflow-hidden">
                          {related.coverImage ? (
                            <img src={related.coverImage} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">📄</div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {related.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{related.readingTime} min read</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Remark42 Comments — configure REMARK_URL below once your instance is running */}
              <div className="mt-16 pt-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Comments</h3>
                <div id="remark42"></div>
                <Script
                  id="remark42-config"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      var remark_config = {
                        host: '${process.env.NEXT_PUBLIC_REMARK42_HOST || ''}',
                        site_id: '${process.env.NEXT_PUBLIC_REMARK42_SITE_ID || 'ocheverse'}',
                        components: ['embed'],
                        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
                      };
                    `,
                  }}
                />
                {process.env.NEXT_PUBLIC_REMARK42_HOST && (
                  <Script
                    src={`${process.env.NEXT_PUBLIC_REMARK42_HOST}/web/embed.js`}
                    strategy="afterInteractive"
                  />
                )}
                {!process.env.NEXT_PUBLIC_REMARK42_HOST && (
                  <div className="text-center text-gray-400 dark:text-gray-500 py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                    <p className="text-lg font-medium mb-2">Comments coming soon</p>
                    <p className="text-sm">Share your thoughts on the original <a href={post.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Substack post</a> for now.</p>
                  </div>
                )}
              </div>

            </div>
          </article>

          {/* Table of Contents Sidebar */}
          {post.toc && post.toc.length > 0 && (
            <aside className="hidden lg:block w-72 flex-shrink-0 order-2">
              <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Table of Contents
                </h3>
                <nav className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                  <ul className="space-y-3">
                    {post.toc.map((heading, i) => (
                      <li 
                        key={i} 
                        className={`${heading.level === 3 ? 'ml-4 text-sm' : 'font-medium text-sm'} text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400`}
                      >
                        <a href={`#${heading.id}`} className="block leading-tight transition-colors">
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}

        </div>
      </main>
      <style jsx global>{`
        /* Overriding Substack button styles and images */
        .prose img { max-width: 100%; height: auto; display: block; margin: 2rem auto; }
        .prose .button-wrapper a {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            text-decoration: none;
            font-weight: bold;
            margin: 1rem 0;
        }
        .prose figure {
            margin: 2em 0;
        }
        .prose iframe {
            max-width: 100%;
            margin: 0 auto;
            border-radius: 0.75rem;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569;
        }
        
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
}
