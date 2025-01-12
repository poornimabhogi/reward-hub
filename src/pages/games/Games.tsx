import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Games = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate('/games/2048')}
          className="h-32 text-lg"
        >
          Play 2048
        </Button>
        <Button 
          onClick={() => navigate('/games/sudoku')}
          className="h-32 text-lg"
        >
          Play Sudoku
        </Button>
      </div>
    </div>
  );
};

export default Games;