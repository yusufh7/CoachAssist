
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Target } from 'lucide-react';

const SessionOverview = ({ sessionPlan, teamData }) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default SessionOverview;
