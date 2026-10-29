import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ActivityCard from '@/components/ActivityCard';
import type { Activity, Phase } from '@/lib/sessionGenerator';

interface Props {
  phase: Phase;
  phaseIndex: number;
  onCustomizeActivity?: (phaseIndex: number, activityIndex: number) => void;
  renderAdjustment?: (activity: Activity, activityIndex: number) => React.ReactNode;
}

const SessionPhase = ({ phase, phaseIndex, onCustomizeActivity, renderAdjustment }: Props) => (
  <section className="border-t border-border pt-6">
    <div className="mb-6">
      <h3 className="text-xl font-semibold flex flex-wrap gap-3 items-center justify-between">
        {phase.name}
        <Badge variant="outline">{phase.duration} minutes</Badge>
      </h3>
    </div>
    <div>
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
    </div>
  </section>
);

export default SessionPhase;
