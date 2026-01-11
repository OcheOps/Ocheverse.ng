import Head from 'next/head';
import Game2048 from '../components/Game2048';
import Link from 'next/link';

export default function Game2048Page() {
    return (
        <>
            <Head>
                <title>2048 | Ocheverse</title>
                <meta name="description" content="Play the classic 2048 game in the Ocheverse terminal." />
            </Head>

            {/* Main Container */}
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white pb-20 px-4">

                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4 text-gray-500 hover:text-white transition-colors">
                        ← Back to Ocheverse
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2 font-mono">
                        2048
                    </h1>
                    <p className="text-gray-400 font-mono text-sm tracking-wide">
                        Logic. Strategy. Patience.
                    </p>
                </div>

                {/* Game Board */}
                <Game2048 />

            </div>
        </>
    );
}
