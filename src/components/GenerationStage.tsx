import { useEffect, useState } from 'react';

export default function GenerationStage() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const id = setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="flex flex-wrap justify-center gap-x-2"><span role="status">{seconds < 60 ? 'Planning your session…' : 'Still planning your session…'}</span><span className="tabular-nums" aria-label={`${seconds} seconds elapsed`}>{seconds}s</span></span>;
}
