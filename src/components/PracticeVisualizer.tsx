
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PracticeVisualizer = ({ activity }) => {
  const renderVisualization = () => {
    // Create a simple SVG visualization based on the activity
    const pitchWidth = 300;
    const pitchHeight = 200;
    
    // Basic pitch background
    return (
      <svg width={pitchWidth} height={pitchHeight} className="border rounded-lg bg-green-100">
        {/* Pitch outline */}
        <rect 
          x="10" 
          y="10" 
          width={pitchWidth - 20} 
          height={pitchHeight - 20} 
          fill="none" 
          stroke="#22c55e" 
          strokeWidth="2"
        />
        
        {/* Center circle */}
        <circle 
          cx={pitchWidth / 2} 
          cy={pitchHeight / 2} 
          r="30" 
          fill="none" 
          stroke="#22c55e" 
          strokeWidth="1"
        />
        
        {/* Center line */}
        <line 
          x1={pitchWidth / 2} 
          y1="10" 
          x2={pitchWidth / 2} 
          y2={pitchHeight - 10} 
          stroke="#22c55e" 
          strokeWidth="1"
        />
        
        {/* Example players for passing practice */}
        {activity.name.toLowerCase().includes('passing') && (
          <>
            {/* Team in possession (blue) */}
            <circle cx="60" cy="60" r="8" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="120" cy="80" r="8" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="180" cy="60" r="8" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="240" cy="80" r="8" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            
            {/* Defenders (red) */}
            <circle cx="90" cy="70" r="8" fill="#ef4444" stroke="#fff" strokeWidth="2" />
            <circle cx="150" cy="90" r="8" fill="#ef4444" stroke="#fff" strokeWidth="2" />
            
            {/* Ball */}
            <circle cx="60" cy="60" r="4" fill="#000" />
            
            {/* Passing arrows */}
            <path d="M 68 60 L 110 78" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
            
            {/* Arrow marker */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
              </marker>
            </defs>
          </>
        )}
        
        {/* Example setup for ball mastery */}
        {activity.name.toLowerCase().includes('ball mastery') && (
          <>
            {/* Individual players with balls */}
            <circle cx="50" cy="50" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="50" cy="50" r="3" fill="#000" />
            
            <circle cx="120" cy="70" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="120" cy="70" r="3" fill="#000" />
            
            <circle cx="190" cy="50" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="190" cy="50" r="3" fill="#000" />
            
            <circle cx="250" cy="70" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="250" cy="70" r="3" fill="#000" />
            
            <circle cx="80" cy="120" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="80" cy="120" r="3" fill="#000" />
            
            <circle cx="150" cy="140" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="150" cy="140" r="3" fill="#000" />
            
            <circle cx="220" cy="120" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="220" cy="120" r="3" fill="#000" />
          </>
        )}
        
        {/* Defensive shape visualization */}
        {activity.name.toLowerCase().includes('defensive') && (
          <>
            {/* Defensive line */}
            <circle cx="70" cy="100" r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" />
            <circle cx="110" cy="100" r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" />
            <circle cx="150" cy="100" r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" />
            <circle cx="190" cy="100" r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" />
            <circle cx="230" cy="100" r="6" fill="#ef4444" stroke="#fff" strokeWidth="2" />
            
            {/* Attacking players */}
            <circle cx="90" cy="60" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="150" cy="50" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            <circle cx="210" cy="60" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            
            {/* Ball with attacking team */}
            <circle cx="150" cy="50" r="3" fill="#000" />
            
            {/* Defensive line connection */}
            <path d="M 70 100 L 230 100" stroke="#ef4444" strokeWidth="1" strokeDasharray="5,5" />
          </>
        )}
        
        {/* Text labels */}
        <text x="15" y="25" className="text-xs fill-gray-600" fontFamily="Arial">
          {activity.setup}
        </text>
      </svg>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Practice Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          {renderVisualization()}
        </div>
        <div className="mt-4 flex justify-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>Attacking Team</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Defending Team</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-black rounded-full mr-1"></div>
            <span>Ball</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PracticeVisualizer;
