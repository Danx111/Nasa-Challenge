import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarfieldBackground } from '@/components/StarfieldBackground';
import { Carousel3D } from '@/components/Carousel3D';
import { GaiaDock } from '@/components/GaiaDock';
import { DisasterData } from '@/components/DisasterCard';
import { useCarouselTracking } from '@/hooks/useCarouselTracking';

import hurricaneImg from '@/assets/hurricane.jpg';
import earthquakeImg from '@/assets/earthquake.jpg';
import tsunamiImg from '@/assets/tsunami.jpg';
import volcanoImg from '@/assets/volcano.jpg';
import wildfireImg from '@/assets/wildfire.jpg';
import tornadoImg from '@/assets/tornado.jpg';
import floodImg from '@/assets/flood.jpg';

const disasters: DisasterData[] = [
  {
    id: 'hurricane',
    title: 'Huracán Katrina',
    location: 'Nueva Orleans, Estados Unidos',
    color: 'hsl(210, 100%, 50%)',
    image: hurricaneImg,
    description:
      'El huracán Katrina fue uno de los desastres naturales más devastadores en la historia de Estados Unidos. Este ciclón tropical de categoría 5 causó inundaciones catastróficas en Nueva Orleans cuando los diques de protección fallaron.',
    facts: [
      'Categoría 5 con vientos de 280 km/h',
      'Más de 1,800 muertes confirmadas',
      '$125 mil millones en daños',
      '80% de Nueva Orleans quedó inundada',
      'Más de 1 millón de personas evacuadas',
    ],
  },
  {
    id: 'earthquake',
    title: 'Terremoto de Haití',
    location: 'Puerto Príncipe, Haití',
    color: 'hsl(30, 100%, 50%)',
    image: earthquakeImg,
    description:
      'Un devastador terremoto de magnitud 7.0 golpeó Haití en 2010, causando una destrucción masiva en la capital Puerto Príncipe y sus alrededores. Fue uno de los desastres naturales más mortales de la historia moderna.',
    facts: [
      'Magnitud 7.0 en la escala de Richter',
      'Entre 220,000 y 300,000 muertes',
      'Más de 300,000 edificios colapsados',
      '1.5 millones de personas sin hogar',
      'Epicentro a 25 km de Puerto Príncipe',
    ],
  },
  {
    id: 'tsunami',
    title: 'Tsunami del Océano Índico',
    location: 'Sudeste Asiático',
    color: 'hsl(180, 100%, 50%)',
    image: tsunamiImg,
    description:
      'El tsunami del Océano Índico de 2004 fue causado por un terremoto submarino de magnitud 9.1. Las olas gigantes afectaron 14 países, siendo uno de los desastres naturales más mortales registrados.',
    facts: [
      'Terremoto de magnitud 9.1',
      'Más de 230,000 víctimas mortales',
      'Olas de hasta 30 metros de altura',
      'Afectó 14 países diferentes',
      'Energía equivalente a 23,000 bombas atómicas',
    ],
  },
  {
    id: 'volcano',
    title: 'Erupción del Monte Vesubio',
    location: 'Pompeya, Italia',
    color: 'hsl(0, 100%, 50%)',
    image: volcanoImg,
    description:
      'La histórica erupción del Monte Vesubio en el año 79 d.C. sepultó las ciudades romanas de Pompeya y Herculano bajo cenizas volcánicas, preservándolas para la posteridad como un testimonio único de la vida romana.',
    facts: [
      'Erupción en el año 79 d.C.',
      'Ciudades enteras sepultadas en horas',
      'Entre 13,000 y 16,000 víctimas',
      'Columna de ceniza de 33 km de altura',
      'Temperatura de flujos piroclásticos: 400°C',
    ],
  },
  {
    id: 'wildfire',
    title: 'Incendios de Australia',
    location: 'Australia',
    color: 'hsl(15, 100%, 50%)',
    image: wildfireImg,
    description:
      'La temporada de incendios forestales de Australia 2019-2020, conocida como "Verano Negro", quemó una superficie sin precedentes, destruyendo millones de hectáreas y afectando gravemente la biodiversidad única del país.',
    facts: [
      'Más de 18 millones de hectáreas quemadas',
      '34 personas fallecidas directamente',
      '3,000 millones de animales afectados',
      '3,500 hogares destruidos',
      'Humo visible desde el espacio',
    ],
  },
  {
    id: 'tornado',
    title: 'Tornado de Joplin',
    location: 'Missouri, Estados Unidos',
    color: 'hsl(270, 100%, 50%)',
    image: tornadoImg,
    description:
      'El tornado de Joplin de 2011 fue uno de los más destructivos en la historia de Estados Unidos. Clasificado como EF5, el tornado devastó gran parte de la ciudad, convirtiéndose en el séptimo tornado más mortífero del país.',
    facts: [
      'Clasificación EF5 (máxima intensidad)',
      '161 muertes confirmadas',
      'Vientos superiores a 320 km/h',
      'Daños por $2.8 mil millones',
      'Destrucción del 25% de la ciudad',
    ],
  },
  {
    id: 'flood',
    title: 'Inundaciones de China',
    location: 'Río Yangtze, China',
    color: 'hsl(165, 100%, 40%)',
    image: floodImg,
    description:
      'Las devastadoras inundaciones de 1931 en China fueron causadas por lluvias excesivas y el desbordamiento del río Yangtze. Considerado uno de los desastres naturales más mortales de la historia moderna.',
    facts: [
      'Entre 1 y 4 millones de víctimas',
      'Área afectada: 180,000 km²',
      'Más de 28 millones de personas afectadas',
      'Cultivos destruidos en 21 millones de hectáreas',
      'Duración: julio a noviembre de 1931',
    ],
  },
];

const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const activeDisaster = disasters[activeIndex];
  const counterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    visitedCards,
    chatState,
    markCardAsVisited,
    markChatAsReady,
    shouldShowUnlockMessage,
    dismissUnlockMessage,
    trackActiveCard,
  } = useCarouselTracking(disasters.length);

  // Animated counter
  useEffect(() => {
    if (counterTimeoutRef.current) {
      clearTimeout(counterTimeoutRef.current);
    }

    const step = activeIndex > displayedIndex ? 1 : -1;
    const animate = () => {
      setDisplayedIndex((prev) => {
        if (prev === activeIndex) return prev;
        return prev + step;
      });
    };

    if (displayedIndex !== activeIndex) {
      counterTimeoutRef.current = setTimeout(animate, 120);
    }

    return () => {
      if (counterTimeoutRef.current) {
        clearTimeout(counterTimeoutRef.current);
      }
    };
  }, [activeIndex, displayedIndex]);

  const handleCardActive = useCallback(
    (index: number) => {
      trackActiveCard(index);
    },
    [trackActiveCard]
  );

  return (
    <div className="relative min-h-screen overflow-hidden" role="main" aria-label="Desastres Naturales">
      {/* Background */}
      <StarfieldBackground />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen pb-32 pt-16">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-12rem)]">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-8xl font-bold text-foreground mb-4 tracking-tight">
                  Desastres
                  <br />
                  Naturales
                </h1>
                <motion.div
                  className="h-1 w-32 bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 128 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </motion.div>

              <motion.div
                className="space-y-3 text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.h2
                  key={activeDisaster.id}
                  className="font-semibold text-3xl"
                  style={{ color: activeDisaster.color }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {activeDisaster.title}
                </motion.h2>
                <motion.p
                  key={`location-${activeDisaster.id}`}
                  className="text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {activeDisaster.location}
                </motion.p>
              </motion.div>

              {/* Progress Indicator */}
              <div className="space-y-4" aria-live="polite">
                <motion.p
                  className="text-muted-foreground text-lg"
                  key={displayedIndex}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12 }}
                >
                  {displayedIndex + 1} / {disasters.length}
                </motion.p>
                <div className="flex gap-3" role="tablist" aria-label="Navegación de desastres">
                  {disasters.map((disaster, index) => (
                    <button
                      key={disaster.id}
                      onClick={() => setActiveIndex(index)}
                      className="group relative"
                      role="tab"
                      aria-selected={index === activeIndex}
                      aria-label={`${disaster.title} - ${visitedCards.has(index) ? 'visitada' : 'no visitada'}`}
                      tabIndex={index === activeIndex ? 0 : -1}
                    >
                      <motion.div
                        className={`w-3 h-3 rounded-full transition-all duration-300`}
                        animate={{
                          scale: index === activeIndex ? 1.25 : 1,
                          opacity: visitedCards.has(index) ? 1 : 0.3,
                        }}
                        style={{
                          backgroundColor: index === activeIndex ? disaster.color : '#666',
                          boxShadow:
                            index === activeIndex ? `0 0 20px ${disaster.color}` : 'none',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Text */}
              <AnimatePresence>
                {visitedCards.size < disasters.length && (
                  <motion.p
                    className="text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Exploradas: {visitedCards.size} de {disasters.length}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - 3D Carousel */}
            <div className="h-[800px]">
              <Carousel3D
                disasters={disasters}
                onIndexChange={setActiveIndex}
                onCardActive={handleCardActive}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Dock */}
      <GaiaDock
        chatState={chatState}
        onChatReady={markChatAsReady}
        showUnlockMessage={shouldShowUnlockMessage}
        onDismissUnlockMessage={dismissUnlockMessage}
        visitedCount={visitedCards.size}
        totalCount={disasters.length}
      />
    </div>
  );
};

export default Index;
