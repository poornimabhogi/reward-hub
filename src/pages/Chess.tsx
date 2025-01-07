import { useState } from "react";
import { Chess, Square } from "chess.js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rotate3D, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ChessGame = () => {
  const [game] = useState<Chess>(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");
  const [, setForceUpdate] = useState({});
  const { toast } = useToast();

  const resetGame = () => {
    game.reset();
    setSelectedSquare(null);
    setForceUpdate({});
    toast({
      title: "Game Reset",
      description: "A new game has started!",
    });
  };

  const handleSquareClick = (square: Square) => {
    if (selectedSquare === null) {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
      }
    } else {
      try {
        game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        });
        setForceUpdate({});
        
        if (game.isGameOver()) {
          let status = "Game Over - ";
          if (game.isCheckmate()) status += "Checkmate!";
          else if (game.isDraw()) status += "Draw!";
          else if (game.isStalemate()) status += "Stalemate!";
          
          toast({
            title: "Game Over",
            description: status,
          });
        }
      } catch (e) {
        // Invalid move
      }
      setSelectedSquare(null);
    }
  };

  const flipBoard = () => {
    setBoardOrientation(prev => prev === "white" ? "black" : "white");
  };

  const renderBoard = () => {
    const rows = boardOrientation === "white" ? "87654321" : "12345678";
    const cols = boardOrientation === "white" ? "abcdefgh" : "hgfedcba";
    const board = [];

    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        const square = `${cols[j]}${rows[i]}` as Square;
        const piece = game.get(square);
        const isSelected = square === selectedSquare;
        const isDark = (i + j) % 2 === 1;

        row.push(
          <div
            key={square}
            onClick={() => handleSquareClick(square)}
            className={`w-12 h-12 flex items-center justify-center text-3xl cursor-pointer select-none
              ${isDark ? 'bg-neutral-300' : 'bg-white'}
              ${isSelected ? 'ring-2 ring-primary' : ''}
              hover:opacity-80 transition-opacity`}
          >
            {piece && getPieceSymbol(piece)}
          </div>
        );
      }
      board.push(
        <div key={i} className="flex">
          {row}
        </div>
      );
    }
    return board;
  };

  const getPieceSymbol = (piece: { type: string; color: string }) => {
    const symbols: { [key: string]: { [key: string]: string } } = {
      p: { white: "♙", black: "♟" },
      n: { white: "♘", black: "♞" },
      b: { white: "♗", black: "♝" },
      r: { white: "♖", black: "♜" },
      q: { white: "♕", black: "♛" },
      k: { white: "♔", black: "♚" },
    };
    return symbols[piece.type][piece.color];
  };

  return (
    <div className="container mx-auto px-4 pb-24 pt-4">
      <h1 className="text-2xl font-bold mb-6">Chess</h1>
      <Card className="p-6 max-w-md mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-lg">
            {renderBoard()}
          </div>
          <div className="flex gap-2">
            <Button onClick={resetGame} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>
            <Button onClick={flipBoard} variant="outline" size="sm">
              <Rotate3D className="w-4 h-4 mr-2" />
              Flip Board
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChessGame;