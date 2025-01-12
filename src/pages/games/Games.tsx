import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Game2048 from "./Game2048";
import Sudoku from "./Sudoku";

const Games = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<"2048" | "sudoku" | null>(null);

  useEffect(() => {
    if (selectedGame) {
      navigate(`/games/${selectedGame}`);
    }
  }, [selectedGame, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Choose a Game</h1>
      <div className="flex flex-col space-y-4">
        <Button onClick={() => setSelectedGame("2048")}>Play 2048</Button>
        <Button onClick={() => setSelectedGame("sudoku")}>Play Sudoku</Button>
      </div>
    </div>
  );
};

export default Games;