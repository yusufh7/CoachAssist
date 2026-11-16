import { useEffect, useState } from 'react';
import { Star, NotebookPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { EMPTY_REFLECTION, loadReflection, reflectionSchema, saveReflection, type ReflectionInput } from '@/lib/reflections';

export default function SessionReflection({ userId, sessionId }: { userId: string; sessionId: string }) {
  const { toast } = useToast();
  const [form, setForm] = useState<ReflectionInput>(EMPTY_REFLECTION());
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { loadReflection(sessionId).then(r => { if (r) { setForm(r); setSaved(true); } }).catch(() => {}); }, [sessionId]);
  const set = <K extends keyof ReflectionInput>(k: K, v: ReflectionInput[K]) => setForm(f => ({ ...f, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reflectionSchema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    setError(''); setBusy(true);
    try { await saveReflection(userId, sessionId, parsed.data); setSaved(true); toast({ title: 'Reflection saved', description: 'Find it any time in your journal.' }); }
    catch (err) { setError(err instanceof Error ? err.message : 'Reflection not saved. Please try again.'); }
    finally { setBusy(false); }
  };
  const field = (k: 'wentWell' | 'toChange' | 'playerNotes', label: string, hint: string) => (
    <div className="space-y-1.5"><Label htmlFor={k}>{label}</Label><Textarea id={k} rows={3} placeholder={hint} value={form[k]} onChange={e => set(k, e.target.value)} /></div>
  );
  return (
    <section aria-labelledby="reflect-h" className="mt-10 bg-card border border-border rounded-xl p-5 sm:p-6 space-y-5">
      <div><h2 id="reflect-h" className="text-xl font-semibold flex items-center gap-2"><NotebookPen className="w-5 h-5 text-primary" />Session debrief</h2>
        <p className="text-sm text-muted-foreground">Ran this session? Jot down how it went while it's fresh.</p></div>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="flex flex-wrap gap-6 items-end">
          <div className="space-y-1.5"><Label htmlFor="deliveredOn">Date run</Label><Input id="deliveredOn" type="date" value={form.deliveredOn} onChange={e => set('deliveredOn', e.target.value)} className="w-44" /></div>
          <fieldset><legend className="text-sm font-medium mb-1.5">How did it go?</legend>
            <div className="flex gap-1">{[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" aria-label={`${n} out of 5`} aria-pressed={form.rating === n} onClick={() => set('rating', n)} className="p-1.5 rounded-md hover:bg-muted">
                <Star className={`w-6 h-6 ${n <= form.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} /></button>))}</div></fieldset>
        </div>
        {field('wentWell', 'What went well', 'e.g. Players found the spare player quickly in the rondo')}
        {field('toChange', 'What I’d change next time', 'e.g. Area too big for 8 players – shrink to 20x15')}
        {field('playerNotes', 'Player notes', 'e.g. Sam scanned before receiving all session')}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? 'Saving…' : saved ? 'Update reflection' : 'Save reflection'}</Button>
      </form>
    </section>
  );
}
