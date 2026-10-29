import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, PlayCircle, FileText, Award, Zap, Shield } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/b4a0b5e5-23bc-4b9f-ae3c-403ab58e1cc3.png" 
                alt="CoachAssist Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  CoachAssist Pro
                </h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wide">
                  INTELLIGENT COACHING PLATFORM
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/account')} className="max-w-[45%] truncate">
              {user ? 'My Account' : 'Sign In / Sign Up'}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative overflow-hidden py-20 md:py-32"
        style={{
          backgroundImage: `var(--gradient-hero), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=70')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-md animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-scale">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-white drop-shadow-lg">Elevate Your</span>
              <span className="block text-white drop-shadow-lg">
                Coaching Game
              </span>
            </h2>
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto mb-12 border border-white/20">
              <p className="text-xl md:text-2xl text-white leading-relaxed font-medium">
                An intelligent coaching platform designed to help coaches create professional training sessions with smart planning tools and comprehensive practice libraries.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/plan')}
                size="lg"
                className="btn-hero px-12 py-4 text-xl rounded-2xl"
              >
                Start Planning Session
                <PlayCircle className="ml-3 w-6 h-6" />
              </Button>
              <Button 
                onClick={() => navigate('/library')}
                variant="outline"
                size="lg"
                className="px-12 py-4 text-xl rounded-2xl bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Explore Practices
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative">
        <div className="absolute inset-0 bg-gradient-surface opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Quick Actions */}
          <div 
            className="text-center mb-16 relative py-16 rounded-3xl overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=70')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h3 className="text-4xl font-bold text-foreground mb-4">Choose Your Path</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional training sessions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <Card 
              className="card-premium group cursor-pointer animate-fade-in-scale" 
              onClick={() => navigate('/plan')}
              style={{animationDelay: '0.1s'}}
            >
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-premium group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground mb-3">New Session</CardTitle>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  Set up your team and get a full session plan in seconds
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-premium opacity-60 cursor-not-allowed animate-fade-in-scale" style={{animationDelay: '0.2s'}}>
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground mb-3">
                  Saved Templates
                  <span className="ml-2 px-2 py-1 text-xs font-semibold bg-warning/20 text-warning rounded-full">PREMIUM</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  Access and customize your favourite session templates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="card-premium group cursor-pointer animate-fade-in-scale" 
              onClick={() => navigate('/library')}
              style={{animationDelay: '0.3s'}}
            >
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-premium group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground mb-3">Practice Library</CardTitle>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  Browse practices organised by the principles of play
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-premium opacity-60 cursor-not-allowed animate-fade-in-scale" style={{animationDelay: '0.4s'}}>
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FileText className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground mb-3">
                  Analytics Dashboard
                  <span className="ml-2 px-2 py-1 text-xs font-semibold bg-warning/20 text-warning rounded-full">ELITE</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  Track player progress and session effectiveness
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Features Section */}
          <div 
            className="glass rounded-3xl shadow-premium p-12 border border-border/20 animate-fade-in-scale relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=70')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Why Coaches Choose 
                <span className="block bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  CoachAssist
                </span>
              </h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Professional coaching tools designed to elevate your training sessions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-premium">
                  <Award className="w-12 h-12 text-primary-foreground" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-foreground">Professional Tools</h4>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Comprehensive coaching tools built with industry best practices to help you plan effective training sessions
                </p>
              </div>
              
              <div className="text-center group animate-slide-in-right" style={{animationDelay: '0.4s'}}>
                <div className="w-24 h-24 bg-gradient-to-br from-primary-light to-primary rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-premium">
                  <Zap className="w-12 h-12 text-primary-foreground" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-foreground">AI-Powered Intelligence</h4>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Sessions are built around your team's age, ability, numbers and goals, with progressions and regressions
                </p>
              </div>
              
              <div className="text-center group animate-slide-in-right" style={{animationDelay: '0.6s'}}>
                <div className="w-24 h-24 bg-gradient-to-br from-success to-primary-light rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-premium">
                  <Shield className="w-12 h-12 text-primary-foreground" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-foreground">Adaptive Content</h4>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Intelligently scales from grassroots to elite academy level with age-appropriate progressions and safety considerations
                </p>
              </div>
            </div>
            
            {/* CTA Section */}
            <div 
              className="text-center mt-16 p-8 rounded-2xl border border-primary/20 relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.93), rgba(255, 255, 255, 0.93)), url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=70')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <h4 className="text-2xl font-bold text-foreground mb-4">Ready to Transform Your Coaching?</h4>
              <p className="text-muted-foreground mb-6 text-lg">Create a free account to save your teams and sessions</p>
              <Button 
                onClick={() => navigate('/account')}
                className="btn-premium px-8 py-3 text-lg rounded-xl"
              >
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;