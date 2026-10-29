import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ActivityCard from '@/components/ActivityCard';
import type { Activity } from '@/lib/sessionGenerator';

interface Props {
  phase: any;
  phaseIndex: number;
  onCustomizeActivity?: (phaseIndex: number, activityIndex: number) => void;
  renderAdjustment?: (activity: Activity, activityIndex: number) => React.ReactNode;
}

const SessionPhase = ({ phase, phaseIndex, onCustomizeActivity, renderAdjustment }: Props) => (
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
            adjustment={renderAdjustment?.(activity, activityIndex)}
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default SessionPhase;
