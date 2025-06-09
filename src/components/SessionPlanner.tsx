
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';
import SessionOverview from '@/components/SessionOverview';
import SessionPhase from '@/components/SessionPhase';
import SessionExport from '@/components/SessionExport';
import ActivityCustomizer from '@/components/ActivityCustomizer';
import SessionGenerator from '@/components/SessionGenerator';

const SessionPlanner = ({ teamData, onBack }) => {
  const [sessionPlan, setSessionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [customizingActivity, setCustomizingActivity] = useState(null);

  useEffect(() => {
    const generateSession = () => {
      setTimeout(() => {
        const phases = SessionGenerator.generateSessionContent(teamData);
        const generatedSession = {
          title: `${teamData.teamName} Training Session`,
          duration: parseInt(teamData.sessionDuration),
          objectives: teamData.sessionGoals.split(',').map(goal => goal.trim()),
          phases: phases
        };
        setSessionPlan(generatedSession);
        setLoading(false);
      }, 2000);
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="w-96 bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Generating Your Session Plan</h3>
          <p className="text-gray-600">Creating a customized training session based on your team's needs...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={onBack}>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="warm-up">Warm-Up</TabsTrigger>
            <TabsTrigger value="main">Main Session</TabsTrigger>
            <TabsTrigger value="cool-down">Cool-Down</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SessionOverview sessionPlan={sessionPlan} teamData={teamData} />
          </TabsContent>

          {sessionPlan.phases.map((phase, phaseIndex) => (
            <TabsContent key={phaseIndex} value={phase.name.toLowerCase().replace(' ', '-')} className="space-y-6">
              <SessionPhase
                phase={phase}
                phaseIndex={phaseIndex}
                onCustomizeActivity={handleCustomizeActivity}
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default SessionPlanner;
