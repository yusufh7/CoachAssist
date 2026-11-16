
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from 'lucide-react';
import type { Activity } from '@/lib/sessionGenerator';
import { reconcileActivityLayout } from '@/lib/activityEdit';

interface Props { activity: Activity; onSave: (activity: Activity) => Promise<void>; onCancel: () => void }
const ActivityCustomizer = ({ activity, onSave, onCancel }: Props) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: activity.name,
    duration: String(activity.duration),
    description: activity.description,
    setup: activity.setup,
    coachingPoints: activity.coachingPoints.join('\n'),
    progressions: activity.progressions ? activity.progressions.join('\n') : '',
    regressions: activity.regressions ? activity.regressions.join('\n') : ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const duration = Number(formData.duration);
    if (!Number.isInteger(duration) || duration < 1 || duration > 120) { setError('Choose a whole number of minutes from 1 to 120.'); return; }
    if (![formData.name, formData.description, formData.setup, formData.coachingPoints].every(value => value.trim())) { setError('Complete the practice name, description, set up and coaching points.'); return; }
    setSaving(true); setError('');
    const updatedActivity = {
      ...activity,
      name: formData.name,
      duration,
      description: formData.description,
      setup: formData.setup,
      coachingPoints: formData.coachingPoints.split('\n').filter(point => point.trim()),
      progressions: formData.progressions.split('\n').filter(p => p.trim()),
      regressions: formData.regressions.split('\n').filter(p => p.trim())
    };
    try { await onSave(reconcileActivityLayout(activity, updatedActivity)); }
    catch { setError('Changes could not be saved. Please try again.'); }
    finally { setSaving(false); }
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between min-h-16 py-3 gap-3">
            <Button variant="ghost" onClick={onCancel} disabled={saving}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-foreground">Edit practice</h1>
            <div />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section>
          <CardHeader>
            <CardTitle>{activity.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Practice name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    max={120}
                    step={1}
                    value={formData.duration}
                    onChange={(e) => updateFormData('duration', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div>
                  <Label htmlFor="setup">Set up</Label>
                <Textarea
                  id="setup"
                  value={formData.setup}
                  onChange={(e) => updateFormData('setup', e.target.value)}
                  rows={2}
                  required
                />
              </div>

              <div>
                  <Label htmlFor="coachingPoints">Coaching points (one per line)</Label>
                <Textarea
                  id="coachingPoints"
                  value={formData.coachingPoints}
                  onChange={(e) => updateFormData('coachingPoints', e.target.value)}
                  rows={4}
                  placeholder="Enter each coaching point on a new line"
                  required
                />
              </div>

              <div>
                <Label htmlFor="progressions">Progressions (one per line, optional)</Label>
                <Textarea
                  id="progressions"
                  value={formData.progressions}
                  onChange={(e) => updateFormData('progressions', e.target.value)}
                  rows={3}
                  placeholder="Enter each progression on a new line"
                />
              </div>

              <div>
                <Label htmlFor="regressions">Regressions (one per line, optional)</Label>
                <Textarea
                  id="regressions"
                  value={formData.regressions}
                  onChange={(e) => updateFormData('regressions', e.target.value)}
                  rows={3}
                />
              </div>

              {error && <p role="alert" className="text-destructive">{error}</p>}
              <div className="flex gap-4">
                <Button type="submit" disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </section>
      </main>
    </div>
  );
};

export default ActivityCustomizer;
