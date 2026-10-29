
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Play, Users, Target, Shield, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PracticeSummary { id: number; title: string; description: string; duration: string; players: string; difficulty: string; category?: string }
const PracticeLibrary = ({ onBack }: { onBack: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('in-possession');
  const [selected, setSelected] = useState<PracticeSummary | null>(null);

  const practiceCategories = {
    'in-possession': {
      title: 'In Possession',
      icon: <Target className="w-5 h-5" />,
      color: 'from-green-500 to-green-600',
      practices: [
        {
          id: 1,
          title: 'Passing & Receiving',
          description: 'Develop technical ability to pass and receive under pressure',
          duration: '15-20 mins',
          players: '8-12',
          difficulty: 'Beginner'
        },
        {
          id: 2,
          title: 'Penetration Play',
          description: 'Breaking through defensive lines with forward passes',
          duration: '20-25 mins',
          players: '10-16',
          difficulty: 'Intermediate'
        },
        {
          id: 3,
          title: 'Width in Attack',
          description: 'Using the full width of the pitch to create space',
          duration: '25-30 mins',
          players: '12-18',
          difficulty: 'Advanced'
        },
        {
          id: 4,
          title: 'Mobility & Movement',
          description: 'Creating space through intelligent movement off the ball',
          duration: '20-25 mins',
          players: '8-14',
          difficulty: 'Intermediate'
        },
        {
          id: 5,
          title: 'Combination Play',
          description: 'Quick passing combinations in tight spaces',
          duration: '15-20 mins',
          players: '6-10',
          difficulty: 'Intermediate'
        },
        {
          id: 6,
          title: 'Crossing & Finishing',
          description: 'Creating and converting crossing opportunities',
          duration: '20-25 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 7,
          title: 'Build-Up Play',
          description: 'Playing out from the back through defensive pressure',
          duration: '25-30 mins',
          players: '12-20',
          difficulty: 'Advanced'
        },
        {
          id: 8,
          title: 'Quick Play Tempo',
          description: 'Increasing pace of play to unbalance opponents',
          duration: '15-20 mins',
          players: '8-12',
          difficulty: 'Intermediate'
        },
        {
          id: 9,
          title: 'Creating Overloads',
          description: 'Numerical advantages in different areas of the pitch',
          duration: '20-25 mins',
          players: '10-16',
          difficulty: 'Advanced'
        },
        {
          id: 10,
          title: 'Switch of Play',
          description: 'Changing the point of attack quickly',
          duration: '15-20 mins',
          players: '10-14',
          difficulty: 'Intermediate'
        },
        {
          id: 11,
          title: 'Through Ball Execution',
          description: 'Timing and technique for penetrating passes',
          duration: '15-20 mins',
          players: '6-10',
          difficulty: 'Intermediate'
        },
        {
          id: 12,
          title: 'Creative Play',
          description: 'Encouraging flair and individual creativity',
          duration: '20-25 mins',
          players: '8-12',
          difficulty: 'Advanced'
        },
        // Additional practice themes; provenance is not verified.
        {
          id: 47,
          title: 'Dribbling - Effective Techniques',
          description: 'Develop technical ability to dribble past opponents with effective techniques',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 48,
          title: 'Dribbling - Attacking Principles',
          description: 'Use dribbling to create space and opportunities for attacking play',
          duration: '20-25 mins',
          players: '12-21',
          difficulty: 'Advanced'
        },
        {
          id: 49,
          title: 'Receiving - Pass and Move',
          description: 'Think about receiving the ball effectively and moving into space',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Beginner'
        },
        {
          id: 50,
          title: 'Festival Week Practice',
          description: 'Showcase passing and receiving skills in competitive scenarios',
          duration: '25-30 mins',
          players: '12-18',
          difficulty: 'Advanced'
        },
        {
          id: 51,
          title: 'Eliminate the Opposition',
          description: 'Combine with teammates to eliminate opposition players',
          duration: '20-25 mins',
          players: '10-16',
          difficulty: 'Advanced'
        },
        {
          id: 52,
          title: 'Creating and Exploiting Space',
          description: 'Create and exploit space to pass and receive effectively',
          duration: '20-25 mins',
          players: '12-18',
          difficulty: 'Intermediate'
        },
        {
          id: 53,
          title: 'Around the Clock',
          description: 'Receive the ball and play forward in different directions',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Intermediate'
        },
        {
          id: 54,
          title: 'The Lions Den',
          description: 'Pass and receive the ball under pressure from opponents',
          duration: '15-20 mins',
          players: '8-12',
          difficulty: 'Advanced'
        },
        {
          id: 55,
          title: 'Connecting with Teammates',
          description: 'Work on movement skills to pass and receive effectively',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Beginner'
        },
        {
          id: 56,
          title: 'Width for Deception',
          description: 'Use width to create crossing opportunities and score goals',
          duration: '20-25 mins',
          players: '12-18',
          difficulty: 'Intermediate'
        },
        {
          id: 57,
          title: 'Playing Out to Attack',
          description: 'Play out from the back and create goalscoring opportunities',
          duration: '25-30 mins',
          players: '14-20',
          difficulty: 'Advanced'
        },
        {
          id: 58,
          title: 'Scoring as a Team',
          description: 'Work together to create and finish chances in the final third',
          duration: '20-25 mins',
          players: '12-18',
          difficulty: 'Intermediate'
        },
        {
          id: 59,
          title: 'Playing with Two Strikers',
          description: 'Use two strikers to create varied attacking patterns',
          duration: '20-25 mins',
          players: '12-18',
          difficulty: 'Advanced'
        },
        {
          id: 60,
          title: 'Wing Play and Crossing',
          description: 'Develop wing play to deliver effective crosses',
          duration: '20-25 mins',
          players: '10-16',
          difficulty: 'Intermediate'
        },
        {
          id: 61,
          title: 'Overlapping Play',
          description: 'Use overlapping runs to create numerical advantages',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Intermediate'
        },
        {
          id: 62,
          title: 'Small-Sided Games',
          description: 'Develop decision making in realistic game situations',
          duration: '25-30 mins',
          players: '6-14',
          difficulty: 'All Levels'
        },
        {
          id: 63,
          title: 'One-Touch Passing',
          description: 'Improve passing speed and accuracy with one-touch play',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Advanced'
        },
        {
          id: 64,
          title: 'Triangle Passing',
          description: 'Master triangular passing patterns for possession play',
          duration: '15-20 mins',
          players: '6-12',
          difficulty: 'Intermediate'
        },
        {
          id: 65,
          title: 'Long Ball Play',
          description: 'Use long balls effectively to change the point of attack',
          duration: '15-20 mins',
          players: '10-16',
          difficulty: 'Intermediate'
        }
      ]
    },
    'out-of-possession': {
      title: 'Out of Possession',
      icon: <Shield className="w-5 h-5" />,
      color: 'from-red-500 to-red-600',
      practices: [
        {
          id: 13,
          title: 'Pressure & Cover',
          description: 'Coordinated pressing to win the ball back quickly',
          duration: '15-20 mins',
          players: '6-10',
          difficulty: 'Beginner'
        },
        {
          id: 14,
          title: 'Defensive Shape',
          description: 'Maintaining compact defensive structure',
          duration: '20-25 mins',
          players: '10-16',
          difficulty: 'Intermediate'
        },
        {
          id: 15,
          title: 'Counter-Pressing',
          description: 'Immediate pressure after losing possession',
          duration: '25-30 mins',
          players: '14-20',
          difficulty: 'Advanced'
        },
        {
          id: 16,
          title: 'Defensive Transitions',
          description: 'Quick transition from attack to defence',
          duration: '20-25 mins',
          players: '12-18',
          difficulty: 'Intermediate'
        },
        {
          id: 17,
          title: 'High Pressing',
          description: 'Aggressive pressing in the final third',
          duration: '20-25 mins',
          players: '8-14',
          difficulty: 'Advanced'
        },
        {
          id: 18,
          title: 'Mid-Block Defence',
          description: 'Defending in middle third with compact shape',
          duration: '25-30 mins',
          players: '12-18',
          difficulty: 'Intermediate'
        },
        {
          id: 19,
          title: 'Low Block Defence',
          description: 'Defending deep and staying compact',
          duration: '20-25 mins',
          players: '10-16',
          difficulty: 'Beginner'
        },
        {
          id: 20,
          title: 'Pressing Triggers',
          description: 'Recognising when and where to press',
          duration: '15-20 mins',
          players: '8-12',
          difficulty: 'Intermediate'
        },
        {
          id: 21,
          title: 'Defensive Duels',
          description: '1v1 defending techniques and positioning',
          duration: '15-20 mins',
          players: '6-10',
          difficulty: 'Beginner'
        },
        {
          id: 22,
          title: 'Zonal Marking',
          description: 'Defending areas rather than marking man-to-man',
          duration: '20-25 mins',
          players: '10-16',
          difficulty: 'Intermediate'
        },
        {
          id: 23,
          title: 'Regaining Possession',
          description: 'Winning the ball back in different areas',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Intermediate'
        },
        {
          id: 24,
          title: 'Defensive Communication',
          description: 'Organising and talking as a defensive unit',
          duration: '15-20 mins',
          players: '10-16',
          difficulty: 'Beginner'
        },
        // Pressing and defensive themes
        {
          id: 66,
          title: 'Practising the Press',
          description: 'Press and cover to improve ability to challenge for the ball',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Beginner'
        },
        {
          id: 67,
          title: 'Speed of the Press',
          description: 'Improve pressing skills with quick reactions and movement',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Intermediate'
        },
        {
          id: 68,
          title: 'Press to Dictate',
          description: 'Use pressing to dictate play and control the game',
          duration: '20-25 mins',
          players: '10-16',
          difficulty: 'Advanced'
        },
        {
          id: 69,
          title: 'Locked In',
          description: 'Recognise when to apply pressure and when to delay opponents',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Intermediate'
        },
        {
          id: 70,
          title: 'Swift Support',
          description: 'Work on pressing and covering with quick support play',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Intermediate'
        },
        {
          id: 71,
          title: 'Marking Rivals',
          description: 'Introduce players to marking techniques and positioning',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Beginner'
        },
        {
          id: 72,
          title: 'Defend as Friends',
          description: 'Work on marking and intercepting skills as a unit',
          duration: '15-20 mins',
          players: '10-16',
          difficulty: 'Intermediate'
        },
        {
          id: 73,
          title: 'Interception Perfection',
          description: 'Use carousel structure to work on marking and intercepting',
          duration: '20-25 mins',
          players: '12-18',
          difficulty: 'Intermediate'
        },
        {
          id: 74,
          title: 'Table Football',
          description: 'Develop intercepting skills in confined spaces',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Beginner'
        },
        {
          id: 75,
          title: 'Intercept as a Team',
          description: 'Enhance marking and intercepting skills as a team unit',
          duration: '20-25 mins',
          players: '12-18',
          difficulty: 'Advanced'
        },
        {
          id: 76,
          title: 'Festival Week Defence',
          description: 'Showcase marking and intercepting skills in competitive scenarios',
          duration: '25-30 mins',
          players: '14-20',
          difficulty: 'Advanced'
        },
        {
          id: 77,
          title: 'Compact Defending',
          description: 'Maintain compactness when defending as a unit',
          duration: '20-25 mins',
          players: '12-18',
          difficulty: 'Intermediate'
        },
        {
          id: 78,
          title: 'Recovery Runs',
          description: 'Make effective recovery runs when caught out of position',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 79,
          title: 'Defensive Blocks',
          description: 'Organise effective defensive blocks to stop shots',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Beginner'
        },
        {
          id: 80,
          title: 'Man Marking',
          description: 'Track and mark specific opponents effectively',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        }
      ]
    },
    'set-pieces': {
      title: 'Set Pieces',
      icon: <Play className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      practices: [
        {
          id: 25,
          title: 'Corner Kicks - Attacking',
          description: 'Attacking corner kick routines and movement',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Beginner'
        },
        {
          id: 26,
          title: 'Corner Kicks - Defending',
          description: 'Defending corner situations effectively',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Beginner'
        },
        {
          id: 27,
          title: 'Free Kicks - Direct',
          description: 'Direct free kick techniques and routines',
          duration: '15-20 mins',
          players: '6-12',
          difficulty: 'Intermediate'
        },
        {
          id: 28,
          title: 'Free Kicks - Indirect',
          description: 'Indirect free kick set plays',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Intermediate'
        },
        {
          id: 29,
          title: 'Throw-ins - Long',
          description: 'Long throw-in strategies and delivery',
          duration: '10-15 mins',
          players: '6-12',
          difficulty: 'Beginner'
        },
        {
          id: 30,
          title: 'Throw-ins - Short',
          description: 'Quick throw-in combinations',
          duration: '10-15 mins',
          players: '4-8',
          difficulty: 'Beginner'
        },
        {
          id: 31,
          title: 'Penalty Taking',
          description: 'Penalty technique and mental preparation',
          duration: '10-15 mins',
          players: '2-6',
          difficulty: 'Intermediate'
        },
        {
          id: 32,
          title: 'Defensive Wall',
          description: 'Organising and positioning defensive walls',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Beginner'
        },
        {
          id: 33,
          title: 'Quick Set Pieces',
          description: 'Taking set pieces quickly to catch opponents off guard',
          duration: '15-20 mins',
          players: '6-12',
          difficulty: 'Intermediate'
        },
        {
          id: 34,
          title: 'Set Piece Variations',
          description: 'Multiple options from the same set piece situation',
          duration: '20-25 mins',
          players: '10-16',
          difficulty: 'Advanced'
        },
        // Set-piece themes
        {
          id: 81,
          title: 'Short Corner Routines',
          description: 'Develop short corner kick strategies and execution',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Intermediate'
        },
        {
          id: 82,
          title: 'Near Post Corners',
          description: 'Attack the near post area from corner situations',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Beginner'
        },
        {
          id: 83,
          title: 'Far Post Delivery',
          description: 'Perfect far post crosses from wide areas',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 84,
          title: 'Free Kick Shooting',
          description: 'Improve accuracy and power on direct free kicks',
          duration: '15-20 mins',
          players: '4-8',
          difficulty: 'Advanced'
        },
        {
          id: 85,
          title: 'Defensive Set Pieces',
          description: 'Organise defensive shape for all set piece situations',
          duration: '20-25 mins',
          players: '10-18',
          difficulty: 'Intermediate'
        },
        {
          id: 86,
          title: 'Goalkeeping - Set Pieces',
          description: 'Goalkeeper positioning and decision making on set pieces',
          duration: '15-20 mins',
          players: '6-12',
          difficulty: 'Intermediate'
        },
        {
          id: 87,
          title: 'Attacking Headers',
          description: 'Practice heading technique for attacking set pieces',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 88,
          title: 'Defending Headers',
          description: 'Defensive heading technique and positioning',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Beginner'
        },
        {
          id: 89,
          title: 'Counter Attack from Set Pieces',
          description: 'Quick transitions to attack after defending set pieces',
          duration: '20-25 mins',
          players: '12-18',
          difficulty: 'Advanced'
        },
        {
          id: 90,
          title: 'Set Piece Communication',
          description: 'Organise and communicate effectively during set pieces',
          duration: '15-20 mins',
          players: '10-16',
          difficulty: 'Beginner'
        }
      ]
    },
    'physical': {
      title: 'Physical',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600',
      practices: [
        {
          id: 35,
          title: 'Speed & Agility',
          description: 'Developing pace and quick feet',
          duration: '15-20 mins',
          players: '6-12',
          difficulty: 'All Levels'
        },
        {
          id: 36,
          title: 'Strength & Power',
          description: 'Building functional football strength',
          duration: '20-25 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 37,
          title: 'Endurance Training',
          description: 'Match-specific fitness conditioning',
          duration: '25-35 mins',
          players: '10-20',
          difficulty: 'Advanced'
        },
        {
          id: 38,
          title: 'Plyometric Training',
          description: 'Explosive power development',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 39,
          title: 'Balance & Coordination',
          description: 'Improving stability and body control',
          duration: '15-20 mins',
          players: '6-14',
          difficulty: 'Beginner'
        },
        {
          id: 40,
          title: 'Sprint Training',
          description: 'Acceleration and maximum speed development',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 41,
          title: 'Core Stability',
          description: 'Strengthening core muscles for football',
          duration: '15-20 mins',
          players: '10-20',
          difficulty: 'Beginner'
        },
        {
          id: 42,
          title: 'Injury Prevention',
          description: 'Exercises to reduce injury risk',
          duration: '15-20 mins',
          players: '10-20',
          difficulty: 'Beginner'
        },
        {
          id: 43,
          title: 'Flexibility & Mobility',
          description: 'Dynamic stretching and mobility work',
          duration: '10-15 mins',
          players: '10-20',
          difficulty: 'Beginner'
        },
        {
          id: 44,
          title: 'Reaction Training',
          description: 'Improving reaction time and decision making',
          duration: '15-20 mins',
          players: '6-12',
          difficulty: 'Intermediate'
        },
        {
          id: 45,
          title: 'Football-Specific Fitness',
          description: 'Conditioning with ball work',
          duration: '20-30 mins',
          players: '12-20',
          difficulty: 'Intermediate'
        },
        {
          id: 46,
          title: 'Recovery & Regeneration',
          description: 'Active recovery techniques',
          duration: '15-25 mins',
          players: '10-20',
          difficulty: 'Beginner'
        },
        // Physical and finishing themes
        {
          id: 91,
          title: 'Goalkeeping - Shot Stopping',
          description: 'Improve shot stopping technique and positioning',
          duration: '15-20 mins',
          players: '2-6',
          difficulty: 'Intermediate'
        },
        {
          id: 92,
          title: 'Goalkeeping - Distribution',
          description: 'Develop accurate distribution from goalkeepers',
          duration: '15-20 mins',
          players: '4-8',
          difficulty: 'Intermediate'
        },
        {
          id: 93,
          title: 'Goalkeeping - Crosses',
          description: 'Deal with crosses and high balls effectively',
          duration: '15-20 mins',
          players: '6-12',
          difficulty: 'Advanced'
        },
        {
          id: 94,
          title: 'Goalkeeping - 1v1 Situations',
          description: 'Handle one-on-one situations with composure',
          duration: '15-20 mins',
          players: '4-8',
          difficulty: 'Advanced'
        },
        {
          id: 95,
          title: 'Finishing in the Box',
          description: 'Improve finishing technique in penalty area',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 96,
          title: 'Volley Technique',
          description: 'Master volleys and half-volleys for shooting',
          duration: '15-20 mins',
          players: '6-12',
          difficulty: 'Advanced'
        },
        {
          id: 97,
          title: 'First Touch and Finish',
          description: 'Control and finish in one fluid movement',
          duration: '15-20 mins',
          players: '8-14',
          difficulty: 'Intermediate'
        },
        {
          id: 98,
          title: 'Quick Feet Finishing',
          description: 'Use quick feet to create shooting opportunities',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Advanced'
        },
        {
          id: 99,
          title: 'Shooting Under Pressure',
          description: 'Finish effectively when under pressure from defenders',
          duration: '15-20 mins',
          players: '10-16',
          difficulty: 'Advanced'
        },
        {
          id: 100,
          title: 'Turning and Dribbling to Score',
          description: 'Turn with the ball and create shooting opportunities',
          duration: '20-25 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 101,
          title: 'Receiving and Finishing to Score',
          description: 'Combine receiving skills with clinical finishing',
          duration: '20-25 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 102,
          title: 'Session Programme - Festival Week',
          description: 'Showcase all skills in competitive game situations',
          duration: '30-40 mins',
          players: '16-22',
          difficulty: 'All Levels'
        }
      ]
    },
    // Additional practice category for finishing and goalkeeping
    'finishing-goalkeeping': {
      title: 'Finishing & GK',
      icon: <Target className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      practices: [
        {
          id: 103,
          title: 'Clinical Finishing',
          description: 'Develop composure and accuracy in front of goal',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 104,
          title: 'Power vs Placement',
          description: 'Learn when to use power or placement when shooting',
          duration: '15-20 mins',
          players: '6-12',
          difficulty: 'Advanced'
        },
        {
          id: 105,
          title: 'Weak Foot Finishing',
          description: 'Improve shooting accuracy with both feet',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 106,
          title: 'Tap-ins and Rebounds',
          description: 'Position for tap-ins and react to rebounds',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Beginner'
        },
        {
          id: 107,
          title: 'Chip and Lob Finishes',
          description: 'Master delicate finishes over the goalkeeper',
          duration: '15-20 mins',
          players: '6-12',
          difficulty: 'Advanced'
        },
        {
          id: 108,
          title: 'Goalkeeper Communication',
          description: 'Organise the defence through effective communication',
          duration: '15-20 mins',
          players: '8-16',
          difficulty: 'Intermediate'
        },
        {
          id: 109,
          title: 'Goalkeeper Footwork',
          description: 'Improve agility and positioning with footwork drills',
          duration: '15-20 mins',
          players: '2-6',
          difficulty: 'Beginner'
        },
        {
          id: 110,
          title: 'Penalty Saves',
          description: 'Techniques for saving penalty kicks',
          duration: '10-15 mins',
          players: '2-6',
          difficulty: 'Advanced'
        }
      ]
    }
  };

  const filteredPractices = practiceCategories[selectedCategory].practices.filter(practice =>
    practice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    practice.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-secondary text-secondary-foreground';
      case 'Intermediate': return 'bg-warning/20 text-foreground';
      case 'Advanced': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-foreground">Practice library</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              aria-label="Search practices"
              type="text"
              placeholder="Search practices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 h-12"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card border border-border p-1">
            {Object.entries(practiceCategories).map(([key, category]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                aria-label={category.title}
                title={category.title}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
              >
                {category.icon}
                <span className="hidden sm:inline">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(practiceCategories).map(([key, category]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">{category.title}</h2>
                <p className="text-muted-foreground">Practice themes</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPractices.map((practice) => (
                  <Card key={practice.id} className="hover:border-primary/40 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-secondary text-primary rounded-md flex items-center justify-center mb-3">
                          {category.icon}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(practice.difficulty)}`}>
                          {practice.difficulty}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{practice.title}</CardTitle>
                      <CardDescription>{practice.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{practice.players} players</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span>{practice.duration}</span>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => setSelected({ ...practice, category: category.title })}>
                        View theme
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.category}</DialogDescription>
              </DialogHeader>
              <p className="text-sm">{selected.description}</p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div><strong>Players</strong><br />{selected.players}</div>
                <div><strong>Duration</strong><br />{selected.duration}</div>
                <div><strong>Level</strong><br />{selected.difficulty}</div>
              </div>
              <Button asChild><Link to={`/plan?goal=${encodeURIComponent(`${selected.title}: ${selected.description}`)}`}>Plan a session around this</Link></Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PracticeLibrary;
