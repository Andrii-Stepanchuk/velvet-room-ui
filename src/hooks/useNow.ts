import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const MINUTE_MS = 60_000;

export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const tick = () => setNow(new Date());
    const alignToMinute = setTimeout(() => {
      tick();
      interval = setInterval(tick, MINUTE_MS);
    }, MINUTE_MS - (Date.now() % MINUTE_MS));
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') tick();
    });
    return () => {
      clearTimeout(alignToMinute);
      clearInterval(interval);
      appState.remove();
    };
  }, []);

  return now;
}
