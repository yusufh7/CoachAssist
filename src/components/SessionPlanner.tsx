
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertCircle } from 'lucide-react';
import SessionOverview from '@/components/SessionOverview';
import SessionPhase from '@/components/SessionPhase';
import SessionExport from '@/components/SessionExport';
import ActivityCustomizer from '@/components/ActivityCustomizer';
import SessionGenerator from '@/components/SessionGenerator';

const SessionPlanner = ({ teamData, onBack }) => {
  const [sessionPlan, setSessionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [customizingActivity, setCustomizingActivity] = useState(null);

  useEffect(() => {
    const generateSession = () => {
      console.log('Starting session generation with:', teamData);
      
      try {
        if (!teamData) {
          throw new Error('No team data provided');
        }

        setTimeout(() => {
          try {
            const phases = SessionGenerator.generateSessionContent(teamData);
            
            if (!phases || phases.length === 0) {
              throw new Error('Failed to generate session phases');
            }

            const generatedSession = {
              title: `${teamData.teamName || 'Team'} Training Session`,
              duration: parseInt(teamData.sessionDuration) || 60,
              objectives: Array.isArray(teamData.sessionGoals) 
                ? teamData.sessionGoals 
                : (teamData.sessionGoals || '').split(',').map(goal => goal.trim()).filter(goal => goal),
              phases: phases,
              ageGroup: teamData.ageGroup,
              skillLevel: teamData.skillLevel,
              playerCount: teamData.playerCount
            };
            
            console.log('Generated session plan:', generatedSession);
            setSessionPlan(generatedSession);
            setError(null);
            setLoading(false);
          } catch (err) {
            console.error('Error generating session:', err);
            setError('Failed to generate session plan. Please try again.');
            setLoading(false);
          }
        }, 1500);
      } catch (err) {
        console.error('Error in generateSession:', err);
        setError('Invalid team data. Please go back and check your inputs.');
        setLoading(false);
      }
    };

    generateSession();
  }, [teamData]);

  const handleCustomizeActivity = (phaseIndex, activityIndex) => {
    setCustomizingActivity({ phaseIndex, activityIndex });
  };

  const handleSaveCustomization = (updatedActivity) => {
    const newSessionPlan = { ...sessionPlan };
    newSessionPlan.phases[customizingActivity.phaseIndex].activities[customizingActivity.activityIndex] = updatedActivity;
    setSessionPlan(newSessionPlan);
    setCustomizingActivity(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="w-96 bg-white rounded-2xl shadow-xl p-8 text-center border border-green-100">
          <div className="animate-spin w-12 h-12 border-3 border-green-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Generating Your Session Plan</h3>
          <p className="text-gray-600 leading-relaxed">Creating a customized training session based on your team's needs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="w-96 bg-white rounded-2xl shadow-xl p-8 text-center border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Session Generation Failed</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={onBack} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Setup
          </Button>
        </div>
      </div>
    );
  }

  if (customizingActivity) {
    const activity = sessionPlan.phases[customizingActivity.phaseIndex].activities[customizingActivity.activityIndex];
    return (
      <ActivityCustomizer
        activity={activity}
        onSave={handleSaveCustomization}
        onCancel={() => setCustomizingActivity(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={onBack} className="hover:bg-green-50 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-gray-900">{sessionPlan.title}</h1>
            <SessionExport sessionPlan={sessionPlan} teamData={teamData} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border border-gray-200 rounded-xl p-1">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="warm-up" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Warm-Up</TabsTrigger>
            <TabsTrigger value="technical-practice" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Main Session</TabsTrigger>
            <TabsTrigger value="cool-down" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Cool-Down</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SessionOverview sessionPlan={sessionPlan} teamData={teamData} />
          </TabsContent>

          {sessionPlan.phases.map((phase, phaseIndex) => {
            const tabValue = phase.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            return (
              <TabsContent key={phaseIndex} value={tabValue} className="space-y-6">
                <SessionPhase
                  phase={phase}
                  phaseIndex={phaseIndex}
                  onCustomizeActivity={handleCustomizeActivity}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </main>
    </div>
  );
};

export default SessionPlanner;
