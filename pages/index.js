import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Custom Hook for Typed Text Effect
const useTypewriter = (words, speed = 100, deletingSpeed = 50, pause = 1500) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (index >= words.length) {
      setIndex(0); // Reset to start
      return;
    }

    const currentWord = words[index];

    if (isDeleting) {
      if (subIndex === 0) {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
        return;
      }

      const timeout = setTimeout(() => {
        setSubIndex((prev) => prev - 1);
      }, deletingSpeed);
      return () => clearTimeout(timeout);
    } else {
      if (subIndex === currentWord.length) {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pause);
        return () => clearTimeout(timeout);
      }

      const timeout = setTimeout(() => {
        setSubIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [subIndex, index, isDeleting, words, speed, deletingSpeed, pause]);

  return `${words[index].substring(0, subIndex)}${blink ? "|" : " "}`;
};

const ROLES = [
  "DevOps Engineer",
  "Chaos Engineer",
  "Cloud Native Local",
  "Infrastructure Storyteller",
  "Liverpool FC Fan",
  "Anything my babe needs me to be"
];

export default function Home() {
  const typedText = useTypewriter(ROLES);

  return (
    <>
      <Head>
        <title>David Gideon – DevOps Engineer & Solutions Architect | Ocheverse</title>
        <meta name="description" content="DevOps engineer & infrastructure storyteller. Explore my projects, blog posts, and automation obsessions at Ocheverse." />
      </Head>

      {/* Background Gradient Mesh (Fixed) */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px]" />
      </div>

      <main className="text-gray-900 dark:text-gray-100 min-h-screen pt-24">

        {/* HERO SECTION */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 relative">
          <div className="mb-8 relative w-32 h-32 md:w-40 md:h-40">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full animate-pulse blur-lg opacity-50"></div>
            <Image
              src="/profile.jpg"
              alt="David Gideon"
              fill
              className="rounded-full object-cover border-4 border-white dark:border-gray-900 relative z-10 shadow-2xl"
            />
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            David Gideon
          </h1>

          <div className="h-8 text-xl md:text-2xl font-mono text-blue-600 dark:text-blue-400 mb-8 font-semibold uppercase tracking-widest">
            {typedText}
          </div>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-12 leading-relaxed">
            Building for the Cloud, automating the chaos, and finding stillness in the terminal.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="#projects" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform">
              See the Work
            </a>
            <a href="mailto:ocheworks@gmail.com" className="bg-transparent text-gray-900 dark:text-white font-bold py-3 px-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Let's Talk
            </a>
          </div>
        </section>

        {/* FEATURED PROJECTS */}
        <section id="projects" className="py-24 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Selected Works</h2>
            <p className="text-gray-500 dark:text-gray-400">Open source & Infrastructure.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ProjectCard
              title="Passy"
              desc="A cross-platform CLI password manager built with Go. Secure, fast, and terminal-native."
              link="https://github.com/OcheOps/passy"
              tags={['Go', 'CLI', 'Security']}
            />
            <ProjectCard
              title="Infra Monitor-as-a-Service"
              desc="Full-stack monitoring solution using Prometheus, Grafana, and Alertmanager with Telegram integration."
              link="https://github.com/OcheOps/infra-monitor"
              tags={['Prometheus', 'Grafana', 'Docker']}
            />
            <ProjectCard
              title="VPN Infra"
              desc="Automated AWS↔Azure VPN tunnel with BGP failover utilizing Terraform for Infrastructure as Code."
              link="https://github.com/OcheOps/Site-to-site-VPN.git"
              tags={['Terraform', 'AWS', 'Azure', 'Networking']}
            />
            <ProjectCard
              title="Playlist Exporter"
              desc="A CLI wizard to migrate your Spotify 'Liked Songs' directly to YouTube Music with high accuracy."
              link="https://github.com/OcheOps/playlist-exporter-spotify-to-YTM.git"
              tags={['Python', 'API', 'Automation']}
            />
          </div>
        </section>

        {/* FUN FACTS - Interactive Grid */}
        <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">
              State File
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              <FactCard emoji="🔮" text="Always thinking about the future" />
              <FactCard emoji="⚽" text="Die-hard Liverpool FC Fan" />
              <FactCard emoji="🌐" text="Curious about Distributed Systems" />
              <FactCard emoji="✍🏽" text="Writes blogs with memes & vibes" />
              <FactCard emoji="🤖" text="Dreams of self-healing infra" />
              <FactCard emoji="🇳🇬" text="Building from the Terminal" />
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="py-32 text-center px-4">
          <h2 className="text-5xl font-extrabold mb-6">Shall we?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
            Designing systems that survive the real world.
          </p>
          <a href="mailto:ocheworks@gmail.com" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
            Say Hello 👋
          </a>
        </section>

      </main>
    </>
  );
}

// Sub-components for cleaner code
function ProjectCard({ title, desc, link, tags }) {
  return (
    <a href={link} target="_blank" className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 block">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold group-hover:text-blue-500 transition-colors">{title}</h3>
        <span className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">↗</span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        {desc}
      </p>
      <div className="flex gap-2 flex-wrap">
        {tags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-semibold rounded-full text-gray-600 dark:text-gray-300">
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}

function FactCard({ emoji, text }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center transform transition duration-500 hover:scale-105 border-b-4 border-transparent hover:border-green-500">
      <span className="text-4xl block mb-3">{emoji}</span>
      <p className="font-medium text-gray-700 dark:text-gray-200">{text}</p>
    </div>
  );
}

