
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeamSetup from '@/components/TeamSetup';
import SessionPlanner from '@/components/SessionPlanner';
import { Users, Target, PlayCircle, FileText } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [teamData, setTeamData] = useState(null);

  const handleTeamSetup = (data) => {
    setTeamData(data);
    setCurrentView('planning');
  };

  if (currentView === 'team-setup') {
    return <TeamSetup onComplete={handleTeamSetup} />;
  }

  if (currentView === 'planning' && teamData) {
    return <SessionPlanner teamData={teamData} onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CoachAssist</h1>
            </div>
            <div className="text-sm text-gray-600">
              AI-Powered Football Training Planner
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Football Background */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat py-16 md:py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.85), rgba(34, 197, 94, 0.85)), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMDAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPCEtLSBHcmFzcyBQYXR0ZXJuIC0tPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0iZ3Jhc3MiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CiAgICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMyMmM1NWUiLz4KICAgIDxwYXRoIGQ9Ik0wIDQwTDQwIDIwTDQwIDQwWiIgZmlsbD0iIzE2YTA0OSIvPgogICAgPHBhdGggZD0iTTAgMEw0MCAyMEwwIDIwWiIgZmlsbD0iIzE2YTA0OSIvPgogIDwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZ3Jhc3MpIi8+CjwhLS0gRm9vdGJhbGwgLS0+CjxjaXJjbGUgY3g9IjUwMCIgY3k9IjMwMCIgcj0iNjAiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxwYXRoIGQ9Ik00NDAgMzAwTDU2MCAzMDBNNTAwIDI0MFA1MDAgMzYwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNNDcwIDI3MEw1MzAgMjcwTTQ3MCAzMzBMNTMwIDMzME00NzAgMjUwTDUzMCAyNTBNNDcwIDM1MEw1MzAgMzUwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=')`,
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Plan Better Training Sessions
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Create professional training sessions aligned with FA guidelines. 
            From grassroots to academy level - your intelligent coaching assistant.
          </p>
          <Button 
            onClick={() => setCurrentView('team-setup')}
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
          >
            Start Planning Session
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('team-setup')}>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">New Session</CardTitle>
              <CardDescription>
                Set up your team and create a training session
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75">
            <CardHeader className="text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Saved Templates</CardTitle>
              <CardDescription>
                Access your favourite session templates
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75">
            <CardHeader className="text-center">
              <PlayCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Practice Library</CardTitle>
              <CardDescription>
                Browse hundreds of coaching practices
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75">
            <CardHeader className="text-center">
              <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Recent Sessions</CardTitle>
              <CardDescription>
                View and edit previous session plans
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose CoachAssist?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">FA Guidelines Aligned</h4>
              <p className="text-gray-600">
                Every session follows proven coaching principles and frameworks
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <PlayCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Visual Practice Diagrams</h4>
              <p className="text-gray-600">
                Clear animations and diagrams for every practice and drill
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Adaptive Content</h4>
              <p className="text-gray-600">
                Tailored for every age group and skill level from grassroots to academy
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
