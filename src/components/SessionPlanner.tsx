import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Users, Target, Download, Edit3 } from 'lucide-react';
import PracticeVisualizer from '@/components/PracticeVisualizer';
import SessionExport from '@/components/SessionExport';
import ActivityCustomizer from '@/components/ActivityCustomizer';

const SessionPlanner = ({ teamData, onBack }) => {
  const [sessionPlan, setSessionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [customizingActivity, setCustomizingActivity] = useState(null);

  const generateSessionContent = (teamData) => {
    const ageGroup = teamData.ageGroup;
    const skillLevel = teamData.skillLevel;
    const sessionGoals = teamData.sessionGoals.toLowerCase();
    
    // Generate different practices based on team data
    const practices = {
      warmUp: {
        technical: {
          name: "Ball Mastery & First Touch",
          duration: 10,
          description: `Individual ball work focusing on ${sessionGoals.includes('passing') ? 'first touch preparation for passing' : 'close control and agility'}`,
          coachingPoints: ["Keep ball close", "Use both feet", "Look up regularly", "Quick feet, soft touch"],
          setup: `Each player with a ball in ${ageGroup.includes('u7') || ageGroup.includes('u9') ? '15x15' : '20x20'} yard area`
        },
        physical: {
          name: "Dynamic Movement",
          duration: 5,
          description: "Progressive warm-up with ball",
          coachingPoints: ["Gradually increase intensity", "Focus on proper movement mechanics", "Ball stays close"],
          setup: `Players in pairs around the ${ageGroup.includes('u7') || ageGroup.includes('u9') ? 'penalty area' : 'center circle'}`
        }
      },
      technical: {
        passing: {
          name: skillLevel === 'beginner' ? 'Basic Passing in Pairs' : 'Passing Under Pressure',
          duration: 20,
          description: skillLevel === 'beginner' 
            ? '5-10 yard passing in pairs, focus on technique'
            : '4v2 possession squares. Team of 4 must complete 8 passes to score a point.',
          coachingPoints: skillLevel === 'beginner'
            ? ["Inside of foot", "Look at target", "Follow through to target", "Weight of pass"]
            : ["Quick first touch", "Scan before receiving", "Support the ball carrier", "Keep possession"],
          setup: skillLevel === 'beginner'
            ? "Pairs 10 yards apart across the area"
            : "20x15 yard area with 6 players (4v2)",
          progressions: skillLevel === 'beginner'
            ? ["Increase distance", "Add movement", "One touch passing"]
            : ["Reduce area size", "Increase to 5v3", "Add target goals"]
        },
        shooting: {
          name: 'Finishing Practice',
          duration: 20,
          description: sessionGoals.includes('finishing') 
            ? 'Finishing from wide areas with crosses and cut-backs'
            : 'Basic shooting technique from edge of area',
          coachingPoints: ["Strike through the ball", "Keep head steady", "Hit the target", "Follow up rebounds"],
          setup: "Half pitch with goals and cones for crossing positions",
          progressions: ["Add defenders", "Vary service", "Time pressure"]
        }
      },
      tactical: {
        defensive: {
          name: sessionGoals.includes('defensive') ? 'Defensive Shape & Pressing' : 'Basic Defending',
          duration: 25,
          description: sessionGoals.includes('defensive')
            ? '11v11 practice focusing on maintaining defensive shape and pressing triggers'
            : '3v3 defending in small areas',
          coachingPoints: sessionGoals.includes('defensive')
            ? ["Stay compact", "Press as a unit", "Communication is key", "Delay and deny"]
            : ["Get close quickly", "Stay on feet", "Force to weaker side"],
          setup: sessionGoals.includes('defensive') ? "Full pitch with goals" : "30x20 yard areas",
          progressions: sessionGoals.includes('defensive')
            ? ["Add specific pressing triggers", "Vary starting positions"]
            : ["Increase area", "Add extra attacker", "Competition element"]
        }
      }
    };

    // Build session based on goals
    const phases = [
      {
        name: "Warm-Up",
        duration: 15,
        activities: [
          practices.warmUp.physical,
          practices.warmUp.technical
        ]
      }
    ];

    // Add technical phase based on goals
    if (sessionGoals.includes('passing')) {
      phases.push({
        name: "Technical Practice",
        duration: 20,
        activities: [practices.technical.passing]
      });
    } else if (sessionGoals.includes('finishing') || sessionGoals.includes('shooting')) {
      phases.push({
        name: "Technical Practice", 
        duration: 20,
        activities: [practices.technical.shooting]
      });
    } else {
      phases.push({
        name: "Technical Practice",
        duration: 20,
        activities: [practices.technical.passing]
      });
    }

    // Add tactical phase
    phases.push({
      name: "Tactical Practice",
      duration: 25,
      activities: [practices.tactical.defensive]
    });

    // Cool down
    phases.push({
      name: "Cool-Down",
      duration: 10,
      activities: [{
        name: "Static Stretching",
        duration: 10,
        description: "Team stretching focusing on major muscle groups",
        coachingPoints: ["Hold stretches for 30 seconds", "Focus on breathing", "Hydrate well"],
        setup: "Team circle on the pitch"
      }]
    });

    return phases;
  };

  useEffect(() => {
    const generateSession = () => {
      setTimeout(() => {
        const phases = generateSessionContent(teamData);
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
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Generating Your Session Plan</h3>
            <p className="text-gray-600">Creating a customized training session based on your team's needs...</p>
          </CardContent>
        </Card>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{sessionPlan.duration} min</div>
                  <div className="text-sm text-gray-600">Total Duration</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{teamData.playerCount}</div>
                  <div className="text-sm text-gray-600">Players</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{sessionPlan.phases.length}</div>
                  <div className="text-sm text-gray-600">Training Phases</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Session Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {sessionPlan.objectives.map((objective, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {objective}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessionPlan.phases.map((phase, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{phase.name}</h4>
                        <p className="text-sm text-gray-600">{phase.activities.length} activities</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{phase.duration} min</div>
                        <div className="text-sm text-gray-600">Duration</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {sessionPlan.phases.map((phase, phaseIndex) => (
            <TabsContent key={phaseIndex} value={phase.name.toLowerCase().replace(' ', '-')} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {phase.name}
                    <Badge variant="outline">{phase.duration} minutes</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {phase.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold">{activity.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge>{activity.duration} min</Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCustomizeActivity(phaseIndex, activityIndex)}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Customize
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium mb-2">Description</h5>
                              <p className="text-gray-700">{activity.description}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-2">Setup</h5>
                              <p className="text-gray-700">{activity.setup}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-2">Key Coaching Points</h5>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {activity.coachingPoints.map((point, pointIndex) => (
                                  <li key={pointIndex}>{point}</li>
                                ))}
                              </ul>
                            </div>
                            
                            {activity.progressions && (
                              <div>
                                <h5 className="font-medium mb-2">Progressions</h5>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                  {activity.progressions.map((progression, progIndex) => (
                                    <li key={progIndex}>{progression}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <PracticeVisualizer activity={activity} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default SessionPlanner;
