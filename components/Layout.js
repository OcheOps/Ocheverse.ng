import Navbar from './Navbar';
import Footer from './Footer';
import Head from 'next/head';

export default function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            {/* Add padding-top to prevent content from being hidden behind fixed navbar */}
            <main className="flex-grow pt-20">
                {children}
            </main>

            <Footer />
        </div>
    );
}
