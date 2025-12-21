import Head from "next/head";
import Link from "next/link";

export default function Learn() {
  return (
    <>
      <Head>
        <title>Come Learn With Oche — Cloud & DevOps Basics</title>
        <meta
          name="description"
          content="Beginner-friendly cloud & DevOps sessions with Oche. Every Saturday 5pm WAT. ₦2,000 per class, ₦5,000 1-on-1."
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-12 text-gray-900 dark:text-gray-100">

        {/* HERO SECTION */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold tracking-wide mb-4">
              Beginner-friendly · Live on Saturdays
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Come Learn With Oche
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              No gatekeeping, just practical Cloud & DevOps. We keep it simple, real, and
              hands-on—so you can actually ship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/2348138776065?text=Hi%20Oche,%20I'm%20interested%20in%20joining%20the%20DevOps%20class!"
                target="_blank"
                className="inline-flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-transform hover:-translate-y-1 shadow-lg"
              >
                <span className="mr-2">💬</span> Chat on WhatsApp
              </a>
              <a
                href="mailto:ocheworks@gmail.com?subject=Come%20Learn%20With%20Oche"
                className="inline-flex justify-center items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                ✉️ Email to Register
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Time: <strong className="text-gray-900 dark:text-gray-200">Every Saturday, 5:00pm WAT</strong> <br className="sm:hidden" /> · Location: Online
            </p>
          </div>

          {/* PRICING CARDS */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="space-y-8">

              {/* Group Session */}
              <div className="pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="inline-block py-1 px-2 rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs font-bold mb-2">
                  Group Session
                </div>
                <div className="flex items-baseline mb-1">
                  <span className="text-3xl font-bold">₦2,000</span>
                  <span className="ml-2 text-gray-500 text-sm">per person / session</span>
                </div>
                <ul className="space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start"><span className="text-blue-500 mr-2">•</span> 2-hour live class + Q&A</li>
                  <li className="flex items-start"><span className="text-blue-500 mr-2">•</span> Recording shared after class</li>
                  <li className="flex items-start"><span className="text-blue-500 mr-2">•</span> Beginner-friendly, real projects</li>
                </ul>
              </div>

              {/* 1-on-1 */}
              <div>
                <div className="inline-block py-1 px-2 rounded bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs font-bold mb-2">
                  1-on-1 Coaching
                </div>
                <div className="flex items-baseline mb-1">
                  <span className="text-3xl font-bold">₦5,000</span>
                  <span className="ml-2 text-gray-500 text-sm">per session</span>
                </div>
                <ul className="space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start"><span className="text-blue-500 mr-2">•</span> Personalized roadmap</li>
                  <li className="flex items-start"><span className="text-blue-500 mr-2">•</span> Hands-on guidance & feedback</li>
                  <li className="flex items-start"><span className="text-blue-500 mr-2">•</span> We work on <em className="ml-1 text-gray-900 dark:text-white not-italic font-semibold">your</em> goals</li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* CURRICULUM */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6">What you’ll learn</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="font-bold mb-2 text-blue-600 dark:text-blue-400">Cloud 101</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">IaaS, PaaS, SaaS · Public vs Private vs Hybrid · Regions & AZs</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="font-bold mb-2 text-blue-600 dark:text-blue-400">Core Services</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Compute (EC2), Storage (S3), Networking (VPC), IAM basics</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="font-bold mb-2 text-blue-600 dark:text-blue-400">Hands-on</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Deploy a tiny app, monitor it, and keep it alive in the cloud.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center py-12">
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-6 font-medium">Ready to start?</p>
          <a
            href="https://wa.me/2348138776065?text=Hi%20Oche,%20I'm%20ready%20to%20start%20learning!"
            target="_blank"
            className="inline-flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg"
          >
            Start Chatting on WhatsApp
          </a>
        </section>

      </main>
    </>
  );
}
