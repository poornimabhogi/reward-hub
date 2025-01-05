import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const GRID_SIZE = 4;
const CELL_GAP = 2;
const CELL_SIZE = 20;

interface Position {
  x: number;
  y: number;
}

const Game2048 = () => {
  const [grid, setGrid] = useState<number[][]>(createEmptyGrid());
  const [touchStart, setTouchStart] = useState<Position | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    startGame();
  }, []);

  function createEmptyGrid(): number[][] {
    return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  }

  function startGame() {
    const newGrid = createEmptyGrid();
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
  }

  function addRandomTile(currentGrid: number[][]) {
    const availableCells: Position[] = [];
    currentGrid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 0) {
          availableCells.push({ x, y });
        }
      });
    });

    if (availableCells.length > 0) {
      const { x, y } = availableCells[Math.floor(Math.random() * availableCells.length)];
      currentGrid[y][x] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function move(direction: 'up' | 'down' | 'left' | 'right') {
    const newGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;
    let addedScore = 0;

    const moveAndMerge = (pos: Position, nextPos: Position) => {
      if (newGrid[pos.y][pos.x] === 0) return false;
      if (newGrid[nextPos.y][nextPos.x] === 0) {
        newGrid[nextPos.y][nextPos.x] = newGrid[pos.y][pos.x];
        newGrid[pos.y][pos.x] = 0;
        return true;
      }
      if (newGrid[nextPos.y][nextPos.x] === newGrid[pos.y][pos.x]) {
        newGrid[nextPos.y][nextPos.x] *= 2;
        addedScore += newGrid[nextPos.y][nextPos.x];
        newGrid[pos.y][pos.x] = 0;
        return true;
      }
      return false;
    };

    const processCells = (callback: (i: number, j: number) => void) => {
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          callback(i, j);
        }
      }
    };

    if (direction === 'up') {
      processCells((i, j) => {
        for (let y = i + 1; y < GRID_SIZE; y++) {
          if (moveAndMerge({ x: j, y }, { x: j, y: i })) {
            moved = true;
          }
        }
      });
    } else if (direction === 'down') {
      processCells((i, j) => {
        for (let y = GRID_SIZE - 2 - i; y >= 0; y--) {
          if (moveAndMerge({ x: j, y }, { x: j, y: GRID_SIZE - 1 - i })) {
            moved = true;
          }
        }
      });
    } else if (direction === 'left') {
      processCells((i, j) => {
        for (let x = j + 1; x < GRID_SIZE; x++) {
          if (moveAndMerge({ x, y: i }, { x: j, y: i })) {
            moved = true;
          }
        }
      });
    } else if (direction === 'right') {
      processCells((i, j) => {
        for (let x = GRID_SIZE - 2 - j; x >= 0; x--) {
          if (moveAndMerge({ x, y: i }, { x: GRID_SIZE - 1 - j, y: i })) {
            moved = true;
          }
        }
      });
    }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(score + addedScore);
      
      if (isGameOver(newGrid)) {
        toast({
          title: "Game Over!",
          description: `Final score: ${score + addedScore}`,
        });
      }
    }
  }

  function isGameOver(currentGrid: number[][]) {
    // Check for empty cells
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (currentGrid[y][x] === 0) return false;
      }
    }

    // Check for possible merges
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const current = currentGrid[y][x];
        if (
          (y > 0 && currentGrid[y - 1][x] === current) ||
          (y < GRID_SIZE - 1 && currentGrid[y + 1][x] === current) ||
          (x > 0 && currentGrid[y][x - 1] === current) ||
          (x < GRID_SIZE - 1 && currentGrid[y][x + 1] === current)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 50) {
        move(deltaX > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(deltaY) > 50) {
        move(deltaY > 0 ? 'down' : 'up');
      }
    }
    
    setTouchStart(null);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move('up');
      else if (e.key === 'ArrowDown') move('down');
      else if (e.key === 'ArrowLeft') move('left');
      else if (e.key === 'ArrowRight') move('right');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, score]);

  return (
    <div className="container mx-auto px-4 pb-24 pt-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">2048</h1>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-lg">Score: {score}</div>
          <Button onClick={startGame}>New Game</Button>
        </div>
        
        <div 
          className="bg-neutral rounded-lg p-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid grid-cols-4 gap-2">
            {grid.map((row, y) => 
              row.map((value, x) => (
                <div
                  key={`${y}-${x}`}
                  className={`
                    w-16 h-16 flex items-center justify-center rounded-lg
                    ${value === 0 ? 'bg-muted' : 'bg-primary text-white font-bold'}
                    transition-all duration-100
                  `}
                  style={{
                    backgroundColor: value === 0 ? undefined : `hsl(199, 89%, ${Math.max(20, 57 - Math.log2(value) * 5)}%)`,
                  }}
                >
                  {value !== 0 && value}
                </div>
              ))
            )}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          Use arrow keys or swipe to move tiles. Combine matching numbers to reach 2048!
        </p>
      </div>
    </div>
  );
};

export default Game2048;