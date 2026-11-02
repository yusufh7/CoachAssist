import { useEffect, useState } from 'react';

const STAGES = ['Reading your team details…', 'Choosing practices…', 'Setting timings and groups…', 'Running safety checks…', 'Nearly there — finishing your plan…'];

export default function GenerationStage() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(n => Math.min(n + 1, STAGES.length - 1)), 12000);
    return () => clearInterval(id);
  }, []);
  return <span aria-live="polite">{STAGES[i]}</span>;
}
