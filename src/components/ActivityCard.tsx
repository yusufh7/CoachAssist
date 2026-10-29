import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit3 } from 'lucide-react';
import PracticeVisualizer from '@/components/PracticeVisualizer';
import type { Activity } from '@/lib/sessionGenerator';

const ListBlock = ({ title, items }: { title: string; items?: string[] }) =>
  items && items.length ? (
    <div>
      <h5 className="font-medium mb-2">{title}</h5>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  ) : null;

const ActivityCard = ({ activity, phaseIndex, activityIndex, onCustomize, adjustment }: { activity: Activity; phaseIndex: number; activityIndex: number; onCustomize?: (p: number, a: number) => void; adjustment?: React.ReactNode }) => (
  <div className="border rounded-lg p-4 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
      <h4 className="text-lg font-semibold">{activity.name}</h4>
      <div className="flex items-center gap-2">
        <Badge>{activity.duration} min</Badge>
        {onCustomize && (
          <Button variant="outline" size="sm" onClick={() => onCustomize(phaseIndex, activityIndex)}>
            <Edit3 className="w-4 h-4 mr-2" />
            Customise
          </Button>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h5 className="font-medium mb-2">Description</h5>
          <p className="text-muted-foreground">{activity.description}</p>
        </div>
        <div>
          <h5 className="font-medium mb-2">Setup</h5>
          <p className="text-muted-foreground">{activity.setup}</p>
        </div>
        {activity.equipment && (
          <div>
            <h5 className="font-medium mb-2">Equipment</h5>
            <p className="text-muted-foreground">{activity.equipment}</p>
          </div>
        )}
        <ListBlock title="Key Coaching Points" items={activity.coachingPoints} />
        <ListBlock title="Rules" items={activity.rules} />
        <ListBlock title="Key questions" items={activity.questions} />
        <ListBlock title="Common errors" items={activity.commonErrors} />
        <ListBlock title="Progressions" items={activity.progressions} />
        <ListBlock title="Regressions" items={activity.regressions} />
      </div>
      <div>
        <PracticeVisualizer activity={activity} />
      </div>
    </div>
    {adjustment && <div className="mt-6">{adjustment}</div>}
  </div>
);

export default ActivityCard;
