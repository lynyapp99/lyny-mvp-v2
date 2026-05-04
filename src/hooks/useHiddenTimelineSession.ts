import { useState, useEffect, useCallback } from "react";

interface HiddenTimelineSession {
  timelineId: string;
  unlockedAt: number;
  expiresAt: number;
}

const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useHiddenTimelineSession = () => {
  const [sessions, setSessions] = useState<HiddenTimelineSession[]>([]);

  // Check for expired sessions and remove them
  useEffect(() => {
    const checkExpiredSessions = () => {
      const now = Date.now();
      setSessions(prevSessions => 
        prevSessions.filter(session => session.expiresAt > now)
      );
    };

    const interval = setInterval(checkExpiredSessions, 60000); // Check every minute
    checkExpiredSessions(); // Check immediately

    return () => clearInterval(interval);
  }, []);

  const unlockTimeline = useCallback((timelineId: string) => {
    const now = Date.now();
    const expiresAt = now + SESSION_DURATION;

    setSessions(prevSessions => {
      // Remove any existing session for this timeline
      const filteredSessions = prevSessions.filter(session => session.timelineId !== timelineId);
      
      // Add new session
      return [...filteredSessions, {
        timelineId,
        unlockedAt: now,
        expiresAt,
      }];
    });
  }, []);

  const isTimelineUnlocked = useCallback((timelineId: string): boolean => {
    const now = Date.now();
    const session = sessions.find(session => 
      session.timelineId === timelineId && session.expiresAt > now
    );
    return !!session;
  }, [sessions]);

  const lockTimeline = useCallback((timelineId: string) => {
    setSessions(prevSessions => 
      prevSessions.filter(session => session.timelineId !== timelineId)
    );
  }, []);

  const getSessionTimeRemaining = useCallback((timelineId: string): number => {
    const now = Date.now();
    const session = sessions.find(session => 
      session.timelineId === timelineId && session.expiresAt > now
    );
    
    if (!session) return 0;
    return Math.max(0, session.expiresAt - now);
  }, [sessions]);

  return {
    unlockTimeline,
    isTimelineUnlocked,
    lockTimeline,
    getSessionTimeRemaining,
  };
};

export default useHiddenTimelineSession;