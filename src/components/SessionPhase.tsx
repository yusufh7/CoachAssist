import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ActivityCard from '@/components/ActivityCard';

interface Props {
  phase: any;
  phaseIndex: number;
  onCustomizeActivity?: (phaseIndex: number, activityIndex: number) => void;
}

const SessionPhase = ({ phase, phaseIndex, onCustomizeActivity }: Props) => (
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
          <ActivityCard
            key={activityIndex}
            activity={activity}
            phaseIndex={phaseIndex}
            activityIndex={activityIndex}
            onCustomize={onCustomizeActivity}
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default SessionPhase;
