import Head from 'next/head';
import { useState } from 'react';
import { getResources } from '../lib/notion';
import Link from 'next/link';

export async function getStaticProps() {
    const resources = await getResources();
    return {
        props: {
            initialResources: resources,
        },
        revalidate: 60, // Update every minute
    };
}

export default function Resources({ initialResources }) {
    const [activeTab, setActiveTab] = useState('All');

    const categories = ['All', ...new Set(initialResources.map(r => r.category))];

    const filteredResources = activeTab === 'All'
        ? initialResources
        : initialResources.filter(r => r.category === activeTab);

    return (
        <>
            <Head>
                <title>DevOps Resources | Ocheverse</title>
                <meta name="description" content="Curated list of DevOps resources, certification guides, and tools." />
            </Head>

            <main className="min-h-screen pt-24 pb-20 px-4 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">

                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
                        Engineering Vault
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        My personal collection of study guides, cheatsheets, and roadmaps.
                    </p>
                </header>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === cat
                                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredResources.map(resource => (
                        <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            className="group block bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-wide`}>
                                    {resource.category}
                                </span>
                                <span className="text-gray-300 group-hover:text-blue-500 transition-colors">↗</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {resource.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {resource.desc}
                            </p>
                        </a>
                    ))}
                </div>

                {filteredResources.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        No resources found in this category.
                    </div>
                )}

            </main>
        </>
    );
}
