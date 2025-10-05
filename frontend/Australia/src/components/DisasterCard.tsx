import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Maximize2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

export interface DisasterData {
  id: string;
  title: string;
  location: string;
  color: string;
  image: string;
  facts: string[];
  description: string;
}

interface DisasterCardProps {
  disaster: DisasterData;
  isActive: boolean;
  position: number;
  onExpand: () => void;
  index: number;
}

export const DisasterCard = ({ disaster, isActive, position, onExpand }: DisasterCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getTransform = () => {
    const baseX = position * 320;
    const absPos = Math.abs(position);
    
    if (position === 0) {
      return {
        x: 0,
        rotateY: 0,
        scale: 1.08,
        z: 100,
        opacity: 1,
      };
    }
    
    if (absPos === 1) {
      // Next/Prev cards
      const rotation = position > 0 ? -38 : 38;
      return {
        x: baseX,
        rotateY: rotation,
        scale: 0.85,
        z: -50,
        opacity: 0.8,
      };
    }
    
    if (absPos === 2) {
      // Cards further away
      const rotation = position > 0 ? -32 : 32;
      return {
        x: baseX,
        rotateY: rotation,
        scale: 0.72,
        z: -100,
        opacity: 0.35,
      };
    }
    
    // Cards too far
    return {
      x: baseX,
      rotateY: position > 0 ? -32 : 32,
      scale: 0.6,
      z: -150,
      opacity: 0,
    };
  };

  const transform = getTransform();
  const isBlurred = Math.abs(position) === 2;

  // Stagger animation for active card content
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.06,
        duration: 0.3,
        ease: [0.22, 0.8, 0.18, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <motion.div
      className="absolute preserve-3d backface-hidden"
      animate={transform}
      transition={{
        duration: 0.6,
        ease: [0.22, 0.8, 0.18, 1],
      }}
      style={{
        zIndex: isActive ? 50 : 10 - Math.abs(position),
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className={`w-[420px] rounded-3xl bg-card overflow-hidden transition-all duration-500 ${
          isBlurred ? 'filter-blur-subtle' : ''
        }`}
        style={{
          borderWidth: '2px',
          borderColor: isActive ? disaster.color : 'transparent',
          boxShadow: isActive
            ? `0 0 40px ${disaster.color}40, 0 20px 60px rgba(0,0,0,0.5)`
            : '0 20px 40px rgba(0,0,0,0.3)',
        }}
        animate={{
          rotateX: isHovered && !isActive && Math.abs(position) === 1 ? -2 : 0,
          rotateZ: isHovered && !isActive && Math.abs(position) === 1 ? (position > 0 ? 2 : -2) : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={disaster.image}
            alt={disaster.title}
            className="w-full h-full object-cover"
            animate={{
              scale: isActive ? 1.02 : isHovered && Math.abs(position) === 1 ? 1.03 : 1,
            }}
            transition={{
              duration: isActive ? 0.18 : 0.3,
              ease: 'easeOut',
            }}
          />
          <div className="absolute top-4 right-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          <motion.div
            initial="hidden"
            animate={isActive ? 'visible' : 'hidden'}
            custom={0}
            variants={contentVariants}
          >
            <h3 className="text-2xl font-bold text-foreground mb-1">{disaster.title}</h3>
            <p className="text-muted-foreground text-sm">{disaster.location}</p>
          </motion.div>

          {isActive && (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                custom={1}
                variants={contentVariants}
              >
                <Button
                  onClick={onExpand}
                  variant="outline"
                  className="w-full group"
                  style={{
                    borderColor: disaster.color,
                    color: disaster.color,
                  }}
                >
                  <Maximize2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Click para ver a pantalla completa
                </Button>
              </motion.div>

              {/* Expandable Details */}
              <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
                custom={2}
                variants={contentVariants}
              >
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-between w-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-sm font-medium">Datos clave</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      showDetails ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <motion.div
                  className="space-y-2 overflow-hidden"
                  animate={{
                    maxHeight: showDetails ? 400 : 0,
                    opacity: showDetails ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 0.8, 0.18, 1] }}
                >
                  {disaster.facts.map((fact, index) => (
                    <motion.div
                      key={index}
                      className="px-4 py-2 rounded-xl bg-secondary/50 border border-border text-sm text-foreground backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: showDetails ? 1 : 0,
                        x: showDetails ? 0 : -20,
                      }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                      }}
                    >
                      {fact}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
