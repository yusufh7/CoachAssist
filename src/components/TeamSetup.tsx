
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from 'lucide-react';

const TeamSetup = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    ageGroup: '',
    skillLevel: '',
    playingStyle: '',
    sessionGoals: '',
    sessionDuration: '',
    playerCount: '',
    currentFocus: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => window.location.reload()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Team Setup</h1>
            <div />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Set Up Your Training Session</CardTitle>
            <CardDescription className="text-center">
              Tell us about your team so we can create the perfect session plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    placeholder="e.g. Under 16s Eagles"
                    value={formData.teamName}
                    onChange={(e) => updateFormData('teamName', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ageGroup">Age Group</Label>
                  <Select onValueChange={(value) => updateFormData('ageGroup', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="u7">Under 7s</SelectItem>
                      <SelectItem value="u9">Under 9s</SelectItem>
                      <SelectItem value="u11">Under 11s</SelectItem>
                      <SelectItem value="u13">Under 13s</SelectItem>
                      <SelectItem value="u15">Under 15s</SelectItem>
                      <SelectItem value="u17">Under 17s</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <Select onValueChange={(value) => updateFormData('skillLevel', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="developing">Developing</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="playerCount">Number of Players</Label>
                  <Input
                    id="playerCount"
                    type="number"
                    placeholder="e.g. 16"
                    value={formData.playerCount}
                    onChange={(e) => updateFormData('playerCount', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sessionDuration">Session Duration</Label>
                  <Select onValueChange={(value) => updateFormData('sessionDuration', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="75">75 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="playingStyle">Playing Style</Label>
                  <Select onValueChange={(value) => updateFormData('playingStyle', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select playing style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="possession">Possession Based</SelectItem>
                      <SelectItem value="counter">Counter Attacking</SelectItem>
                      <SelectItem value="pressing">High Pressing</SelectItem>
                      <SelectItem value="direct">Direct Play</SelectItem>
                      <SelectItem value="flexible">Flexible Approach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="sessionGoals">Session Goals</Label>
                <Textarea
                  id="sessionGoals"
                  placeholder="e.g. Improve passing under pressure, work on defensive shape, finishing from wide areas"
                  value={formData.sessionGoals}
                  onChange={(e) => updateFormData('sessionGoals', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="currentFocus">Current Team Focus Areas</Label>
                <Textarea
                  id="currentFocus"
                  placeholder="e.g. Players struggle with first touch under pressure, need to work on communication in defensive transitions"
                  value={formData.currentFocus}
                  onChange={(e) => updateFormData('currentFocus', e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Generate Training Session
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TeamSetup;
