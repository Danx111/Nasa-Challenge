import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Globe3D from "@/components/ui/Globe3D";
import katrinaImage from "@/assets/hurricane-katrina.jpg";
import fireImage from "@/assets/kangaroo-island-fire.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [targetLocation, setTargetLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedDisaster, setSelectedDisaster] = useState<string | null>(null);

  // <-- CAMBIO 1: He cambiado el tipo de "disaster" para aceptar el nuevo valor "australia"
  const handleDisasterClick = (disaster: "katrina" | "fire" | "australia") => {
    if (disaster === "katrina") {
      setTargetLocation({ lat: 30, lon: -90 }); // New Orleans
      setSelectedDisaster("/katrina");
    } else if (disaster === "australia") { // <-- CAMBIO 2: He añadido un nuevo "else if" para la nueva página
      setTargetLocation({ lat: -35.8, lon: 137 }); // Kangaroo Island (misma ubicación que 'fire')
      setSelectedDisaster("/australia");
    } else { // <-- CAMBIO 3: 'fire' ahora es el caso por defecto (o puedes cambiarlo si lo deseas)
      setTargetLocation({ lat: -35.8, lon: 137 }); // Kangaroo Island
      setSelectedDisaster("/kangaroo-island");
    }
  };

  const handleAnimationComplete = () => {
    if (selectedDisaster) {
      setTimeout(() => {
        navigate(selectedDisaster);
      }, 500);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3RhcnMiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4zIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMS41IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMzAiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxMjAiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjE1MCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuNCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzdGFycykiLz48L3N2Zz4=')] opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[90vh]">
          {/* Left side - Cards */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
              ¿Qué desastre quieres explorar?
            </h1>
            
            <button
              onClick={() => handleDisasterClick("katrina")}
              className="w-full group relative overflow-hidden rounded-3xl transition-transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative flex items-center gap-6 p-6 bg-slate-900/80 backdrop-blur-sm border-2 border-blue-500/30 rounded-3xl">
                <div className="text-6xl">🌀</div>
                <div className="flex-1 text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">Huracán Katrina</h2>
                  <p className="text-slate-300">Nueva Orleans, Estados Unidos</p>
                </div>
                <img src={katrinaImage} alt="" className="w-32 h-32 object-cover rounded-2xl" />
              </div>
            </button>

            <button
              // <-- CAMBIO 4: El `onClick` de este botón ahora llama a "australia"
              onClick={() => handleDisasterClick("australia")}
              className="w-full group relative overflow-hidden rounded-3xl transition-transform hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-500 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative flex items-center gap-6 p-6 bg-slate-900/80 backdrop-blur-sm border-2 border-orange-500/30 rounded-3xl">
                <div className="text-6xl">🔥</div>
                <div className="flex-1 text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">Incendios en Australia</h2>
                  <p className="text-slate-300">Isla Canguro, Australia</p>
                </div>
                <img src={fireImage} alt="" className="w-32 h-32 object-cover rounded-2xl" />
              </div>
            </button>
          </div>

          {/* Right side - 3D Globe */}
          <div className="h-[600px] animate-scale-in">
            <Globe3D targetLocation={targetLocation} onAnimationComplete={handleAnimationComplete} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;