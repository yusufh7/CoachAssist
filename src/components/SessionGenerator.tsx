
import React from 'react';

const SessionGenerator = {
  generateSessionContent: (teamData) => {
    console.log('Generating session with team data:', teamData);
    
    if (!teamData) {
      console.error('No team data provided to session generator');
      return [];
    }

    const ageGroup = teamData.ageGroup || 'u11';
    const skillLevel = teamData.skillLevel || 'beginner';
    const sessionGoals = (teamData.sessionGoals || 'passing').toLowerCase();
    const sessionDuration = parseInt(teamData.sessionDuration) || 60;
    
    console.log('Parsed data:', { ageGroup, skillLevel, sessionGoals, sessionDuration });

    // Calculate phase durations based on total session time
    const warmUpDuration = Math.floor(sessionDuration * 0.15); // 15%
    const technicalDuration = Math.floor(sessionDuration * 0.35); // 35%
    const tacticalDuration = Math.floor(sessionDuration * 0.35); // 35%
    const coolDownDuration = Math.floor(sessionDuration * 0.15); // 15%

    // Generate different practices based on team data
    const practices = {
      warmUp: {
        technical: {
          name: "Ball Mastery & First Touch",
          duration: Math.max(5, warmUpDuration - 5),
          description: `Individual ball work focusing on ${sessionGoals.includes('passing') ? 'first touch preparation for passing' : 'close control and agility'}`,
          coachingPoints: ["Keep ball close", "Use both feet", "Look up regularly", "Quick feet, soft touch"],
          setup: `Each player with a ball in ${ageGroup.includes('u7') || ageGroup.includes('u9') ? '15x15' : '20x20'} yard area`,
          equipment: "1 ball per player, cones for area"
        },
        physical: {
          name: "Dynamic Movement",
          duration: 5,
          description: "Progressive warm-up with ball",
          coachingPoints: ["Gradually increase intensity", "Focus on proper movement mechanics", "Ball stays close"],
          setup: `Players in pairs around the ${ageGroup.includes('u7') || ageGroup.includes('u9') ? 'penalty area' : 'center circle'}`,
          equipment: "1 ball per pair"
        }
      },
      technical: {
        passing: {
          name: skillLevel === 'beginner' ? 'Basic Passing in Pairs' : 'Passing Under Pressure',
          duration: technicalDuration,
          description: skillLevel === 'beginner' 
            ? '5-10 yard passing in pairs, focus on technique and accuracy'
            : '4v2 possession squares. Team of 4 must complete 8 passes to score a point.',
          coachingPoints: skillLevel === 'beginner'
            ? ["Inside of foot", "Look at target", "Follow through to target", "Weight of pass"]
            : ["Quick first touch", "Scan before receiving", "Support the ball carrier", "Keep possession"],
          setup: skillLevel === 'beginner'
            ? "Pairs 10 yards apart across the area"
            : "20x15 yard area with 6 players (4v2)",
          progressions: skillLevel === 'beginner'
            ? ["Increase distance", "Add movement", "One touch passing"]
            : ["Reduce area size", "Increase to 5v3", "Add target goals"],
          equipment: skillLevel === 'beginner' ? "1 ball per pair, cones for distance" : "Cones for area, 2 balls per group"
        },
        shooting: {
          name: 'Finishing Practice',
          duration: technicalDuration,
          description: sessionGoals.includes('finishing') 
            ? 'Finishing from wide areas with crosses and cut-backs'
            : 'Basic shooting technique from edge of area',
          coachingPoints: ["Strike through the ball", "Keep head steady", "Hit the target", "Follow up rebounds"],
          setup: "Half pitch with goals and cones for crossing positions",
          progressions: ["Add defenders", "Vary service", "Time pressure"],
          equipment: "Goals, 10+ balls, cones for positions"
        },
        dribbling: {
          name: 'Close Control & Dribbling',
          duration: technicalDuration,
          description: 'Individual and 1v1 dribbling practice focusing on close control and beating opponents',
          coachingPoints: ["Keep ball close", "Use body feints", "Change of pace", "Protect the ball"],
          setup: "30x20 yard area with gates/cones",
          progressions: ["Add pressure", "Increase speed", "Competition element"],
          equipment: "Cones for gates, 1 ball per player"
        }
      },
      tactical: {
        defensive: {
          name: sessionGoals.includes('defensive') ? 'Defensive Shape & Pressing' : 'Basic Defending',
          duration: tacticalDuration,
          description: sessionGoals.includes('defensive')
            ? '7v7 or 11v11 practice focusing on maintaining defensive shape and pressing triggers'
            : '3v3 defending in small areas',
          coachingPoints: sessionGoals.includes('defensive')
            ? ["Stay compact", "Press as a unit", "Communication is key", "Delay and deny"]
            : ["Get close quickly", "Stay on feet", "Force to weaker side"],
          setup: sessionGoals.includes('defensive') ? "Full pitch with goals" : "30x20 yard areas",
          progressions: sessionGoals.includes('defensive')
            ? ["Add specific pressing triggers", "Vary starting positions"]
            : ["Increase area", "Add extra attacker", "Competition element"],
          equipment: sessionGoals.includes('defensive') ? "Goals, bibs, balls" : "Cones, bibs, balls"
        },
        attacking: {
          name: 'Attacking Play & Creativity',
          duration: tacticalDuration,
          description: 'Small-sided games focusing on creating and finishing chances',
          coachingPoints: ["Quick passing", "Movement off the ball", "Create space", "Take risks in final third"],
          setup: "40x30 yard area with small goals",
          progressions: ["Add conditions", "Vary team sizes", "Tournament format"],
          equipment: "Small goals, bibs, balls, cones"
        }
      }
    };

    // Build session based on goals and duration
    const phases = [
      {
        name: "Warm-Up",
        duration: warmUpDuration,
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
        duration: technicalDuration,
        activities: [practices.technical.passing]
      });
    } else if (sessionGoals.includes('finishing') || sessionGoals.includes('shooting')) {
      phases.push({
        name: "Technical Practice", 
        duration: technicalDuration,
        activities: [practices.technical.shooting]
      });
    } else if (sessionGoals.includes('dribbling')) {
      phases.push({
        name: "Technical Practice",
        duration: technicalDuration,
        activities: [practices.technical.dribbling]
      });
    } else {
      // Default to passing if no specific goal
      phases.push({
        name: "Technical Practice",
        duration: technicalDuration,
        activities: [practices.technical.passing]
      });
    }

    // Add tactical phase based on goals
    if (sessionGoals.includes('attacking')) {
      phases.push({
        name: "Tactical Practice",
        duration: tacticalDuration,
        activities: [practices.tactical.attacking]
      });
    } else {
      phases.push({
        name: "Tactical Practice",
        duration: tacticalDuration,
        activities: [practices.tactical.defensive]
      });
    }

    // Cool down
    phases.push({
      name: "Cool-Down",
      duration: coolDownDuration,
      activities: [{
        name: "Static Stretching & Team Talk",
        duration: coolDownDuration,
        description: "Team stretching focusing on major muscle groups followed by session review",
        coachingPoints: ["Hold stretches for 30 seconds", "Focus on breathing", "Hydrate well", "Reflect on session learning"],
        setup: "Team circle on the pitch",
        equipment: "Water bottles"
      }]
    });

    console.log('Generated phases:', phases);
    return phases;
  }
};

export default SessionGenerator;
