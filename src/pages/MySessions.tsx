import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Copy, Trash2, ClipboardList, ArrowLeft, Play, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { createSession, deleteSession, listSessions } from '@/lib/sessionStore';
import type { SessionPlan, TeamInput } from '@/lib/sessionGenerator';

type Row = Awaited<ReturnType<typeof listSessions>>[number];
export default function MySessions() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState('');
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const refresh = async () => {
    if (!user) return;
    setFetching(true); setError('');
    try { setRows(await listSessions(user.id)); } catch (e) { setError(e instanceof Error ? e.message : 'Could not load sessions.'); } finally { setFetching(false); }
  };
  useEffect(() => { if (user) void refresh(); }, [user?.id]);
  const duplicate = async (row: Row) => {
    if (!user) return;
    setBusy(row.id);
    try { await createSession(user.id, row.team_id, row.team_data as TeamInput, { ...(row.plan as unknown as SessionPlan), title: `${row.title} (copy)` }); await refresh(); toast({ title: 'Session duplicated' }); }
    catch (e) { toast({ title: 'Could not duplicate session', description: e instanceof Error ? e.message : '', variant: 'destructive' }); } finally { setBusy(null); }
  };
  const remove = async () => {
    if (!deleting) return;
    setBusy(deleting.id);
    try { await deleteSession(deleting.id); setRows(prev => prev.filter(r => r.id !== deleting.id)); setDeleting(null); }
    catch (e) { toast({ title: 'Could not delete session', description: e instanceof Error ? e.message : '', variant: 'destructive' }); } finally { setBusy(null); }
  };
  if (loading) return <p className="p-8">Loading…</p>;
  return <div className="min-h-screen bg-background"><header className="border-b border-border"><div className="max-w-5xl mx-auto px-4 py-4 flex justify-between gap-3"><Button asChild variant="ghost"><Link to="/"><ArrowLeft />Home</Link></Button><Button asChild variant="outline"><Link to="/account">My account</Link></Button></div></header>
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6"><div className="flex flex-wrap justify-between items-center gap-4"><h1 className="text-3xl font-bold">My sessions</h1><div className="flex gap-2 flex-wrap"><Button asChild variant="outline"><Link to="/block">Plan a block</Link></Button><Button asChild><Link to="/plan"><Plus />New session</Link></Button></div></div>
      {!user ? <div className="py-12 space-y-4"><ClipboardList className="h-10 w-10 text-primary" /><p>Sign in to save and manage your sessions.</p><Button asChild><Link to="/account">Sign in / create account</Link></Button></div> : <>
        <div className="relative"><Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" /><Input aria-label="Search sessions" placeholder="Search by session, team or goal" value={query} onChange={e => setQuery(e.target.value)} className="pl-10 h-11" /></div>
        {error && <div role="alert" className="space-y-2"><p className="text-destructive">{error}</p><Button variant="outline" onClick={refresh}>Try again</Button></div>}
        {fetching ? <p>Loading sessions…</p> : <div className="space-y-3">{rows.filter(r => `${r.title} ${JSON.stringify(r.team_data)} ${JSON.stringify((r.plan as unknown as SessionPlan).objectives)}`.toLowerCase().includes(query.toLowerCase())).map(r => <article key={r.id} className="border border-border bg-card rounded-lg p-5 flex flex-wrap justify-between gap-4"><div className="min-w-0"><Link to={`/session/${r.id}`} className="font-semibold text-lg hover:text-primary break-words">{r.title}</Link><p className="text-sm text-muted-foreground mt-1">{(r.team_data as TeamInput).teamName} · {(r.plan as unknown as SessionPlan).duration} min · {new Date(r.updated_at).toLocaleDateString('en-GB')}{r.is_public ? ' · Shared' : ''}</p></div><div className="flex items-center gap-2"><Button asChild variant="outline" size="icon" className="h-11 w-11" title="Edit session"><Link aria-label={`Edit ${r.title}`} to={`/session/${r.id}`}><Pencil /></Link></Button><Button asChild size="icon" className="h-11 w-11" title="Coach Mode"><Link aria-label={`Coach ${r.title}`} to={`/session/${r.id}/coach`}><Play /></Link></Button><Button size="icon" variant="outline" className="h-11 w-11" aria-label={`Duplicate ${r.title}`} title="Duplicate session" disabled={busy === r.id} onClick={() => duplicate(r)}><Copy /></Button><Button size="icon" variant="ghost" className="h-11 w-11 text-destructive" aria-label={`Delete ${r.title}`} title="Delete session" disabled={busy === r.id} onClick={() => setDeleting(r)}><Trash2 /></Button></div></article>)}{!rows.length && <p className="py-8 text-muted-foreground">No saved sessions yet.</p>}{rows.length > 0 && !rows.some(r => `${r.title} ${JSON.stringify(r.team_data)} ${JSON.stringify((r.plan as unknown as SessionPlan).objectives)}`.toLowerCase().includes(query.toLowerCase())) && <p>No matching sessions.</p>}</div>}
      </>}
    </main><AlertDialog open={Boolean(deleting)} onOpenChange={open => { if (!open && !busy) setDeleting(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete this session?</AlertDialogTitle><AlertDialogDescription>{deleting?.title} will be permanently removed.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={Boolean(busy)}>Cancel</AlertDialogCancel><Button variant="destructive" disabled={Boolean(busy)} onClick={remove}>Delete session</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>;
}