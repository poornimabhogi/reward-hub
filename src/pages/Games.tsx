import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const Games = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 pb-24 pt-4">
      <h1 className="text-2xl font-bold mb-6">Games</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card 
          className="group cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => navigate('/games/2048')}
        >
          <div className="p-4 space-y-4">
            <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/90 to-secondary/90 p-4">
              <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2">
                {[2, 4, 8, 16].map((num, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center rounded-md bg-white/90 font-bold text-lg shadow-sm transition-all group-hover:scale-105"
                    style={{
                      color: num <= 4 ? '#776e65' : '#f9f6f2',
                      backgroundColor: num === 2 ? '#eee4da' : 
                                     num === 4 ? '#ede0c8' : 
                                     num === 8 ? '#f2b179' : '#f59563'
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">2048</h3>
              <p className="text-sm text-muted-foreground">Join the numbers and get to 2048!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Games;