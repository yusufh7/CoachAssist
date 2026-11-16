import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NotebookPen, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkspaceNav from '@/components/WorkspaceNav';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { deleteReflection, listReflections, reflectionsThisWeek, type Reflection } from '@/lib/reflections';

export default function Journal() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<Reflection[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { if (user) listReflections(user.id).then(setRows).catch(e => setError(e.message)); }, [user?.id]);
  const remove = async (r: Reflection) => {
    if (!confirm('Delete this reflection?')) return;
    try { await deleteReflection(r.id); setRows(rs => rs?.filter(x => x.id !== r.id) ?? null); }
    catch (e) { toast({ title: 'Not deleted', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const avg = rows?.length ? (rows.reduce((s, r) => s + r.rating, 0) / rows.length).toFixed(1) : null;
  return (
    <div className="min-h-screen bg-background"><WorkspaceNav />
      <main className="lg:ml-60 px-4 sm:px-8 py-8 max-w-4xl space-y-6">
        <div><h1 className="text-3xl font-heading font-bold flex items-center gap-2"><NotebookPen className="text-primary" />Coaching journal</h1>
          <p className="text-muted-foreground">Your session debriefs in one place. Add one from the bottom of any saved session.</p></div>
        {loading ? <p className="text-muted-foreground">Loading…</p> : !user ? (
          <p>Sign in to keep a coaching journal. <Button asChild variant="link"><Link to="/account">Sign in</Link></Button></p>
        ) : error ? <p role="alert" className="text-destructive">{error}</p> : !rows ? <p className="text-muted-foreground">Loading…</p> : rows.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-8 text-center space-y-3"><p>No reflections yet. After you run a session, open it and fill in the debrief.</p><Button asChild><Link to="/sessions">Go to my sessions</Link></Button></div>
        ) : (<>
          <div className="flex flex-wrap gap-6 text-sm"><p><span className="text-2xl font-bold">{reflectionsThisWeek(rows.map(r => r.deliveredOn))}</span> reflections in the last 7 days</p><p><span className="text-2xl font-bold">{avg}</span> average rating</p></div>
          <ul className="space-y-4">{rows.map(r => (
            <li key={r.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div><Link to={`/session/${r.sessionId}`} className="font-semibold text-primary hover:underline">{r.sessionTitle || 'Session'}</Link>
                  <p className="text-sm text-muted-foreground">{new Date(r.deliveredOn + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
                <div className="flex items-center gap-2"><span className="flex" aria-label={`${r.rating} out of 5`}>{[1, 2, 3, 4, 5].map(n => <Star key={n} className={`w-4 h-4 ${n <= r.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />)}</span>
                  <Button variant="ghost" size="icon" aria-label="Delete reflection" onClick={() => remove(r)}><Trash2 className="w-4 h-4" /></Button></div>
              </div>
              {([['Went well', r.wentWell], ['Change next time', r.toChange], ['Player notes', r.playerNotes]] as const).filter(([, t]) => t.trim()).map(([l, t]) => (
                <div key={l}><h3 className="text-xs font-bold uppercase text-muted-foreground">{l}</h3><p className="whitespace-pre-wrap">{t}</p></div>))}
            </li>))}</ul>
        </>)}
      </main>
    </div>
  );
}
