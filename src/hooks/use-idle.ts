
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const WARNING_TIMEOUT = 60 * 1000; // 1 minute warning

interface UseIdleParams {
  onIdle: () => void;
  idleTimeout: number; // e.g., 15 minutes in ms
}

export function useIdle({ onIdle, idleTimeout }: UseIdleParams) {
  const [isIdle, setIsIdle] = useState(false);
  const [idleTime, setIdleTime] = useState(0);

  const idleTimerRef = useRef<NodeJS.Timeout>();
  const warningTimerRef = useRef<NodeJS.Timeout>();
  const countdownIntervalRef = useRef<NodeJS.Timeout>();
  const lastActivityTimeRef = useRef(Date.now());

  const cleanupTimers = () => {
    clearTimeout(idleTimerRef.current);
    clearTimeout(warningTimerRef.current);
    clearInterval(countdownIntervalRef.current);
  };
  
  const startTimers = useCallback(() => {
    cleanupTimers();

    warningTimerRef.current = setTimeout(() => {
        setIsIdle(true);
        lastActivityTimeRef.current = Date.now(); // Start countdown from now

        countdownIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - lastActivityTimeRef.current;
          setIdleTime(elapsed);

          if (elapsed >= WARNING_TIMEOUT) {
            onIdle();
            cleanupTimers();
          }
        }, 1000);

    }, idleTimeout - WARNING_TIMEOUT);

    idleTimerRef.current = setTimeout(() => {
        onIdle();
        cleanupTimers();
    }, idleTimeout);

  }, [idleTimeout, onIdle]);


  const reset = useCallback(() => {
    cleanupTimers();
    setIsIdle(false);
    setIdleTime(0);
    lastActivityTimeRef.current = Date.now();
    startTimers();
  }, [startTimers]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    const handleActivity = () => {
      reset();
    };

    events.forEach(event => window.addEventListener(event, handleActivity));
    startTimers();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      cleanupTimers();
    };
  }, [reset, startTimers]);

  return { isIdle, reset, idleTime };
}
