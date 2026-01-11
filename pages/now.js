
import Head from 'next/head';
import NowPlaying from '../components/NowPlaying';
import Link from 'next/link';
import { getFocusItems } from '../lib/notion';

export async function getStaticProps() {
    const focusItems = await getFocusItems();
    return {
        props: { focusItems },
        revalidate: 60
    };
}

export default function Now({ focusItems }) {
    return (
        <>
            <Head>
                <title>Now | Ocheverse</title>
                <meta name="description" content="What Oche is doing right now. Current focus, reading, and listening." />
            </Head>

            <main className="min-h-screen pt-24 pb-20 px-4 max-w-3xl mx-auto text-gray-900 dark:text-gray-100">

                <header className="mb-12">
                    <h1 className="text-4xl font-black mb-4">Now</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                        A living snapshot of my current focus.
                        <span className="block text-sm mt-1 opacity-70">Inspired by Derek Sivers' /now page movement.</span>
                    </p>
                </header>

                <div className="space-y-12">

                    {/* Current Focus Section */}
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="text-blue-500">⚡</span> Current Focus
                        </h2>

                        <div className="space-y-6">
                            {focusItems.map(item => (
                                <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className="flex justify-between mb-2">
                                        <h3 className="font-bold text-gray-800 dark:text-gray-200">{item.text}</h3>
                                        <span className="font-mono text-sm text-gray-500">{item.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h - full rounded - full transition - all duration - 1000 ease - out ${item.color === 'orange' ? 'bg-orange-500' :
                                                    item.color === 'green' ? 'bg-green-500' :
                                                        item.color === 'purple' ? 'bg-purple-500' : 'bg-blue-500'
                                                } `}
                                            style={{ width: `${item.progress}% ` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Music Section */}
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="text-green-500">🎧</span> On Rotation
                        </h2>
                        <NowPlaying />
                    </section>

                    {/* Reading Section (Optional/Example) */}
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-orange-500">📚</span> Reading
                        </h2>
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-lg mb-1">Site Reliability Engineering</h3>
                            <p className="text-gray-500 italic mb-2">by Google Team</p>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full w-[45%]"></div>
                            </div>
                            <p className="text-xs text-right mt-1 text-gray-400">45% Complete</p>
                        </div>
                    </section>

                    <div className="pt-12 border-t border-gray-200 dark:border-gray-800 text-center">
                        <p className="text-gray-500 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                        <Link href="/" className="text-blue-500 hover:underline">
                            ← Back Home
                        </Link>
                    </div>

                </div>
            </main>
        </>
    );
}
