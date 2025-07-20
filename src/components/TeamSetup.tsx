
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SecureInput } from "@/components/ui/secure-input";
import { SecureTextarea } from "@/components/ui/secure-textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { teamSetupSchema, formRateLimiter, type TeamSetupFormData } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface TeamSetupProps {
  onComplete: (data: any) => void;
  user?: User | null;
}

const TeamSetup = ({ onComplete, user }: TeamSetupProps) => {
  const { toast } = useToast();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Rate limiting check
    const clientId = 'team-setup-form'; // In a real app, this would be user-specific
    if (!formRateLimiter.canProceed(clientId)) {
      toast({
        title: "Too many attempts",
        description: "Please wait a minute before submitting again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Validate and sanitize form data
      const validatedData = teamSetupSchema.parse(formData);
      
      // Save to database if user is authenticated
      if (user) {
        const { error } = await supabase.from('teams').insert({
          user_id: user.id,
          name: validatedData.teamName,
          age_group: validatedData.ageGroup,
          skill_level: validatedData.skillLevel,
          player_count: Number(validatedData.playerCount),
          session_duration: Number(validatedData.sessionDuration),
          playing_style: validatedData.playingStyle,
          goals: validatedData.sessionGoals,
          current_focus: validatedData.currentFocus
        });

        if (error) {
          throw new Error('Failed to save team: ' + error.message);
        }

        toast({
          title: "Team saved!",
          description: "Your team has been saved to your account.",
        });
      }
      
      onComplete(validatedData);
    } catch (error) {
      if (error instanceof Error) {
        const zodError = error as any;
        if (zodError.errors) {
          const formErrors: Record<string, string> = {};
          zodError.errors.forEach((err: any) => {
            if (err.path) {
              formErrors[err.path[0]] = err.message;
            }
          });
          setErrors(formErrors);
          toast({
            title: "Validation Error",
            description: "Please check the form and correct any errors.",
            variant: "destructive"
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
                  <SecureInput
                    id="teamName"
                    placeholder="e.g. Under 16s Eagles"
                    value={formData.teamName}
                    onChange={(e) => updateFormData('teamName', e.target.value)}
                    required
                    maxLength={100}
                    allowedPattern={/^[a-zA-Z0-9\s\-&']*$/}
                    className={errors.teamName ? "border-destructive" : ""}
                  />
                  {errors.teamName && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.teamName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="ageGroup">Age Group</Label>
                  <Select onValueChange={(value) => updateFormData('ageGroup', value)} required>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
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
                </div>

                <div>
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <Select onValueChange={(value) => updateFormData('skillLevel', value)} required>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
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
                  <SecureInput
                    id="playerCount"
                    type="number"
                    placeholder="e.g. 16"
                    value={formData.playerCount}
                    onChange={(e) => updateFormData('playerCount', e.target.value)}
                    required
                    min={1}
                    max={50}
                    maxLength={2}
                    allowedPattern={/^[0-9]*$/}
                    className={errors.playerCount ? "border-destructive" : ""}
                  />
                  {errors.playerCount && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.playerCount}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="sessionDuration">Session Duration</Label>
                  <Select onValueChange={(value) => updateFormData('sessionDuration', value)} required>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
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
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select playing style" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
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
                <SecureTextarea
                  id="sessionGoals"
                  placeholder="e.g. Improve passing under pressure, work on defensive shape, finishing from wide areas"
                  value={formData.sessionGoals}
                  onChange={(e) => updateFormData('sessionGoals', e.target.value)}
                  required
                  maxLength={500}
                  className={errors.sessionGoals ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.sessionGoals.length}/500 characters
                </p>
                {errors.sessionGoals && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.sessionGoals}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="currentFocus">Current Team Focus Areas</Label>
                <SecureTextarea
                  id="currentFocus"
                  placeholder="e.g. Players struggle with first touch under pressure, need to work on communication in defensive transitions"
                  value={formData.currentFocus}
                  onChange={(e) => updateFormData('currentFocus', e.target.value)}
                  maxLength={500}
                  className={errors.currentFocus ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.currentFocus.length}/500 characters
                </p>
                {errors.currentFocus && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.currentFocus}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Validating..." : "Generate Training Session"}
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
