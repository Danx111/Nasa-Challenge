import { useEffect } from 'react';
import { X } from 'lucide-react';
import { DisasterData } from './DisasterCard';
import { Button } from './ui/button';

interface FullscreenModalProps {
  disaster: DisasterData;
  onClose: () => void;
}

export const FullscreenModal = ({ disaster, onClose }: FullscreenModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] h-[90vh] rounded-3xl bg-card overflow-hidden animate-scale-in"
        style={{
          borderWidth: '3px',
          borderColor: disaster.color,
          boxShadow: `0 0 60px ${disaster.color}60`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-secondary/80 backdrop-blur-sm hover:scale-110 transition-all"
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="flex h-full">
          {/* Image Section */}
          <div className="flex-1 relative overflow-hidden">
            <img
              src={disaster.image}
              alt={disaster.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
          </div>

          {/* Content Section */}
          <div className="w-[480px] p-12 overflow-y-auto">
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold text-foreground mb-4">{disaster.title}</h2>
                <p className="text-xl text-muted-foreground">{disaster.location}</p>
              </div>

              <p className="text-lg text-foreground/90 leading-relaxed">{disaster.description}</p>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Datos Clave</h3>
                <div className="space-y-3">
                  {disaster.facts.map((fact, index) => (
                    <div
                      key={index}
                      className="px-6 py-4 rounded-2xl bg-secondary/60 border border-border backdrop-blur-sm text-foreground"
                      style={{
                        borderLeftWidth: '4px',
                        borderLeftColor: disaster.color,
                      }}
                    >
                      {fact}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
