import React, { useState, useEffect, useCallback } from 'react';

const UP = 'UP';
const DOWN = 'DOWN';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

const getEmptyBoard = () => [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

const hasValue = (board, value) => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === value) {
                return true;
            }
        }
    }
    return false;
};

const isFull = (board) => {
    return !hasValue(board, 0);
};

const getRandomPosition = () => {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);
    return [row, col];
};

const addRandomTile = (board) => {
    let [r, c] = getRandomPosition();
    while (board[r][c] !== 0) {
        [r, c] = getRandomPosition();
    }
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
};

const compress = (board) => {
    const newBoard = getEmptyBoard();
    for (let i = 0; i < 4; i++) {
        let colIndex = 0;
        for (let j = 0; j < 4; j++) {
            if (board[i][j] !== 0) {
                newBoard[i][colIndex] = board[i][j];
                colIndex++;
            }
        }
    }
    return newBoard;
};

const merge = (board, setScore) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (newBoard[i][j] !== 0 && newBoard[i][j] === newBoard[i][j + 1]) {
                newBoard[i][j] = newBoard[i][j] * 2;
                newBoard[i][j + 1] = 0;
                setScore((s) => s + newBoard[i][j]);
            }
        }
    }
    return newBoard;
};

const reverse = (board) => {
    const newBoard = getEmptyBoard();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            newBoard[i][j] = board[i][3 - j];
        }
    }
    return newBoard;
};

const rotateLeft = (board) => {
    const newBoard = getEmptyBoard();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            newBoard[i][j] = board[j][3 - i];
        }
    }
    return newBoard;
};

const rotateRight = (board) => {
    const newBoard = getEmptyBoard();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            newBoard[i][j] = board[3 - j][i];
        }
    }
    return newBoard;
};

// Main Component
export default function Game2048() {
    const [board, setBoard] = useState(getEmptyBoard());
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isWon, setIsWon] = useState(false);

    // Initialize
    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        let newBoard = getEmptyBoard();
        newBoard = addRandomTile(newBoard);
        newBoard = addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
        setIsWon(false);
    };

    const move = useCallback((direction) => {
        if (gameOver || isWon) return;

        let newBoard = JSON.parse(JSON.stringify(board));
        let moved = false;

        // Helper to process a row (compress, merge, compress)
        const processRow = (row) => {
            // Filter non-zeros
            let newRow = row.filter(val => val !== 0);
            // Merge
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    setScore(s => s + newRow[i]);
                    newRow[i + 1] = 0;
                }
            }
            // Filter zeros again after merge
            newRow = newRow.filter(val => val !== 0);
            // Pad with zeros
            while (newRow.length < 4) newRow.push(0);
            return newRow;
        };

        // Transform board to be processed as moving LEFT
        // Then rotate back

        // Actually, let's use the rotation helpers I wrote but didn't use efficiently above
        // Or just simple logic:
        // Move LEFT: process rows as is
        // Move RIGHT: reverse rows, process, reverse back
        // Move UP: rotate left, process, rotate right
        // Move DOWN: rotate right, process, rotate left

        // Simpler move logic based on rows/cols directly

        let processedBoard = getEmptyBoard();

        if (direction === LEFT) {
            for (let i = 0; i < 4; i++) processedBoard[i] = processRow(board[i]);
        } else if (direction === RIGHT) {
            for (let i = 0; i < 4; i++) processedBoard[i] = processRow([...board[i]].reverse()).reverse();
        } else if (direction === UP) {
            // Extract cols to rows
            let cols = [[], [], [], []];
            for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) cols[j].push(board[i][j]);
            for (let i = 0; i < 4; i++) cols[i] = processRow(cols[i]);
            // Put back
            for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) processedBoard[i][j] = cols[j][i];
        } else if (direction === DOWN) {
            let cols = [[], [], [], []];
            for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) cols[j].push(board[i][j]);
            for (let i = 0; i < 4; i++) cols[i] = processRow(cols[i].reverse()).reverse();
            // Put back
            for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) processedBoard[i][j] = cols[j][i];
        }

        if (JSON.stringify(board) !== JSON.stringify(processedBoard)) {
            // Something moved
            try {
                const nextBoard = addRandomTile(processedBoard);
                setBoard(nextBoard);
            } catch (e) {
                // If we can't add a tile, board is full? But 'moved' check should prevent this unless it just became full
                // Actually addRandomTile loops forever if full, need to check
                // But we just compressed, so there SHOULD be space if something moved.
                // Edge case: Maybe not? No, if it changed, something merged or shifted, preserving count or reducing it.
                // Wait, valid moves always create space EXCEPT if we just filled the last spot?
                // Actually, if we merge, we create space. If we just shift into empty space, we preserve empty space count. Since we start with empty space, we should be fine?
                // Actually, if the board was FULL, and we merge, we create space.
                // If board was NOT FULL, we have space.
                // So safe.
                // Wait, what if board is full, and we try to move, but NO moves are possible?
                // Then stringify check returns equal, so we don't enter here.
                setBoard(processedBoard); // Actually need to assign BEFORE adding random, but flow is: Move -> Add Tile
                // Let's modify addRandomTile to be safe
                // Re-implementing addRandomTile inline effectively
                let emptySpots = [];
                for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (processedBoard[i][j] === 0) emptySpots.push({ r: i, c: j });

                if (emptySpots.length > 0) {
                    let spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
                    processedBoard[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4;
                    setBoard(processedBoard);
                } else {
                    setBoard(processedBoard); // Should not happen if moved, unless 16 tiles and keys don't merge?
                }
            }
        }

        // Check win/loss
        if (hasValue(processedBoard, 2048)) {
            setIsWon(true);
        }

        // Check Loss: Board full AND no moves possible
        // We need to check nextBoard actually... the state update is async.
        // Ideally we check condition on 'processedBoard' (after random tile added).

    }, [board, gameOver, isWon]);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (gameOver || isWon) return;

            switch (event.key) {
                case 'ArrowUp':
                    move(UP);
                    break;
                case 'ArrowDown':
                    move(DOWN);
                    break;
                case 'ArrowLeft':
                    move(LEFT);
                    break;
                case 'ArrowRight':
                    move(RIGHT);
                    break;
                default:
                    return;
            }
            event.preventDefault(); // Prevent scrolling
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [move, gameOver, isWon]);


    // Colors for tiles
    const getColors = (value) => {
        switch (value) {
            case 2: return 'bg-gray-200 text-gray-700';
            case 4: return 'bg-blue-100 text-gray-800';
            case 8: return 'bg-orange-200 text-white';
            case 16: return 'bg-orange-300 text-white';
            case 32: return 'bg-orange-400 text-white';
            case 64: return 'bg-orange-500 text-white';
            case 128: return 'bg-yellow-300 text-white shadow-[0_0_10px_yellow]';
            case 256: return 'bg-yellow-400 text-white shadow-[0_0_15px_yellow]';
            case 512: return 'bg-yellow-500 text-white shadow-[0_0_20px_yellow]';
            case 1024: return 'bg-yellow-600 text-white shadow-[0_0_25px_yellow]';
            case 2048: return 'bg-yellow-400 text-white shadow-[0_0_30px_gold] animate-pulse';
            default: return 'bg-gray-200 text-gray-900';
        }
    };


    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-[300px] sm:w-[350px] mb-4">
                <div className="bg-gray-700 p-2 rounded text-white font-bold px-4">
                    Score: {score}
                </div>
                <button onClick={initGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
                    New Game
                </button>
            </div>

            <div className="relative bg-gray-800 p-2 sm:p-4 rounded-xl cursor-default select-none touch-none"
                style={{ width: 'min(90vw, 400px)', height: 'min(90vw, 400px)' }}> {/* Square aspect ratio */}

                {/* Grid Background */}
                <div className="absolute inset-0 p-2 sm:p-4 grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="bg-gray-600/50 rounded-lg"></div>
                    ))}
                </div>

                {/* Tiles */}
                <div className="absolute inset-0 p-2 sm:p-4 grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3">
                    {board.map((row, i) => row.map((value, j) => (
                        <div key={`${i}-${j}`} className="flex justify-center items-center">
                            {value !== 0 && (
                                <div className={`w-full h-full flex items-center justify-center rounded-lg font-bold text-2xl sm:text-3xl transition-all duration-100 transform scale-100 ${getColors(value)}`}>
                                    {value}
                                </div>
                            )}
                        </div>
                    )))}
                </div>

                {/* Overlays */}
                {(gameOver || isWon) && (
                    <div className="absolute inset-0 bg-gray-900/80 rounded-xl flex flex-col items-center justify-center z-20 backdrop-blur-sm animate-in fade-in">
                        <h2 className="text-5xl font-black text-white mb-4">{isWon ? 'You Win! 🎉' : 'Game Over'}</h2>
                        <button onClick={initGame} className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
                            Try Again
                        </button>
                    </div>
                )}

            </div>

            <div className="mt-8 text-gray-500 text-sm max-w-sm text-center">
                Use <strong>Arrow Keys</strong> to move tiles. Combine same numbers to reach <strong>2048</strong>!
            </div>

        </div>
    );
}
