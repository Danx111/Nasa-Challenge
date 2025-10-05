import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { ChatState } from '@/hooks/useCarouselTracking';

interface GaiaDockProps {
  chatState: ChatState;
  onChatReady: () => void;
  showUnlockMessage: boolean;
  onDismissUnlockMessage: () => void;
  visitedCount: number;
  totalCount: number;
}

export const GaiaDock = ({
  chatState,
  onChatReady,
  showUnlockMessage,
  onDismissUnlockMessage,
  visitedCount,
  totalCount,
}: GaiaDockProps) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const isLocked = chatState === 'locked';
  const isPrimed = chatState === 'primed';

  const handleSend = () => {
    if (!message.trim() || isLocked) return;

    if (isPrimed) {
      onChatReady();
      onDismissUnlockMessage();
    }

    // Simulate AI response
    setResponse(
      `Gaia: Interesante perspectiva sobre "${message}". Tu compromiso con el cambio es fundamental para construir un futuro más resiliente.`
    );
    setMessage('');

    // Clear response after 5 seconds
    setTimeout(() => setResponse(''), 5000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleAttemptInteraction = () => {
    if (isLocked) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 120);

      toast.error('Explora primero', {
        description: `Recorre las ${totalCount} tarjetas para contarnos tu idea. Progreso: ${visitedCount}/${totalCount}`,
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (showUnlockMessage && isPrimed) {
      toast.success('¡Chat desbloqueado!', {
        description: 'Pero no solo queremos darte información, queremos saber qué harías tú para ser parte de la solución.',
        duration: 6000,
      });
    }
  }, [showUnlockMessage, isPrimed]);

  const getPlaceholder = () => {
    if (isLocked) return 'Explora las tarjetas para continuar…';
    return 'Pregúntale a Gaia…';
  };

  return (
    <>
      {/* Response Bubble */}
      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 max-w-2xl z-50"
          >
            <div className="px-6 py-4 rounded-2xl bg-card/95 backdrop-blur-md border border-primary/30 shadow-2xl">
              <p className="text-foreground">{response}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock Message Bubble */}
      <AnimatePresence>
        {showUnlockMessage && isPrimed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 max-w-2xl z-50"
          >
            <div className="px-8 py-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-md border-2 border-primary/40 shadow-2xl">
              <p className="text-foreground text-lg font-medium text-center">
                Pero no solo queremos darte información, queremos saber qué harías tú para ser parte
                de la solución.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock */}
      <motion.div
        ref={dockRef}
        className={`fixed bottom-0 left-0 right-0 h-24 bg-card/90 backdrop-blur-xl border-t border-border z-40 ${
          isShaking ? 'animate-shake' : ''
        }`}
        animate={{
          borderColor: isPrimed ? 'hsl(var(--primary))' : 'hsl(var(--border))',
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-6xl mx-auto h-full flex items-center gap-6 px-8">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <motion.div
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
              animate={{
                scale: isPrimed ? [1, 1.1, 1] : 1,
                boxShadow: isPrimed
                  ? [
                      '0 0 20px hsl(var(--primary) / 0.5)',
                      '0 0 40px hsl(var(--primary) / 0.8)',
                      '0 0 20px hsl(var(--primary) / 0.5)',
                    ]
                  : '0 0 20px hsl(var(--primary) / 0.3)',
              }}
              transition={{
                duration: isPrimed ? 0.5 : 0.3,
                repeat: isPrimed ? 2 : 0,
              }}
            >
              {isLocked && (
                <Lock className="absolute -top-1 -right-1 w-5 h-5 text-muted-foreground bg-card rounded-full p-1" />
              )}
              <Sparkles className="w-7 h-7 text-foreground" />
            </motion.div>
            <div>
              <p className="font-semibold text-foreground">Gaia</p>
              <p className="text-xs text-muted-foreground">
                {isLocked ? `${visitedCount}/${totalCount} tarjetas` : 'Asistente IA'}
              </p>
            </div>
          </div>

          {/* Input Field */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleAttemptInteraction}
              onClick={handleAttemptInteraction}
              placeholder={getPlaceholder()}
              disabled={isLocked}
              aria-disabled={isLocked}
              className="w-full h-12 bg-secondary/50 border-border rounded-2xl px-6 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            size="icon"
            disabled={isLocked || !message.trim()}
            aria-disabled={isLocked}
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg hover:shadow-primary/50 hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Enviar mensaje"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </>
  );
};
