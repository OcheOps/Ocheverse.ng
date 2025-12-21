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

    return (
        <div className="flex flex-col items-center justify-center p-4 font-mono">
            <div className="mb-4 text-center">
                <p className="text-sm text-green-500 mb-2">Build Status: PROD</p>
                <div className="flex gap-8 text-xl font-bold text-gray-200">
                    <span>Score: {score}</span>
                    <span>High Score: {highScore}</span>
                </div>
            </div>

            <div className="relative bg-black border-4 border-gray-800 rounded-lg shadow-2xl overflow-hidden"
                style={{ width: 300, height: 300 }}>

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

            <div className="mt-8 text-gray-500 text-sm text-center">
                <p className="mb-2">Arrow keys to move • Space to pause</p>
                <div className="grid grid-cols-3 gap-2 w-32 mx-auto sm:hidden">
                    <div></div>
                    <button onClick={() => setDirection('UP')} className="bg-gray-800 p-2 rounded">⬆️</button>
                    <div></div>
                    <button onClick={() => setDirection('LEFT')} className="bg-gray-800 p-2 rounded">⬅️</button>
                    <button onClick={() => setDirection('DOWN')} className="bg-gray-800 p-2 rounded">⬇️</button>
                    <button onClick={() => setDirection('RIGHT')} className="bg-gray-800 p-2 rounded">➡️</button>
                </div>
            </div>
        </div>
    );
}
