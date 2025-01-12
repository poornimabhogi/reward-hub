import { MonthlyEvent } from "@/components/lucky-draw/MonthlyEvent";

const LuckyDraw = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lucky Draw</h1>
      <MonthlyEvent totalAccumulation={10000} />
    </div>
  );
};

export default LuckyDraw;