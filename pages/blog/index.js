import Head from "next/head";
import Parser from "rss-parser";

export async function getStaticProps() {
  const parser = new Parser();
  const ocheverseFeed = await parser.parseURL("https://ocheverse.substack.com/feed");
  const bpurFeed = await parser.parseURL("https://bpur.substack.com/feed");

  return {
    props: {
      ocheversePosts: ocheverseFeed.items.slice(0, 3),
      bpurPosts: bpurFeed.items.slice(0, 3),
    },
    revalidate: 3600 // revalidate every hour
  };
}

export default function Blog({ ocheversePosts, bpurPosts }) {
  return (
    <>
      <Head>
        <title>Blog – Ocheverse</title>
      </Head>
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">📰 Latest Blog Posts</h1>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">✍🏽 From Ocheverse</h2>
          <ul className="space-y-4">
            {ocheversePosts.map((post, i) => (
              <li key={i} className="border-l-4 border-blue-600 pl-4">
                <a href={post.link} target="_blank" className="text-xl font-medium hover:underline">{post.title}</a>
                <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(post.pubDate).toDateString()}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-600 mb-6">🧠 From BPUR</h2>
          <ul className="space-y-4">
            {bpurPosts.map((post, i) => (
              <li key={i} className="border-l-4 border-purple-600 pl-4">
                <a href={post.link} target="_blank" className="text-xl font-medium hover:underline">{post.title}</a>
                <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(post.pubDate).toDateString()}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
