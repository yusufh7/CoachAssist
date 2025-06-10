
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeamSetup from '@/components/TeamSetup';
import SessionPlanner from '@/components/SessionPlanner';
import PracticeLibrary from '@/components/PracticeLibrary';
import AccountPage from '@/components/AccountPage';
import { Users, Target, PlayCircle, FileText, Award, Zap, Shield } from 'lucide-react';

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

  if (currentView === 'practice-library') {
    return <PracticeLibrary onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'account') {
    return <AccountPage onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CoachAssist</h1>
            </div>
            <Button 
              onClick={() => setCurrentView('account')}
              variant="outline"
              className="hover:bg-green-50 border-green-200"
            >
              My Account
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Football Coaching Background */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat py-16 md:py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.8), rgba(34, 197, 94, 0.8)), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1993&q=80')`,
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
            className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Start Planning Session
          </Button>
        </div>
      </section>

      {/* Main Content with Background */}
      <main 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 hover:border-green-200 bg-gradient-to-br from-white to-green-50" onClick={() => setCurrentView('team-setup')}>
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-gray-800">New Session</CardTitle>
                <CardDescription className="text-gray-600">
                  Set up your team and create a training session
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 hover:border-blue-200 bg-gradient-to-br from-white to-blue-50 opacity-75">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-gray-800">Saved Templates</CardTitle>
                <CardDescription className="text-gray-600">
                  Access your favourite session templates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 hover:border-purple-200 bg-gradient-to-br from-white to-purple-50" 
              onClick={() => setCurrentView('practice-library')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-gray-800">Practice Library</CardTitle>
                <CardDescription className="text-gray-600">
                  Browse hundreds of coaching practices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 hover:border-orange-200 bg-gradient-to-br from-white to-orange-50 opacity-75">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg text-gray-800">Recent Sessions</CardTitle>
                <CardDescription className="text-gray-600">
                  View and edit previous session plans
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Features Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Why Choose CoachAssist?
              </h3>
              <p className="text-gray-600 text-lg">Built by UEFA-qualified coaches for coaches at every level</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-800">UEFA-Qualified Expertise</h4>
                <p className="text-gray-600 leading-relaxed">
                  Developed by UEFA-qualified coaches following proven coaching principles and FA guidelines
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-800">Visual Practice Diagrams</h4>
                <p className="text-gray-600 leading-relaxed">
                  Clear animations and diagrams for every practice and drill to enhance understanding
                </p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-800">Adaptive Content</h4>
                <p className="text-gray-600 leading-relaxed">
                  Intelligently tailored for every age group and skill level from grassroots to academy
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
