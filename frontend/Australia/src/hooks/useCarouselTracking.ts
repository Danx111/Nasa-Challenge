import { useState, useEffect, useCallback, useRef } from 'react';

export type ChatState = 'locked' | 'primed' | 'ready';

interface UseCarouselTrackingReturn {
  visitedCards: Set<number>;
  chatState: ChatState;
  allCardsVisited: boolean;
  markCardAsVisited: (index: number) => void;
  markChatAsReady: () => void;
  shouldShowUnlockMessage: boolean;
  dismissUnlockMessage: () => void;
  trackActiveCard: (index: number) => void;
}

export const useCarouselTracking = (totalCards: number): UseCarouselTrackingReturn => {
  const [visitedCards, setVisitedCards] = useState<Set<number>>(new Set());
  const [chatState, setChatState] = useState<ChatState>('locked');
  const [shouldShowUnlockMessage, setShouldShowUnlockMessage] = useState(false);
  const activeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentActiveIndexRef = useRef<number | null>(null);

  const allCardsVisited = visitedCards.size === totalCards;

  const markCardAsVisited = useCallback((index: number) => {
    setVisitedCards((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  }, []);

  const markChatAsReady = useCallback(() => {
    setChatState('ready');
    setShouldShowUnlockMessage(false);
  }, []);

  const dismissUnlockMessage = useCallback(() => {
    setShouldShowUnlockMessage(false);
  }, []);

  // Track when a card becomes active for 700ms
  const trackActiveCard = useCallback((index: number) => {
    // Clear previous timeout
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
    }

    currentActiveIndexRef.current = index;

    // Set timeout to mark as visited after 700ms
    activeTimeoutRef.current = setTimeout(() => {
      if (currentActiveIndexRef.current === index) {
        markCardAsVisited(index);
      }
    }, 700);
  }, [markCardAsVisited]);

  // Effect to handle chat state transitions
  useEffect(() => {
    if (allCardsVisited && chatState === 'locked') {
      setChatState('primed');
      setShouldShowUnlockMessage(true);
    }
  }, [allCardsVisited, chatState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
      }
    };
  }, []);

  return {
    visitedCards,
    chatState,
    allCardsVisited,
    markCardAsVisited,
    markChatAsReady,
    shouldShowUnlockMessage,
    dismissUnlockMessage,
    trackActiveCard,
  };
};
