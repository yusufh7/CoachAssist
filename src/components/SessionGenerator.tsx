
import React from 'react';

const SessionGenerator = {
  generateSessionContent: (teamData) => {
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
  }
};

export default SessionGenerator;
