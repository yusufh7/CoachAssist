import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertCircle, Loader2, Play, Save } from 'lucide-react';
import SessionOverview from '@/components/SessionOverview';
import SessionPhase from '@/components/SessionPhase';
import SessionExport from '@/components/SessionExport';
import ActivityCustomizer from '@/components/ActivityCustomizer';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { recomputeDurations, type SessionPlan } from '@/lib/sessionGenerator';
import { DRAFT_ID, loadSession, saveDraft, updateSessionPlan, createSession, type StoredSession } from '@/lib/sessionStore';
import QuickAdjust from './QuickAdjust';
import { replaceActivity } from '@/lib/delivery';
import { SAFEGUARDING } from '@/lib/safety';

const slug = (s: string, i: number) => `${i}-${s.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const SessionPlanner = () => {
  const { id = DRAFT_ID } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [stored, setStored] = useState<StoredSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [customizing, setCustomizing] = useState<{ phaseIndex: number; activityIndex: number } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    loadSession(id)
      .then((s) => {
        if (!s) setError(id === DRAFT_ID ? 'No session in progress. Start a new one.' : "This session doesn't exist or isn't shared.");
        else { setStored(s); setError(''); }
      })
      .catch((e) => setError(`Couldn't load the session: ${e.message}`))
      .finally(() => setLoading(false));
  }, [id, authLoading, user?.id]);

  const isDraft = id === DRAFT_ID;
  const isOwner = isDraft || (!!user && stored?.userId === user.id);

  const handleSave = async (updatedActivity) => {
    if (!stored || !customizing) return;
    const plan: SessionPlan = structuredClone(stored.plan);
    plan.phases[customizing.phaseIndex].activities[customizing.activityIndex] = updatedActivity;
    const next = recomputeDurations(plan);
    try {
      if (isDraft) saveDraft(stored.teamData, next);
      else await updateSessionPlan(stored.id, next);
      setStored({ ...stored, plan: next });
      setCustomizing(null);
      toast({ title: 'Changes saved' });
    } catch (e: unknown) {
      toast({ title: "Changes not saved", description: e instanceof Error ? e.message : 'Please try again.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading session...
      </div>
    );
  }

  if (error || !stored) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-card rounded-2xl shadow-xl p-8 text-center border border-destructive/30">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-3">Session unavailable</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild className="w-full"><Link to="/plan">Plan a new session</Link></Button>
        </div>
      </div>
    );
  }

  const { plan, teamData } = stored;

  if (customizing) {
    return (
      <ActivityCustomizer
        activity={plan.phases[customizing.phaseIndex].activities[customizing.activityIndex]}
        onSave={handleSave}
        onCancel={() => setCustomizing(null)}
      />
    );
  }

  const triggerCls = "rounded-md whitespace-nowrap px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium";

  return (
    <div className="min-h-screen bg-gradient-surface">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="flex-1 min-w-0 text-center">
            <h1 className="text-lg sm:text-2xl font-bold text-primary truncate">{plan.title}</h1>
            <p className="text-xs text-muted-foreground">{plan.generator === 'ai' ? 'AI-planned session – check it suits your players' : 'Template session'}</p>
          </div>
          <SessionExport stored={stored} isOwner={isOwner && !isDraft} onChange={setStored} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isDraft && (
          <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-border pb-4"><p className="text-sm text-muted-foreground">Kept in this browser tab.</p><Button disabled={saving} onClick={async () => {
            if (!user) { navigate('/account'); return; }
            setSaving(true);
            try { const savedId = await createSession(user.id, null, stored.teamData, stored.plan); navigate(`/session/${savedId}`, { replace: true }); }
            catch (e) { toast({ title: 'Session not saved', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
            finally { setSaving(false); }
          }}><Save />{user ? 'Save session' : 'Sign up to save'}</Button></div>
        )}
        <div className="flex flex-wrap gap-2 mb-6"><Button asChild size="lg"><Link to={`/session/${id}/coach`}><Play />Coach Mode</Link></Button>{isOwner && <Button asChild variant="outline" size="lg"><Link to={`/block?session=${id}`}>Plan a training block</Link></Button>}<Button asChild variant="ghost" size="lg"><Link to="/sessions">My sessions</Link></Button></div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className="inline-flex w-max min-w-full justify-start bg-card border border-border rounded-lg p-2 h-auto">
              <TabsTrigger value="overview" className={triggerCls}>Overview</TabsTrigger>
              {plan.phases.map((p, i) => (
                <TabsTrigger key={i} value={slug(p.name, i)} className={triggerCls}>
                  {p.name} <span className="ml-1 opacity-70 text-xs">{p.duration}′</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <SessionOverview sessionPlan={plan} teamData={teamData} />
          </TabsContent>

          {plan.phases.map((phase, i) => (
            <TabsContent key={i} value={slug(phase.name, i)} className="space-y-6">
              <SessionPhase
                phase={phase}
                phaseIndex={i}
                onCustomizeActivity={isOwner ? (pi, ai) => setCustomizing({ phaseIndex: pi, activityIndex: ai }) : undefined}
                renderAdjustment={isOwner ? (activity, ai) => <QuickAdjust activity={activity} team={teamData} onSave={async updated => {
                  const next = replaceActivity(plan, i, ai, updated);
                  if (isDraft) saveDraft(teamData, next); else await updateSessionPlan(id, next);
                  setStored({ ...stored, plan: next });
                }} /> : undefined}
              />
            </TabsContent>
          ))}
        </Tabs>
        <p className="text-xs text-muted-foreground mt-10 border-t border-border pt-5">{SAFEGUARDING}</p>
      </main>
    </div>
  );
};

export default SessionPlanner;
