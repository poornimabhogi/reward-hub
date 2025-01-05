import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";

const Games = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 pb-24 pt-4">
      <h1 className="text-2xl font-bold mb-6">Games</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card 
          className="p-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-neutral/50 transition-colors"
          onClick={() => navigate('/games/2048')}
        >
          <Gamepad2 className="w-12 h-12 text-primary" />
          <span className="font-medium">2048</span>
        </Card>
      </div>
    </div>
  );
};

export default Games;