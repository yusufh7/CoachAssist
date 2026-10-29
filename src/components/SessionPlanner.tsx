import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import SessionOverview from '@/components/SessionOverview';
import SessionPhase from '@/components/SessionPhase';
import SessionExport from '@/components/SessionExport';
import ActivityCustomizer from '@/components/ActivityCustomizer';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { recomputeDurations, type SessionPlan } from '@/lib/sessionGenerator';
import { DRAFT_ID, loadSession, saveDraft, updateSessionPlan, type StoredSession } from '@/lib/sessionStore';

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
    setStored({ ...stored, plan: next });
    setCustomizing(null);
    try {
      if (isDraft) saveDraft(stored.teamData, next);
      else await updateSessionPlan(stored.id, next);
      toast({ title: 'Changes saved' });
    } catch (e: any) {
      toast({ title: "Changes not saved", description: e.message, variant: 'destructive' });
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

  const triggerCls = "rounded-xl whitespace-nowrap px-4 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg font-medium";

  return (
    <div className="min-h-screen bg-gradient-surface">
      <header className="glass border-b border-border/50 sticky top-0 z-50">
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
          <p className="mb-6 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
            This session is only saved in this browser tab. <Link to="/account" className="underline text-primary">Sign in</Link> to save and share sessions.
          </p>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className="inline-flex w-max min-w-full justify-start glass border border-border/20 rounded-2xl p-2 h-auto">
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
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default SessionPlanner;
