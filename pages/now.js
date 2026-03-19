import Head from "next/head";
import dynamic from "next/dynamic";
import NowPlaying from "../components/NowPlaying";
import GitHubActivity from "../components/GitHubActivity";

const VisitorGlobe = dynamic(() => import("../components/VisitorGlobe"), { ssr: false });

const NOW_DATA = {
  lastUpdated: "March 2026",
  location: "Nigeria",
  sections: [
    {
      title: "Building",
      icon: "🔧",
      items: [
        "Scaling Ocheverse.ng — my personal engineering hub",
        "Self-hosted infrastructure: monitoring, VPN tunnels, and secret management with HashiCorp Vault",
        "Open source CLI tools in Go",
      ],
    },
    {
      title: "Learning",
      icon: "📚",
      items: [
        "Deep-diving into distributed systems internals",
        "Kubernetes operators and custom controllers",
        "Writing more consistently on Substack",
      ],
    },
    {
      title: "Reading",
      icon: "📖",
      items: [
        "Designing Data-Intensive Applications — Martin Kleppmann",
        "The Staff Engineer's Path — Tanya Reilly",
      ],
    },
    {
      title: "Listening",
      icon: "🎧",
      items: [
        "Ship It! (Changelog podcast)",
        "Afrobeats & lo-fi while deploying",
      ],
    },
    {
      title: "Life",
      icon: "⚡",
      items: [
        "Liverpool FC — through thick and thin",
        "Finding stillness in the terminal",
        "Trying to touch grass occasionally",
      ],
    },
  ],
};

export default function Now() {
  return (
    <>
      <Head>
        <title>Now – Ocheverse</title>
        <meta name="description" content="What David Gideon is currently working on, learning, and thinking about." />
        <meta property="og:title" content="Now – Ocheverse" />
        <meta property="og:description" content="What David Gideon is currently working on, learning, and thinking about." />
        <meta property="og:url" content="https://ocheverse.ng/now" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 pb-20">
        <div className="py-20 text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">
            Now
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            What I&apos;m focused on right now. Inspired by{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noreferrer"
              className="text-green-600 dark:text-green-400 hover:underline"
            >
              nownownow.com
            </a>
          </p>
          <p className="text-sm text-gray-400 mt-3">
            Last updated: {NOW_DATA.lastUpdated} &middot; {NOW_DATA.location}
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
          <NowPlaying />

          {/* GitHub Activity */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🐙</span>
              <h2 className="text-2xl font-bold">Shipping</h2>
            </div>
            <GitHubActivity />
          </section>

          {NOW_DATA.sections.map((section) => (
            <section
              key={section.title}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-gray-600 dark:text-gray-300"
                  >
                    <span className="text-green-500 mt-1.5 flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Visitor Globe */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🌍</span>
              <h2 className="text-2xl font-bold">Visitors</h2>
            </div>
            <VisitorGlobe />
          </section>

          <div className="text-center pt-8">
            <p className="text-gray-400 text-sm">
              This page is a living document. I update it whenever my focus shifts.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
