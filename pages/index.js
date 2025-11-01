import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
  <title>Oche – DevOps Engineer | Ocheverse|Solutions Architect</title>
  <meta name="description" content="DevOps engineer & infrastructure storyteller. Explore my projects, blog posts, and automation obsessions at Ocheverse." />
  <meta name="keywords" content="DevOps, Cloud, SRE, Automation, Oche,Infra Projects, David Gideon, Ocheverse" />
  <meta name="author" content="David Ndifrekeabasi Gideon" />
  <meta name="robots" content="index, follow" />

  

  {/* Open Graph (for social media preview) */}
  <meta property="og:title" content="David Gideon – DevOps Engineer/Solutions Architect | Ocheverse" />
  <meta property="og:description" content="Explore DevOps tools, cloud infrastructure, and brutally honest engineering stories from the field." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://ocheverse.ng" />
  <meta property="og:image" content="https://ocheverse.ng/cover.png" />

  {/* Twitter card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@ochecodes" />
  <meta name="twitter:title" content="David Gideon – DevOps Engineer | Ocheverse" />
  <meta name="twitter:description" content="Explore DevOps tools, cloud infrastructure, and brutally honest engineering stories from the field." />
  <meta name="twitter:image" content="https://ocheverse.ng/cover.png" />

  <link rel="canonical" href="https://ocheverse.ng" />
      </Head>
      <main className="p-6 max-w-5xl mx-auto text-gray-900 dark:text-gray-100 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <section className="text-center py-16">
          <Image
            src="/profile.jpg"
            alt="David Gideon"
            width={120}
            height={120}
            className="rounded-full mx-auto mb-4"
          />
          <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-4">David Gideon</h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
            DevOps Engineer ✦ SRE ✦ Solutions Architect ✦ Infra Storyteller ✦ Building from Lagos to the world 🌍
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a href="/DavidGideonNdfrekeabasi.pdf" download className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-lg">
              📄 Download My CV
            </a>
            <a href="https://ocheverse.substack.com" target="_blank" className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-2 px-6 rounded shadow">
              ✍🏽 Read Ocheverse Blog
            </a>
            <a href="https://bpur.substack.com" target="_blank" className="border border-gray-800 text-gray-800 dark:border-gray-200 dark:text-gray-200 hover:bg-gray-800 hover:text-white py-2 px-6 rounded shadow">
              🧠 Read BPUR Essays
            </a>
            <a href="/blog" className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded shadow">
  📰 Read Latest Posts
</a>

<a href="/learn" className="bg-red-400 hover:bg-red-500 text-white py-2 px-6 rounded shadow">
  📚 Join DevOps Classes 
</a>

            <a href="https://github.com/OcheOps" target="_blank" className="bg-gray-900 text-white hover:bg-gray-700 py-2 px-6 rounded shadow">
              🐙 View GitHub
            </a>
          </div>
        </section>
        <section className="py-12 border-t border-gray-300">
          <h2 className="text-3xl font-bold mb-8 text-center text-purple-700 dark:text-purple-400">🚀 Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-2xl font-semibold">Passy</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">A cross-platform CLI password manager built with Go </p>
              <a href="https://github.com/OcheOps/passy" target="_blank" className="inline-block mt-3 text-blue-500 hover:underline">🔗 View on GitHub</a>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-2xl font-semibold">Infra Monitor-as-a-Service</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">Monitoring CLI with Prometheus, Grafana, Alertmanager and Telegram alerts.</p>
              <a href="https://github.com/OcheOps/infra-monitor" target="_blank" className="inline-block mt-3 text-blue-500 hover:underline">🔗 View on GitHub</a>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-2xl font-semibold">VPN Infra</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">Terraform-based AWS↔Azure VPN tunnel with BGP failover.</p>
              <a href="https://github.com/OcheOps/Site-to-site-VPN.git" target="_blank" className="inline-block mt-3 text-blue-500 hover:underline">🔗 View on GitHub</a>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-2xl font-semibold">Playlist Exporter</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">CLI tool to migrate Spotify liked songs to YouTube Music with accurate matching.</p>
              <a href="https://github.com/OcheOps/playlist-exporter-spotify-to-YTM.git" target="_blank" className="inline-block mt-3 text-blue-500 hover:underline">🔗 View on GitHub</a>
            </div>
          </div>
        </section>
        <section className="py-16 border-t border-gray-300">
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6 text-center">🎉 Fun Facts About Me</h2>
          <ul className="list-disc max-w-2xl mx-auto space-y-2 text-lg text-gray-700 dark:text-gray-300">
            <li>I think alot about the future</li>
            <li>I LOVE Liverpool FC</li>
            <li>I’m curious about the future of Distributed Systems</li>
            <li>I write blog posts with memes and builder energy 💻🔥</li>
            <li>I daydream of infra that configures itself ☁️🤖</li>
          </ul>
        </section>
        <section className="py-16 border-t border-gray-300 text-center">
          <h2 className="text-3xl font-bold mb-4 text-pink-600 dark:text-pink-400">🎙️ Want to work together?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Reach out via <a className="text-blue-600 hover:underline" href="mailto:ocheworks@gmail.com">ocheworks@gmail.com</a> or DM on <a className="text-blue-600 hover:underline" href="https://www.linkedin.com/in/gideonodavid/">LinkedIn</a>.
          </p>
        </section>
      </main>
    </>
  );
}

