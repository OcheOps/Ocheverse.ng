import { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

export default function SnakeGame() {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const gameLoopRef = useRef();
    const touchStart = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem('snakeHighScore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeHighScore', score);
        }
    }, [score, highScore]);

    const moveSnake = () => {
        if (gameOver || isPaused) return;

        const newSnake = [...snake];
        const head = { ...newSnake[0] };

        switch (direction) {
            case 'UP': head.y -= 1; break;
            case 'DOWN': head.y += 1; break;
            case 'LEFT': head.x -= 1; break;
            case 'RIGHT': head.x += 1; break;
            default: break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            setGameOver(true);
            return;
        }

        // Check collision with self
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
            setGameOver(true);
            return;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            setScore(s => s + 1);
            generateFood();
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    };

    const generateFood = () => {
        let newFood;
        while (true) {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
            // eslint-disable-next-line no-loop-func
            if (!snake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
        }
        setFood(newFood);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            switch (e.key) {
                case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
                case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
                case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
                case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
                case ' ': setIsPaused(p => !p); break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [direction]);

    useEffect(() => {
        gameLoopRef.current = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - score * 2));
        return () => clearInterval(gameLoopRef.current);
    });

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection('RIGHT');
        setGameOver(false);
        setScore(0);
        setIsPaused(false);
        generateFood();
    };

    const handleTouchStart = (e) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
        if (!touchStart.current) return;
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;
        const minSwipe = 30;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (Math.abs(dx) > minSwipe) {
                if (dx > 0 && direction !== 'LEFT') setDirection('RIGHT');
                else if (dx < 0 && direction !== 'RIGHT') setDirection('LEFT');
            }
        } else {
            if (Math.abs(dy) > minSwipe) {
                if (dy > 0 && direction !== 'UP') setDirection('DOWN');
                else if (dy < 0 && direction !== 'DOWN') setDirection('UP');
            }
        }
        touchStart.current = null;
    };

    return (
        <div className="flex flex-col items-center justify-center w-full px-4 font-mono">
            <div className="mb-4 text-center w-full max-w-[400px]">
                <p className="text-sm text-green-500 mb-2">Build Status: PROD</p>
                <div className="flex justify-center gap-4 sm:gap-8 text-base sm:text-xl font-bold text-gray-200">
                    <span>Score: {score}</span>
                    <span>High Score: {highScore}</span>
                </div>
            </div>

            <div className="relative bg-black border-4 border-gray-800 rounded-lg shadow-2xl overflow-hidden w-full max-w-[400px] aspect-square"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}>

                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>

                {/* Snake */}
                {snake.map((segment, i) => (
                    <div key={i}
                        className="absolute bg-green-500 border border-black"
                        style={{
                            left: `${segment.x * (100 / GRID_SIZE)}%`,
                            top: `${segment.y * (100 / GRID_SIZE)}%`,
                            width: `${100 / GRID_SIZE}%`,
                            height: `${100 / GRID_SIZE}%`,
                            opacity: i === 0 ? 1 : 0.6
                        }}
                    />
                ))}

                {/* Food */}
                <div className="absolute bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                    style={{
                        left: `${food.x * (100 / GRID_SIZE)}%`,
                        top: `${food.y * (100 / GRID_SIZE)}%`,
                        width: `${100 / GRID_SIZE}%`,
                        height: `${100 / GRID_SIZE}%`,
                    }}
                />

                {/* Game Over Overlay */}
                {gameOver && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4 backdrop-blur-sm z-10">
                        <h2 className="text-3xl font-bold text-red-500 mb-2">SYSTEM FAULT</h2>
                        <p className="text-gray-400 mb-6">Process Terminated unexpectedly.</p>
                        <button onClick={resetGame} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold font-sans">
                            Sudo Restart
                        </button>
                    </div>
                )}

                {/* Pause Overlay */}
                {!gameOver && isPaused && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-2xl font-bold text-white blink">PAUSED</span>
                    </div>
                )}
            </div>

            <div className="mt-6 text-gray-500 text-sm text-center max-w-sm">
                <p className="hidden sm:block mb-2">Arrow keys to move • Space to pause</p>
                <p className="sm:hidden mb-4">Swipe or use buttons to move.</p>
                <div className="sm:hidden space-y-2">
                    <button onClick={() => setIsPaused(p => !p)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform mb-2">
                        {isPaused ? '▶ Resume' : '⏸ Pause'}
                    </button>
                    <div className="grid grid-cols-3 gap-2 w-36 mx-auto">
                        <div></div>
                        <button onClick={() => { if (direction !== 'DOWN') setDirection('UP'); }} className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg text-lg active:scale-95 transition-transform">↑</button>
                        <div></div>
                        <button onClick={() => { if (direction !== 'RIGHT') setDirection('LEFT'); }} className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg text-lg active:scale-95 transition-transform">←</button>
                        <button onClick={() => { if (direction !== 'UP') setDirection('DOWN'); }} className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg text-lg active:scale-95 transition-transform">↓</button>
                        <button onClick={() => { if (direction !== 'LEFT') setDirection('RIGHT'); }} className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg text-lg active:scale-95 transition-transform">→</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
