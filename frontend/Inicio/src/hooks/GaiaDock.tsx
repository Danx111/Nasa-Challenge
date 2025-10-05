import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { ChatState } from '@/hooks/useCarouselTracking';

// --- CAMBIO 1: Definir un tipo para los mensajes del chat ---
type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

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
  const [userInput, setUserInput] = useState(''); // Renombrado de 'message' a 'userInput' para claridad
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]); // Para guardar la conversación
  const [isLoading, setIsLoading] = useState(false); // Para saber si la IA está "pensando"
  
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const isLocked = chatState === 'locked';
  const isPrimed = chatState === 'primed';

  // --- CAMBIO 2: Lógica de envío completamente nueva ---
  const handleSend = async () => {
    if (!userInput.trim() || isLocked || isLoading) return;

    if (isPrimed) {
      onChatReady();
      onDismissUnlockMessage();
    }

    const newUserMessage: ChatMessage = { role: 'user', text: userInput };
    const currentHistory = [...chatHistory, newUserMessage];

    setChatHistory(currentHistory); // Muestra el mensaje del usuario
    setUserInput(''); // Limpia el input
    setIsLoading(true); // Muestra que estamos esperando a la IA

    try {
      // ¡LA LLAMADA REAL A LA API!
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos el último mensaje y el historial previo
        body: JSON.stringify({ message: userInput, history: chatHistory }), 
      });

      if (!response.ok) {
        throw new Error(`Error del backend: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = { role: 'assistant', text: data.reply };

      // Añade la respuesta de la IA al historial
      setChatHistory([...currentHistory, assistantMessage]);

    } catch (error) {
      console.error("Error al conectar con la API:", error);
      const errorMessage: ChatMessage = { role: 'assistant', text: "Lo siento, hubo un error de conexión con la IA. Inténtalo de nuevo." };
      setChatHistory([...currentHistory, errorMessage]);
    } finally {
      setIsLoading(false); // La IA ha terminado
    }
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
  
  // --- CAMBIO 3: Mensaje de bienvenida de la IA al desbloquear el chat ---
  useEffect(() => {
    const getWelcomeMessage = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: "Hola, preséntate brevemente.", history: [] }), 
            });
            if (!response.ok) throw new Error("Error de conexión");
            
            const data = await response.json();
            setChatHistory([{ role: 'assistant', text: data.reply }]);

            toast.success('¡Chat desbloqueado!', {
              description: 'Ahora puedes hablar con Gaia.',
              duration: 6000,
            });

        } catch (error) {
            setChatHistory([{ role: 'assistant', text: "Error de conexión. No pude contactar a la IA." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (showUnlockMessage && isPrimed) {
        getWelcomeMessage();
        onDismissUnlockMessage(); // Marcamos el mensaje como visto
    }
  }, [showUnlockMessage, isPrimed, onDismissUnlockMessage]);


  const getPlaceholder = () => {
    if (isLocked) return 'Explora las tarjetas para continuar…';
    if (isLoading) return 'Gaia está pensando...';
    return 'Escribe tu idea o pregunta...';
  };

  return (
    <>
      {/* --- CAMBIO 4: Mostrar el historial del chat en lugar de una sola respuesta --- */}
      {/* (Este código se puede mover a un componente separado más tarde) */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 flex flex-col items-center gap-2">
        <AnimatePresence>
            {chatHistory.slice(-3).map((chat, index) => ( // Mostramos los últimos 3 mensajes
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`w-full flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                  <div className={`px-4 py-2 rounded-2xl border shadow-lg max-w-[80%] ${
                      chat.role === 'user' 
                      ? 'bg-primary/90 text-primary-foreground border-primary/30 rounded-br-none' 
                      : 'bg-card/95 backdrop-blur-md border-border rounded-bl-none'
                  }`}>
                      <p>{chat.text}</p>
                  </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Dock (Sin cambios mayores, solo las variables conectadas) */}
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
          {/* Avatar (sin cambios) */}
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

          {/* Input Field (conectado a userInput) */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleAttemptInteraction}
              onClick={handleAttemptInteraction}
              placeholder={getPlaceholder()}
              disabled={isLocked || isLoading}
              aria-disabled={isLocked || isLoading}
              className="w-full h-12 bg-secondary/50 border-border rounded-2xl px-6 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Send Button (conectado a isLoading) */}
          <Button
            onClick={handleSend}
            size="icon"
            disabled={isLocked || !userInput.trim() || isLoading}
            aria-disabled={isLocked || isLoading}
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