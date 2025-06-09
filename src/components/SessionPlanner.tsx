
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Users, Target, Download, Edit3 } from 'lucide-react';
import PracticeVisualizer from '@/components/PracticeVisualizer';
import SessionExport from '@/components/SessionExport';

const SessionPlanner = ({ teamData, onBack }) => {
  const [sessionPlan, setSessionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate AI generation of session plan
    const generateSession = () => {
      setTimeout(() => {
        const generatedSession = {
          title: `${teamData.teamName} Training Session`,
          duration: parseInt(teamData.sessionDuration),
          objectives: teamData.sessionGoals.split(',').map(goal => goal.trim()),
          phases: [
            {
              name: "Warm-Up",
              duration: 15,
              activities: [
                {
                  name: "Dynamic Movement",
                  duration: 5,
                  description: "Light jogging, high knees, heel flicks",
                  coachingPoints: ["Gradually increase intensity", "Focus on proper movement mechanics"],
                  setup: "Players in pairs around the penalty area"
                },
                {
                  name: "Ball Mastery",
                  duration: 10,
                  description: "Individual ball work - toe taps, sole rolls, step-overs",
                  coachingPoints: ["Keep ball close", "Use both feet", "Look up regularly"],
                  setup: "Each player with a ball in 20x20 yard area"
                }
              ]
            },
            {
              name: "Technical Practice",
              duration: 20,
              activities: [
                {
                  name: "Passing Under Pressure",
                  duration: 20,
                  description: "4v2 possession in 20x15 yard area. Team of 4 must complete 8 passes to score a point.",
                  coachingPoints: ["Quick first touch", "Scan before receiving", "Support the ball carrier"],
                  setup: "20x15 yard area with 6 players (4v2)",
                  progressions: ["Reduce area size", "Increase to 5v3", "Add target goals"]
                }
              ]
            },
            {
              name: "Tactical Practice",
              duration: 25,
              activities: [
                {
                  name: "Defensive Shape",
                  duration: 25,
                  description: "11v11 practice focusing on maintaining defensive shape and pressing triggers",
                  coachingPoints: ["Stay compact", "Press as a unit", "Communication is key"],
                  setup: "Full pitch with goals",
                  progressions: ["Add specific pressing triggers", "Vary starting positions"]
                }
              ]
            },
            {
              name: "Cool-Down",
              duration: 10,
              activities: [
                {
                  name: "Static Stretching",
                  duration: 10,
                  description: "Team stretching focusing on major muscle groups",
                  coachingPoints: ["Hold stretches for 30 seconds", "Focus on breathing"],
                  setup: "Team circle on the pitch"
                }
              ]
            }
          ]
        };
        setSessionPlan(generatedSession);
        setLoading(false);
      }, 2000);
    };

    generateSession();
  }, [teamData]);

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
                            <Button variant="outline" size="sm">
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
