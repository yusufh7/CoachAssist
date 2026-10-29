import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { ADJUSTMENTS, type Adjustment } from '@/lib/delivery';
import { adjustAiActivity } from '@/lib/aiClient';
import type { Activity, TeamInput } from '@/lib/sessionGenerator';

export default function QuickAdjust({ activity, team, onSave }: { activity: Activity; team: TeamInput; onSave: (a: Activity) => Promise<void> }) {
  const playerId = useId();
  const [busy, setBusy] = useState<Adjustment | null>(null);
  const [error, setError] = useState('');
  const [players, setPlayers] = useState(String(team.playerCount || 12));
  const run = async (adjustment: Adjustment) => {
    const n = Number(players);
    if (!Number.isInteger(n) || n < 1 || n > 40) { setError('Enter 1–40 players.'); return; }
    setBusy(adjustment); setError('');
    try { await onSave(await adjustAiActivity(team, activity, adjustment, n)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not save the adjustment.'); }
    finally { setBusy(null); }
  };
  return <section className="border-t border-border pt-5 space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">Quick adjustments</h3>
      <div className="flex items-center gap-2"><Label htmlFor={playerId}>Players now</Label><Input id={playerId} type="number" min={1} max={40} value={players} onChange={e => setPlayers(e.target.value)} className="w-20 h-11" disabled={Boolean(busy)} /></div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{ADJUSTMENTS.map(a => <Button key={a} variant="outline" className="min-h-11 h-auto whitespace-normal py-3" disabled={Boolean(busy)} onClick={() => run(a)}>{busy === a && <Loader2 className="animate-spin" />}{a}</Button>)}</div>
    {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
  </section>;
}