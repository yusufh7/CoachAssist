import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { teamSetupSchema, formRateLimiter } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { buildSessionPlan } from '@/lib/sessionGenerator';
import { generateAiPlan } from '@/lib/aiClient';
import { createSession, saveDraft, loadDraft, DRAFT_ID } from '@/lib/sessionStore';
import { canGenerateAnonymous } from '@/lib/delivery';
import type { Database } from '@/integrations/supabase/types';

const EMPTY = {
  pitchSize: '', coachCount: '1', units: 'metres', equipment: ['Balls', 'Cones', 'Bibs'],
  teamName: '', ageGroup: '', skillLevel: '', playingStyle: '',
  sessionGoals: '', sessionDuration: '', playerCount: '', currentFocus: '',
};
const NEW_TEAM = '__new__';
const NO_STYLE = '__none__';

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-sm text-destructive mt-1 flex items-center gap-1" role="alert">
      <AlertTriangle className="w-3 h-3" />
      {msg}
    </p>
  ) : null;

const TeamSetup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [formData, setFormData] = useState({ ...EMPTY, sessionGoals: params.get('goal') || '' });
  const [teams, setTeams] = useState<Database['public']['Tables']['teams']['Row'][]>([]);
  const [teamId, setTeamId] = useState<string>(NEW_TEAM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase.from('teams').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) toast({ title: "Couldn't load your teams", description: error.message, variant: "destructive" });
        else setTeams(data || []);
      });
  }, [user]);

  const pickTeam = (id: string) => {
    setTeamId(id);
    if (id === NEW_TEAM) { setFormData(EMPTY); return; }
    const t = teams.find((x) => x.id === id);
    if (!t) return;
    setFormData({
      ...EMPTY,
      teamName: t.name ?? '', ageGroup: t.age_group ?? '', skillLevel: t.skill_level ?? '',
      playingStyle: t.playing_style ?? '', sessionGoals: t.goals ?? '',
      sessionDuration: t.session_duration ? String(t.session_duration) : '',
      playerCount: t.player_count ? String(t.player_count) : '', currentFocus: t.current_focus ?? '',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError('');

    if (!user && !canGenerateAnonymous(Boolean(loadDraft()))) {
      navigate(`/session/${DRAFT_ID}`);
      toast({ title: 'Your trial session is ready', description: 'Sign up to save it and plan more sessions.' });
      return;
    }

    if (!formRateLimiter.canProceed('team-setup-form')) {
      toast({ title: "Too many attempts", description: "Please wait a minute before trying again.", variant: "destructive" });
      return;
    }

    const parsed = teamSetupSchema.safeParse(formData);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.errors.forEach((err) => { if (err.path[0] && !fe[err.path[0]]) fe[err.path[0] as string] = err.message; });
      setErrors(fe);
      const msg = `Please fix ${Object.keys(fe).length} field${Object.keys(fe).length > 1 ? 's' : ''} below.`;
      setFormError(msg);
      toast({ title: "Check the form", description: msg, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const data = parsed.data;
    let plan = buildSessionPlan(data);
    const ai = await generateAiPlan(data);
    if (ai.plan) {
      plan = ai.plan;
    } else {
      toast({ title: "Using a template session", description: ai.error ?? "The AI couldn't build this one, so here's a ready-made plan instead.", variant: ai.limited ? "destructive" : undefined });
    }

    if (!user) {
      saveDraft(data, plan);
      setIsSubmitting(false);
      navigate(`/session/${DRAFT_ID}`);
      return;
    }

    // Save or update the team (one row per team, not per session)
    let savedTeamId: string | null = teamId !== NEW_TEAM ? teamId : null;
    const row = {
      user_id: user.id, name: data.teamName, age_group: data.ageGroup, skill_level: data.skillLevel,
      player_count: data.playerCount, session_duration: Number(data.sessionDuration),
      playing_style: data.playingStyle || null, goals: data.sessionGoals, current_focus: data.currentFocus || null,
    };
    const teamRes = savedTeamId
      ? await supabase.from('teams').update(row).eq('id', savedTeamId).select('id').single()
      : await supabase.from('teams').insert(row).select('id').single();
    if (teamRes.error) {
      savedTeamId = null;
      toast({ title: "Team not saved", description: `${teamRes.error.message}. Your session will still be generated.`, variant: "destructive" });
    } else {
      savedTeamId = teamRes.data.id;
    }

    try {
      const id = await createSession(user.id, savedTeamId, data, plan);
      navigate(`/session/${id}`);
    } catch (err: unknown) {
      saveDraft(data, plan);
      toast({ title: "Session not saved", description: `${err instanceof Error ? err.message : 'Unknown error'}. It's kept on this device for now.`, variant: "destructive" });
      navigate(`/session/${DRAFT_ID}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const errCls = (f: string) => (errors[f] ? "border-destructive" : "");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-foreground">New session</h1>
            <div />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="max-w-2xl mx-auto">
          <div className="mb-8">
            <CardTitle className="text-2xl text-center">Set Up Your Training Session</CardTitle>
            <CardDescription className="text-center">
              Tell us about your team so we can build a session plan
            </CardDescription>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {formError && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                  {formError}
                </div>
              )}

              {user && teams.length > 0 && (
                <div>
                  <Label>Team</Label>
                  <Select value={teamId} onValueChange={pickTeam}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value={NEW_TEAM}>+ New team</SelectItem>
                      {teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Changes you make update the saved team.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input id="teamName" placeholder="e.g. St. Mary's U12s" value={formData.teamName}
                    onChange={(e) => update('teamName', e.target.value)} maxLength={100} className={errCls('teamName')} />
                  <FieldError msg={errors.teamName} />
                </div>

                <div>
                  <Label htmlFor="ageGroup">Age Group</Label>
                  <Select value={formData.ageGroup} onValueChange={(v) => update('ageGroup', v)}>
                    <SelectTrigger id="ageGroup" className={`bg-background ${errCls('ageGroup')}`}><SelectValue placeholder="Select age group" /></SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="u7">Under 7s</SelectItem>
                      <SelectItem value="u9">Under 9s</SelectItem>
                      <SelectItem value="u11">Under 11s</SelectItem>
                      <SelectItem value="u13">Under 13s</SelectItem>
                      <SelectItem value="u15">Under 15s</SelectItem>
                      <SelectItem value="u17">Under 17s</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError msg={errors.ageGroup} />
                </div>

                <div>
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <Select value={formData.skillLevel} onValueChange={(v) => update('skillLevel', v)}>
                    <SelectTrigger id="skillLevel" className={`bg-background ${errCls('skillLevel')}`}><SelectValue placeholder="Select skill level" /></SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="developing">Developing</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError msg={errors.skillLevel} />
                </div>

                <div>
                  <Label htmlFor="playerCount">Number of Players</Label>
                  <Input id="playerCount" type="number" inputMode="numeric" placeholder="e.g. 16" min={1} max={50}
                    value={formData.playerCount} onChange={(e) => update('playerCount', e.target.value)} className={errCls('playerCount')} />
                  <FieldError msg={errors.playerCount} />
                </div>

                <div>
                  <Label htmlFor="sessionDuration">Session Duration</Label>
                  <Select value={formData.sessionDuration} onValueChange={(v) => update('sessionDuration', v)}>
                    <SelectTrigger id="sessionDuration" className={`bg-background ${errCls('sessionDuration')}`}><SelectValue placeholder="Select duration" /></SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {['45', '60', '75', '90', '120'].map((m) => <SelectItem key={m} value={m}>{m} minutes</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError msg={errors.sessionDuration} />
                </div>

                <div>
                  <Label htmlFor="playingStyle">Playing Style (optional)</Label>
                  <Select value={formData.playingStyle || NO_STYLE} onValueChange={(v) => update('playingStyle', v === NO_STYLE ? '' : v)}>
                    <SelectTrigger id="playingStyle" className="bg-background"><SelectValue placeholder="Select playing style" /></SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value={NO_STYLE}>No preference</SelectItem>
                      <SelectItem value="possession">Possession Based</SelectItem>
                      <SelectItem value="counter">Counter Attacking</SelectItem>
                      <SelectItem value="pressing">High Pressing</SelectItem>
                      <SelectItem value="direct">Direct Play</SelectItem>
                      <SelectItem value="flexible">Flexible Approach</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError msg={errors.playingStyle} />
                </div>
              </div>

              <div>
                <Label htmlFor="sessionGoals">Session Goals</Label>
                <Textarea id="sessionGoals" maxLength={500} value={formData.sessionGoals}
                  placeholder="e.g. Improve passing under pressure, finishing from wide areas"
                  onChange={(e) => update('sessionGoals', e.target.value)} className={errCls('sessionGoals')} />
                <p className="text-xs text-muted-foreground mt-1">{formData.sessionGoals.length}/500 characters</p>
                <FieldError msg={errors.sessionGoals} />
              </div>

              <div className="grid sm:grid-cols-2 gap-6"><div><Label htmlFor="pitchSize">Pitch available (optional)</Label><Input id="pitchSize" placeholder="e.g. 30 × 20, half pitch" value={formData.pitchSize} onChange={e => update('pitchSize', e.target.value)} /></div><div><Label htmlFor="coachCount">Number of coaches</Label><Input id="coachCount" type="number" min={1} max={10} value={formData.coachCount} onChange={e => update('coachCount', e.target.value)} /><FieldError msg={errors.coachCount} /></div><div><Label htmlFor="units">Units</Label><Select value={formData.units} onValueChange={v => update('units', v)}><SelectTrigger id="units"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="metres">Metres</SelectItem><SelectItem value="yards">Yards</SelectItem></SelectContent></Select></div><fieldset><legend className="text-sm font-medium mb-2">Equipment available</legend><div className="flex flex-wrap gap-3">{['Balls','Cones','Bibs','Goals','Mini goals'].map(item => <label key={item} className="flex gap-2 items-center text-sm"><input type="checkbox" checked={formData.equipment.includes(item)} onChange={e => setFormData(p => ({ ...p, equipment: e.target.checked ? [...p.equipment, item] : p.equipment.filter(x => x !== item) }))} />{item}</label>)}</div></fieldset></div>

              <div>
                <Label htmlFor="currentFocus">Current Team Focus Areas (optional)</Label>
                <Textarea id="currentFocus" maxLength={500} value={formData.currentFocus}
                  placeholder="e.g. First touch under pressure, communication in defensive transitions"
                  onChange={(e) => update('currentFocus', e.target.value)} className={errCls('currentFocus')} />
                <p className="text-xs text-muted-foreground mt-1">{formData.currentFocus.length}/500 characters</p>
                <FieldError msg={errors.currentFocus} />
              </div>

              {!user && (
                <p className="text-sm text-muted-foreground text-center">
                  You're not signed in, so this session will only be kept in this browser tab.
                </p>
              )}

              <Button type="submit" className="w-full whitespace-normal min-h-12" disabled={isSubmitting}>
                {isSubmitting ? "Planning your session…" : "Generate training session"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TeamSetup;
