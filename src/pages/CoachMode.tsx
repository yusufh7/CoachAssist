import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Sun, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoredSession } from '@/hooks/useStoredSession';
import { useCountdown } from '@/hooks/useCountdown';
import { coachingScript, replaceActivity } from '@/lib/delivery';
import { DRAFT_ID } from '@/lib/sessionStore';
import QuickAdjust from '@/components/QuickAdjust';

export default function CoachMode() {
  const { id = DRAFT_ID } = useParams();
  const { stored, loading, error, isOwner, persist } = useStoredSession(id);
  const [index, setIndex] = useState(0);
  const blocks = stored?.plan.phases.flatMap((p, pi) => p.activities.map((activity, ai) => ({ activity, pi, ai, phase: p.name }))) || [];
  const block = blocks[index];
  const timer = useCountdown(block?.activity.duration || 0, `${id}:${index}`);
  if (loading) return <p className="p-8 text-muted-foreground">Loading session…</p>;
  if (!stored || !block) return <main className="p-8 space-y-4"><p role="alert">{error || 'No practices available.'}</p><Button asChild><Link to="/plan">Plan a session</Link></Button></main>;
  const a = block.activity;
  const script = coachingScript(a);
  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-card"><div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
      <Button asChild variant="ghost" className="min-h-11"><Link to={`/session/${id}`}><ArrowLeft />Session</Link></Button>
      <span className="font-semibold">Coach Mode</span><span className="text-sm text-muted-foreground tabular-nums">{index + 1} / {blocks.length}</span>
    </div></header>
    <main className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-7">
      <div><p className="text-primary font-semibold mb-2">{block.phase}</p><h1 className="text-3xl sm:text-4xl font-bold break-words">{a.name}</h1></div>
      <section className="border-y border-border py-6 flex flex-wrap items-center justify-between gap-5" aria-label="Practice timer">
        <div><div className={`text-6xl sm:text-7xl font-bold tabular-nums ${timer.seconds === 0 ? 'text-primary' : ''}`} role="timer">{String(Math.floor(timer.seconds / 60)).padStart(2, '0')}:{String(timer.seconds % 60).padStart(2, '0')}</div>
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">{timer.seconds === 0 ? <><CheckCircle2 className="w-4 h-4" />Practice complete</> : timer.awake ? <><Sun className="w-4 h-4" />Screen staying awake</> : `${a.duration} minute practice`}</p></div>
        <div className="flex gap-2"><Button size="lg" className="min-w-28" onClick={timer.toggle} disabled={timer.seconds === 0}>{timer.running ? <Pause /> : <Play />}{timer.running ? 'Pause' : 'Start'}</Button><Button variant="outline" size="icon" className="w-11 h-11" title="Reset timer" aria-label="Reset timer" onClick={timer.reset}><RotateCcw /></Button></div>
      </section>
      <section className="space-y-3"><h2 className="text-xl font-semibold">Set up</h2><p className="text-lg leading-relaxed">{a.setup}</p><p className="text-muted-foreground">{a.equipment}</p></section>
      <section className="space-y-4"><h2 className="text-xl font-semibold">What to say</h2>{Object.entries(script).map(([label, text]) => <div key={label} className="border-l-4 border-primary pl-4"><h3 className="text-sm font-bold uppercase text-primary mb-1">{label}</h3><p className="text-lg leading-relaxed">{text}</p></div>)}</section>
      <section><h2 className="text-xl font-semibold mb-3">Watch for</h2><ul className="list-disc pl-5 space-y-2 text-lg">{a.coachingPoints.map((point, i) => <li key={i}>{point}</li>)}</ul></section>
      {isOwner && <QuickAdjust key={`${index}:${a.name}`} activity={a} team={stored.teamData} onSave={updated => persist(replaceActivity(stored.plan, block.pi, block.ai, updated))} />}
      <nav className="flex items-center justify-between border-t border-border pt-5 gap-3"><Button variant="outline" size="lg" disabled={index === 0} onClick={() => setIndex(i => i - 1)}><ChevronLeft />Previous</Button><Button size="lg" disabled={index === blocks.length - 1} onClick={() => setIndex(i => i + 1)}>Next<ChevronRight /></Button></nav>
    </main>
  </div>;
}