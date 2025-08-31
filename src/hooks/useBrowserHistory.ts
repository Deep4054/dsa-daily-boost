import { useState, useEffect } from "react";

interface BrowserHistoryEntry {
  url: string;
  title: string;
  timestamp: string;
  visitDuration?: number;
}

interface StoredSession {
  history: BrowserHistoryEntry[];
  startTime: number;
  topicId: string;
  topicTitle: string;
}

const HISTORY_STORAGE_KEY = 'dsa-browser-history';
const COMPLETED_SESSIONS_KEY = 'dsa-completed-sessions';

export const useBrowserHistory = () => {
  const [history, setHistory] = useState<BrowserHistoryEntry[]>([]);
  const [completedSessions, setCompletedSessions] = useState<StoredSession[]>(() => {
    const saved = localStorage.getItem(COMPLETED_SESSIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<BrowserHistoryEntry | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [currentTopicInfo, setCurrentTopicInfo] = useState<{topicId: string, topicTitle: string} | null>(null);

  // Load ongoing session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed.history || []);
      setSessionStartTime(parsed.startTime);
      setCurrentTopicInfo(parsed.topicInfo);
      setIsTracking(true);
    }
  }, []);

  const startTracking = (topicId: string, topicTitle: string) => {
    const startTime = Date.now();
    setIsTracking(true);
    setHistory([]);
    setSessionStartTime(startTime);
    setCurrentTopicInfo({ topicId, topicTitle });
    
    // Save to localStorage
    const sessionData = {
      history: [],
      startTime,
      topicInfo: { topicId, topicTitle }
    };
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(sessionData));
    
    // Log initial page
    const initialEntry: BrowserHistoryEntry = {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString()
    };
    setCurrentEntry(initialEntry);
  };

  const stopTracking = (completed: boolean = true) => {
    if (currentEntry) {
      const finalEntry = {
        ...currentEntry,
        visitDuration: Date.now() - new Date(currentEntry.timestamp).getTime()
      };
      const finalHistory = [...history, finalEntry];
      
      // Only save to completed sessions if timer completed successfully
      if (completed && sessionStartTime && currentTopicInfo) {
        const completedSession: StoredSession = {
          history: finalHistory,
          startTime: sessionStartTime,
          topicId: currentTopicInfo.topicId,
          topicTitle: currentTopicInfo.topicTitle
        };
        
        const updatedSessions = [...completedSessions, completedSession];
        setCompletedSessions(updatedSessions);
        localStorage.setItem(COMPLETED_SESSIONS_KEY, JSON.stringify(updatedSessions));
      }
    }
    
    // Clear ongoing session
    setIsTracking(false);
    setCurrentEntry(null);
    setHistory([]);
    setSessionStartTime(null);
    setCurrentTopicInfo(null);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  useEffect(() => {
    if (!isTracking) return;

    const logNavigation = () => {
      if (currentEntry) {
        const entryWithDuration = {
          ...currentEntry,
          visitDuration: Date.now() - new Date(currentEntry.timestamp).getTime()
        };
        const newHistory = [...history, entryWithDuration];
        setHistory(newHistory);
        
        // Update localStorage
        if (sessionStartTime && currentTopicInfo) {
          const sessionData = {
            history: newHistory,
            startTime: sessionStartTime,
            topicInfo: currentTopicInfo
          };
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(sessionData));
        }
      }

      const newEntry: BrowserHistoryEntry = {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
      };
      setCurrentEntry(newEntry);
    };

    // Listen for navigation changes
    const handlePopState = () => logNavigation();

    // Override pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(logNavigation, 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(logNavigation, 0);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Track tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden && currentEntry) {
        const entryWithDuration = {
          ...currentEntry,
          visitDuration: Date.now() - new Date(currentEntry.timestamp).getTime()
        };
        const newHistory = [...history, entryWithDuration];
        setHistory(newHistory);
        
        // Update localStorage
        if (sessionStartTime && currentTopicInfo) {
          const sessionData = {
            history: newHistory,
            startTime: sessionStartTime,
            topicInfo: currentTopicInfo
          };
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(sessionData));
        }
        
        setCurrentEntry(null);
      } else if (!document.hidden && !currentEntry) {
        const newEntry: BrowserHistoryEntry = {
          url: window.location.href,
          title: document.title,
          timestamp: new Date().toISOString()
        };
        setCurrentEntry(newEntry);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [isTracking, currentEntry, history, sessionStartTime, currentTopicInfo]);

  const clearHistory = () => {
    setHistory([]);
    setCurrentEntry(null);
  };

  const clearCompletedSessions = () => {
    setCompletedSessions([]);
    localStorage.removeItem(COMPLETED_SESSIONS_KEY);
  };

  return {
    history,
    completedSessions,
    isTracking,
    startTracking,
    stopTracking,
    clearHistory,
    clearCompletedSessions
  };
};