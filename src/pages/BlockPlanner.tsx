import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { loadSession, createSession } from '@/lib/sessionStore';
import { blockInputs } from '@/lib/delivery';
import { generateAiPlan } from '@/lib/aiClient';
import type { TeamInput } from '@/lib/sessionGenerator';

export default function BlockPlanner() {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const [teams, setTeams] = useState<{ id: string; input: TeamInput }[]>([]);
  const [selected, setSelected] = useState('');
  const [theme, setTheme] = useState('');
  const [count, setCount] = useState('4');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<{ id: string; title: string }[]>([]);
  const [prepared, setPrepared] = useState<TeamInput[] | null>(null);
  useEffect(() => {
    if (!user) return;
    const cached = sessionStorage.getItem(`coachassist:block:${user.id}`);
    if (cached) { try { const state = JSON.parse(cached); setPrepared(state.prepared); setResults(state.results); setTheme(state.theme); setCount(state.count); setSelected(state.selected); } catch { sessionStorage.removeItem(`coachassist:block:${user.id}`); } }
    const load = async () => {
      try {
        const { data, error } = await supabase.from('teams').select('*').eq('user_id', user.id);
        if (error) throw error;
        const choices: { id: string; input: TeamInput }[] = (data || []).map(t => ({ id: t.id, input: { teamName: t.name, ageGroup: t.age_group || '', skillLevel: t.skill_level || '', playerCount: t.player_count || 12, sessionDuration: t.session_duration || 60, playingStyle: t.playing_style || '', currentFocus: t.current_focus || '' } }));
        const source = params.get('session');
        if (source) {
          const s = await loadSession(source);
          if (s) { choices.unshift({ id: 'source', input: s.teamData }); setTheme(s.teamData.sessionGoals || ''); }
        }
        setTeams(choices); if (!cached) setSelected(choices[0]?.id || '');
      } catch (e) { setError(e instanceof Error ? e.message : 'Could not load teams.'); }
    }; void load();
  }, [user?.id]);
  const generate = async () => {
    if (!user) return;
    const team = teams.find(t => t.id === selected);
    if ((!team && !prepared) || !theme.trim()) { setError('Choose a team and enter one football theme.'); return; }
    const inputs = prepared || blockInputs(team?.input || {}, theme.trim(), Number(count));
    setPrepared(inputs); setBusy(true); setError('');
    const completed = [...results];
    const persist = () => sessionStorage.setItem(`coachassist:block:${user.id}`, JSON.stringify({ prepared: inputs, results: completed, theme, count, selected }));
    persist();
    try {
      for (let i = results.length; i < inputs.length; i++) {
        const result = await generateAiPlan(inputs[i]);
        if (!result.plan) throw new Error(result.error || 'Planning paused. Your completed sessions are saved; retry to continue.');
        const title = `${theme.trim()} — Session ${i + 1} of ${inputs.length}`;
        const id = await createSession(user.id, selected === 'source' ? null : selected, inputs[i], { ...result.plan, title });
        completed.push({ id, title }); setResults([...completed]); persist();
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not complete the block.'); } finally { setBusy(false); }
  };
  const locked = Boolean(prepared);
  return <div className="min-h-screen bg-background"><header className="border-b border-border"><div className="max-w-3xl mx-auto px-4 py-4"><Button asChild variant="ghost"><Link to="/sessions"><ArrowLeft />My sessions</Link></Button></div></header><main className="max-w-3xl mx-auto px-4 py-8 space-y-6"><h1 className="text-3xl font-bold">Plan a training block</h1>
    {loading ? <p>Loading…</p> : !user ? <><p>Sign in to save your training block.</p><Button asChild><Link to="/account">Sign in / create account</Link></Button></> : <>
      <div className="space-y-2"><Label htmlFor="block-team">Team</Label><Select value={selected} onValueChange={setSelected} disabled={locked}><SelectTrigger id="block-team"><SelectValue placeholder="Select team" /></SelectTrigger><SelectContent>{teams.map(t => <SelectItem key={t.id} value={t.id}>{t.input.teamName}{t.id === 'source' ? ' (current session)' : ''}</SelectItem>)}</SelectContent></Select></div>
      {!teams.length && <Button asChild variant="outline"><Link to="/plan">Set up a team and session</Link></Button>}
      <div className="space-y-2"><Label htmlFor="block-theme">Theme</Label><Input id="block-theme" value={theme} onChange={e => setTheme(e.target.value)} maxLength={300} placeholder="e.g. Playing out from the back" disabled={locked} /></div>
      <div className="space-y-2"><Label htmlFor="block-count">Number of sessions</Label><Select value={count} onValueChange={setCount} disabled={locked}><SelectTrigger id="block-count"><SelectValue /></SelectTrigger><SelectContent>{[4, 5, 6].map(n => <SelectItem key={n} value={String(n)}>{n} sessions</SelectItem>)}</SelectContent></Select></div>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      {results.length < Number(count) && <Button size="lg" disabled={busy || !teams.length} onClick={generate}>{busy ? <><Loader2 className="animate-spin" />Planning session {Math.min(results.length + 1, Number(count))} of {count}…</> : prepared ? 'Continue planning' : 'Generate training block'}</Button>}
      <div className="divide-y divide-border">{results.map(r => <Link key={r.id} to={`/session/${r.id}`} className="flex items-center gap-3 py-4 font-semibold hover:text-primary"><CheckCircle2 className="text-primary shrink-0" />{r.title}</Link>)}</div>
      {results.length === Number(count) && <p className="text-primary font-semibold">Training block saved.</p>}
      {prepared && !busy && <Button variant="outline" onClick={() => { sessionStorage.removeItem(`coachassist:block:${user.id}`); setPrepared(null); setResults([]); }}>Start a new block</Button>}
    </>}
  </main></div>;
}