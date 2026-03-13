import Navbar from './Navbar';
import Footer from './Footer';
import Head from 'next/head';
import Script from 'next/script';

export default function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Script
                defer
                data-website-id="6c144afc-918f-4b7e-a28b-2eee9c535e40"
                src="https://cloud.umami.is/script.js"
                strategy="afterInteractive"
            />

            <Navbar />

            {/* Add padding-top to prevent content from being hidden behind fixed navbar */}
            <main className="flex-grow pt-20">
                {children}
            </main>

            <Footer />
        </div>
    );
}
