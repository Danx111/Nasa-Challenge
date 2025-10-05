import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DisasterCard, DisasterData } from './DisasterCard';
import { FullscreenModal } from './FullscreenModal';
import { Button } from './ui/button';

interface Carousel3DProps {
  disasters: DisasterData[];
  onIndexChange: (index: number) => void;
  onCardActive: (index: number) => void;
}

export const Carousel3D = ({ disasters, onIndexChange, onCardActive }: Carousel3DProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenDisaster, setFullscreenDisaster] = useState<DisasterData | null>(null);
  const [backgroundGlow, setBackgroundGlow] = useState(false);
  const dragX = useMotionValue(0);
  const dragXSpring = useSpring(dragX, {
    stiffness: 300,
    damping: 30,
  });

  const lastWheelTime = useRef(0);
  const wheelThrottle = 500; // ms

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % disasters.length);
    setBackgroundGlow(true);
    setTimeout(() => setBackgroundGlow(false), 250);
  }, [disasters.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + disasters.length) % disasters.length);
    setBackgroundGlow(true);
    setTimeout(() => setBackgroundGlow(false), 250);
  }, [disasters.length]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const velocity = info.velocity.x;
      const offset = info.offset.x;

      // Calculate snap with inertia
      if (Math.abs(velocity) > 500 || Math.abs(offset) > 100) {
        if (velocity > 0 || offset > 0) {
          handlePrev();
        } else {
          handleNext();
        }
      }

      // Reset drag
      dragX.set(0);
    },
    [dragX, handleNext, handlePrev]
  );

  useEffect(() => {
    onIndexChange(activeIndex);
    onCardActive(activeIndex);
  }, [activeIndex, onIndexChange, onCardActive]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < wheelThrottle) return;

      if (Math.abs(e.deltaY) > 10) {
        lastWheelTime.current = now;
        if (e.deltaY > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleNext, handlePrev]);

  return (
    <>
      {/* Reactive background glow */}
      {backgroundGlow && (
        <div className="fixed -right-64 top-0 w-[800px] h-[800px] rounded-full bg-gradient-radial from-blue-500/30 via-purple-500/15 to-transparent blur-[100px] pointer-events-none z-0 animate-glow-pulse" />
      )}

      <motion.div
        className="relative w-full h-full flex items-center justify-center perspective-1000"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x: dragXSpring }}
      >
        {/* Carousel Container */}
        <div className="relative w-[420px] h-[700px] preserve-3d">
          {disasters.map((disaster, index) => {
            const position = index - activeIndex;
            return (
              <DisasterCard
                key={disaster.id}
                disaster={disaster}
                isActive={index === activeIndex}
                position={position}
                onExpand={() => setFullscreenDisaster(disaster)}
                index={index}
              />
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <Button
          onClick={handlePrev}
          size="icon"
          variant="outline"
          className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-secondary/80 backdrop-blur-sm border-border hover:scale-110 transition-all z-50"
          style={{
            boxShadow: `0 0 20px ${disasters[activeIndex].color}20`,
          }}
          aria-label="Tarjeta anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          onClick={handleNext}
          size="icon"
          variant="outline"
          className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-secondary/80 backdrop-blur-sm border-border hover:scale-110 transition-all z-50"
          style={{
            boxShadow: `0 0 20px ${disasters[activeIndex].color}20`,
          }}
          aria-label="Siguiente tarjeta"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Fullscreen Modal */}
      {fullscreenDisaster && (
        <FullscreenModal
          disaster={fullscreenDisaster}
          onClose={() => setFullscreenDisaster(null)}
        />
      )}
    </>
  );
};
