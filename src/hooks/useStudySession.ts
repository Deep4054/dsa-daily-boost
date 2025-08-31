import { useState, useEffect } from "react";

interface StudySessionState {
  isActive: boolean;
  currentTopic: string | null;
  currentTopicTitle: string | null;
  startTime: number | null;
  timeLeft: number;
  pendingUpdates: { [topicId: string]: number };
}

const STORAGE_KEY = 'dsa-study-session';

export const useStudySession = () => {
  const [sessionState, setSessionState] = useState<StudySessionState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if session is still valid and calculate remaining time
      if (parsed.startTime && parsed.isActive && Date.now() - parsed.startTime < 2 * 60 * 60 * 1000) {
        const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
        const remainingTime = Math.max(0, 25 * 60 - elapsed);
        return {
          ...parsed,
          timeLeft: remainingTime,
          pendingUpdates: parsed.pendingUpdates || {}
        };
      }
    }
    return {
      isActive: false,
      currentTopic: null,
      currentTopicTitle: null,
      startTime: null,
      timeLeft: 25 * 60,
      pendingUpdates: {}
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (sessionState.isActive) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionState));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [sessionState]);

  // Sync timer across tabs using storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const newSession = JSON.parse(e.newValue);
        setSessionState(newSession);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const startSession = (categoryName: string, topicTitle: string, duration: number = 25 * 60) => {
    const newState = {
      isActive: true,
      currentTopic: categoryName,
      currentTopicTitle: topicTitle,
      startTime: Date.now(),
      timeLeft: duration,
      pendingUpdates: {}
    };
    setSessionState(newState);
  };

  const endSession = () => {
    setSessionState({
      isActive: false,
      currentTopic: null,
      currentTopicTitle: null,
      startTime: null,
      timeLeft: 25 * 60,
      pendingUpdates: {}
    });
  };

  const updateTimeLeft = (timeLeft: number) => {
    setSessionState(prev => ({ ...prev, timeLeft }));
  };

  const switchTopic = (categoryName: string, topicTitle: string) => {
    setSessionState(prev => ({
      ...prev,
      currentTopic: categoryName,
      currentTopicTitle: topicTitle
    }));
  };

  const addPendingUpdate = (topicId: string) => {
    setSessionState(prev => ({
      ...prev,
      pendingUpdates: {
        ...prev.pendingUpdates,
        [topicId]: (prev.pendingUpdates[topicId] || 0) + 1
      }
    }));
  };

  return {
    sessionState,
    startSession,
    endSession,
    updateTimeLeft,
    switchTopic,
    addPendingUpdate
  };
};