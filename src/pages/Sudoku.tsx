import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Sudoku = () => {
  const [board, setBoard] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [difficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Generate a valid Sudoku puzzle
  const generatePuzzle = () => {
    // Create a solved board first
    const solvedBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    fillBoard(solvedBoard);
    setSolution([...solvedBoard.map(row => [...row])]);

    // Create puzzle by removing numbers
    const puzzle = solvedBoard.map(row => [...row]);
    const cellsToRemove = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 50 : 60;
    
    for (let i = 0; i < cellsToRemove; i++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] === 0) {
        i--;
        continue;
      }
      puzzle[row][col] = 0;
    }
    
    setBoard(puzzle);
  };

  const fillBoard = (board: number[][]) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (const num of shuffleArray(numbers)) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (fillBoard(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const shuffleArray = (array: number[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const isValid = (board: number[][], row: number, col: number, num: number) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] === 0) {
      setSelectedCell([row, col]);
    }
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    
    if (isValid(board, row, col, num)) {
      const newBoard = board.map(row => [...row]);
      newBoard[row][col] = num;
      setBoard(newBoard);
      
      // Check if puzzle is solved
      if (JSON.stringify(newBoard) === JSON.stringify(solution)) {
        toast.success("Congratulations! You solved the puzzle!");
      }
    } else {
      toast.error("Invalid move!");
    }
  };

  useEffect(() => {
    generatePuzzle();
  }, [difficulty]);

  return (
    <div className="container mx-auto px-4 pb-24 pt-4">
      <h1 className="text-2xl font-bold mb-6">Sudoku</h1>
      
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-9 gap-0.5 bg-gray-200 p-0.5 rounded-lg mb-4">
          {board.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square flex items-center justify-center text-lg font-semibold 
                  ${(rowIndex + 1) % 3 === 0 && rowIndex < 8 ? 'border-b-2 border-gray-400' : ''}
                  ${(colIndex + 1) % 3 === 0 && colIndex < 8 ? 'border-r-2 border-gray-400' : ''}
                  ${selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex ? 'bg-blue-200' : 'bg-white'}
                  ${cell === 0 ? 'cursor-pointer hover:bg-blue-50' : 'cursor-not-allowed'}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))
          ))}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              onClick={() => handleNumberInput(num)}
              className="aspect-square text-lg font-semibold"
            >
              {num}
            </Button>
          ))}
          <Button
            variant="default"
            onClick={generatePuzzle}
            className="col-span-5"
          >
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sudoku;