import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const KangarooIsland = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollPrev = () => {
    emblaApi?.scrollPrev();
  };

  const scrollNext = () => {
    emblaApi?.scrollNext();
  };

  const carouselItems = [
    { type: "video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", title: "Inicio del incendio" },
    { type: "video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", title: "Animales huyendo" },
    { type: "video", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", title: "Rescate de brigadistas" },
    { type: "image", src: "https://images.unsplash.com/photo-1574594500865-9fb59e32dc36?w=800", title: "Afectación al ecosistema" },
    { type: "image", src: "https://images.unsplash.com/photo-1597081771806-f8c3fcbe0a3d?w=800", title: "Daños a viviendas" },
    { type: "image", src: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800", title: "Animales salvados" },
    { type: "image", src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800", title: "Voluntarios ayudando" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-8 font-semibold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        <header className="text-center mb-12 animate-fade-in">
          <div className="text-7xl mb-6 animate-float">🔥</div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Incendios en Australia
          </h1>
          <p className="text-xl text-slate-300">Isla Canguro</p>
        </header>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
            <div className="flex">
              {carouselItems.map((item, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                  <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden">
                    {item.type === "video" ? (
                      <video
                        src={item.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={scrollPrev}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {carouselItems.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-orange-500" : "w-2 bg-slate-600"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={scrollNext}
              className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat AI Container */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="chat-ia bg-slate-900/50 backdrop-blur-sm border-2 border-orange-500/30 rounded-3xl p-12 text-center">
            <div className="text-4xl mb-4">🌐</div>
            <p className="text-xl text-slate-300">Cargando asistente virtual…</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default KangarooIsland;
