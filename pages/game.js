import Head from 'next/head';
import SnakeGame from '../components/SnakeGame';

export default function Game() {
    return (
        <>
            <Head>
                <title>Terminal Snake | Ocheverse</title>
                <meta name="description" content="Bored? Kill some time with a quick game of Snake in the Ocheverse terminal." />
            </Head>

            <div className="min-h-screen flex items-center justify-center bg-gray-900 pb-20">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2 font-mono">
                        ~/terminal-snake
                    </h1>
                    <p className="text-gray-400 mb-8 font-mono text-sm">Bored? Kill some latency.</p>
                    <SnakeGame />
                </div>
            </div>
        </>
    );
}
