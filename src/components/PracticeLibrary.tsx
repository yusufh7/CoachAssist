
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Play, Users, Target, Shield, Zap } from 'lucide-react';

const PracticeLibrary = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('in-possession');

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
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      case 'All Levels': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={onBack} className="hover:bg-green-50 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Practice Library</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search practices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border border-gray-200 rounded-xl p-1">
            {Object.entries(practiceCategories).map(([key, category]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white flex items-center gap-2"
              >
                {category.icon}
                <span className="hidden sm:inline">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(practiceCategories).map(([key, category]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.title} Practices</h2>
                <p className="text-gray-600">FA principles-based training practices ({category.practices.length} available)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPractices.map((practice) => (
                  <Card key={practice.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-green-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mb-3`}>
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
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{practice.players} players</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span>{practice.duration}</span>
                        </div>
                      </div>
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        View Practice
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default PracticeLibrary;
