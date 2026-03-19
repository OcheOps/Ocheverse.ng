import Head from "next/head";
import TechStack from "../components/TechStack";

export default function Stack() {
  return (
    <>
      <Head>
        <title>Tech Stack – Ocheverse</title>
        <meta name="description" content="The tools and technologies David Gideon works with." />
        <meta property="og:title" content="Tech Stack – Ocheverse" />
        <meta property="og:description" content="The tools and technologies David Gideon works with." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 pb-20">
        <div className="py-20 text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
            Tech Stack
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            DevOps &middot; Platform Engineering &middot; Solutions Architecture
          </p>
          <p className="text-sm text-gray-400 mt-3">Tap to expand details</p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <TechStack />
        </div>
      </main>
    </>
  );
}
