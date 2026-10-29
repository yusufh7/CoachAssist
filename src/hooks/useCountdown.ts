import { useEffect, useRef, useState } from 'react';
import { remainingSeconds } from '@/lib/delivery';

export function useCountdown(minutes: number, key: string) {
  const [seconds, setSeconds] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  const [awake, setAwake] = useState(false);
  useEffect(() => { setRunning(false); setSeconds(minutes * 60); }, [minutes, key]);
  useEffect(() => {
    if (!running) return;
    const tick = () => { const left = remainingSeconds(deadline.current, Date.now()); setSeconds(left); if (!left) setRunning(false); };
    tick(); const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (!running || !('wakeLock' in navigator)) return;
    let disposed = false;
    let lock: { release: () => Promise<void>; addEventListener: (event: string, cb: () => void) => void } | undefined;
    const acquire = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const result = await navigator.wakeLock.request('screen');
        if (disposed) { await result.release(); return; }
        lock = result; setAwake(true); result.addEventListener('release', () => setAwake(false));
      } catch { setAwake(false); }
    };
    void acquire(); document.addEventListener('visibilitychange', acquire);
    return () => { disposed = true; document.removeEventListener('visibilitychange', acquire); void lock?.release(); setAwake(false); };
  }, [running]);
  return { seconds, running, awake, toggle: () => {
    if (running) { setSeconds(remainingSeconds(deadline.current, Date.now())); setRunning(false); }
    else if (seconds > 0) { deadline.current = Date.now() + seconds * 1000; setRunning(true); }
  }, reset: () => { setRunning(false); setSeconds(minutes * 60); } };
}