
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from 'lucide-react';

const ActivityCustomizer = ({ activity, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: activity.name,
    duration: activity.duration,
    description: activity.description,
    setup: activity.setup,
    coachingPoints: activity.coachingPoints.join('\n'),
    progressions: activity.progressions ? activity.progressions.join('\n') : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedActivity = {
      ...activity,
      name: formData.name,
      duration: parseInt(formData.duration),
      description: formData.description,
      setup: formData.setup,
      coachingPoints: formData.coachingPoints.split('\n').filter(point => point.trim()),
      progressions: formData.progressions ? formData.progressions.split('\n').filter(prog => prog.trim()) : undefined
    };
    onSave(updatedActivity);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Session
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Customize Activity</h1>
            <div />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit: {activity.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Activity Name</Label>
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
                <Label htmlFor="setup">Setup</Label>
                <Textarea
                  id="setup"
                  value={formData.setup}
                  onChange={(e) => updateFormData('setup', e.target.value)}
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="coachingPoints">Key Coaching Points (one per line)</Label>
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

              <div className="flex space-x-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ActivityCustomizer;
