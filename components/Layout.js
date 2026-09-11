import Navbar from './Navbar';
import Footer from './Footer';
import Head from 'next/head';
import Script from 'next/script';

export default function Layout({ children }) {
    return (
        <div className="editorial-surface flex flex-col min-h-screen transition-colors duration-300">
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

            {/* Navbar is fixed; leave room for it */}
            <main className="flex-grow pt-[72px] relative z-[3]">
                {children}
            </main>

            <Footer />
        </div>
    );
}
