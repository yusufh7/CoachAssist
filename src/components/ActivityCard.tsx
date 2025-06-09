
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit3 } from 'lucide-react';
import PracticeVisualizer from '@/components/PracticeVisualizer';

const ActivityCard = ({ activity, phaseIndex, activityIndex, onCustomize }) => {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">{activity.name}</h4>
        <div className="flex items-center space-x-2">
          <Badge>{activity.duration} min</Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onCustomize(phaseIndex, activityIndex)}
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
  );
};

export default ActivityCard;
