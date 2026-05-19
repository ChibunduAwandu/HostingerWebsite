import { useEffect, useState } from 'react';

export const useSceneTicker = (intervalMs = 800) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((current) => current + 1);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [intervalMs]);

  return tick;
};
