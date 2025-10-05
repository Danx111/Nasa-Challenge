import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Katrina = () => {
  const hurricaneRef = useRef<HTMLDivElement>(null);
  const dataCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!hurricaneRef.current) return;
      
      const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const translateY = scrollProgress * 150; // Hurricane moves down
      const rotate = scrollProgress * 720; // Spins as it descends
      
      hurricaneRef.current.style.transform = `translateY(${translateY}vh) rotate(${rotate}deg)`;
      
      // Background darkening
      const darkness = Math.min(scrollProgress * 0.6, 0.6);
      document.body.style.backgroundColor = `rgb(${15 * (1 - darkness)}, ${23 * (1 - darkness)}, ${42 * (1 - darkness)})`;
      
      // Show data cards at the end
      if (dataCardsRef.current) {
        const cardsVisible = scrollProgress > 0.7;
        dataCardsRef.current.style.opacity = cardsVisible ? "1" : "0";
        dataCardsRef.current.style.transform = cardsVisible ? "translateY(0)" : "translateY(50px)";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-[300vh] bg-gradient-to-b from-sky-300 via-slate-700 to-slate-950 relative overflow-hidden">
      {/* Hurricane Animation */}
      <div
        ref={hurricaneRef}
        className="fixed top-10 left-1/2 -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 pointer-events-none z-10 transition-transform duration-100"
      >
        <div className="text-[12rem] leading-none">🌀</div>
      </div>

      {/* Hurricane Path Illustration */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 1100 -100 Q 900 200, 800 400 Q 700 600, 500 800 Q 400 900, 350 1200"
          stroke="rgba(59, 130, 246, 0.5)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="10,10"
        />
      </svg>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-20">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8 font-semibold group sticky top-8"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        {/* Spacer for scroll */}
        <div className="h-[120vh]"></div>

        {/* Data Cards Section */}
        <div
          ref={dataCardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16 transition-all duration-700"
          style={{ opacity: 0, transform: "translateY(50px)" }}
        >
          <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-blue-500/30 rounded-2xl p-8 text-white">
            <div className="text-5xl mb-4">💨</div>
            <h3 className="text-2xl font-bold mb-3">Categoría 5</h3>
            <p className="text-slate-300">Vientos sostenidos de más de 280 km/h</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-blue-500/30 rounded-2xl p-8 text-white">
            <div className="text-5xl mb-4">💧</div>
            <h3 className="text-2xl font-bold mb-3">80% Inundado</h3>
            <p className="text-slate-300">Nueva Orleans quedó bajo el agua</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-blue-500/30 rounded-2xl p-8 text-white">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-2xl font-bold mb-3">1,800+ Víctimas</h3>
            <p className="text-slate-300">Más de un millón de desplazados</p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-blue-500/30 rounded-2xl p-8 text-white">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-2xl font-bold mb-3">$125 Mil Millones</h3>
            <p className="text-slate-300">En daños económicos totales</p>
          </div>
        </div>

        {/* Chat AI Container */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="chat-ia bg-slate-900/50 backdrop-blur-sm border-2 border-blue-500/30 rounded-3xl p-12 text-center">
            <div className="text-4xl mb-4">🌐</div>
            <p className="text-xl text-slate-300">Cargando asistente virtual…</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Katrina;
