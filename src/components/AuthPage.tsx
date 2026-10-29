import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User as UserIcon, LogOut, Users, Calendar } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
}

interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState<SignUpData>({
    email: '',
    password: '',
    displayName: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [userSessions, setUserSessions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
            fetchUserTeams(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
          setUserTeams([]);
          setUserSessions([]);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
          fetchUserTeams(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserTeams = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teams:', error);
        return;
      }

      setUserTeams(data || []);
      const res = await supabase.from('training_sessions').select('id,title,created_at,is_public')
        .eq('user_id', userId).order('created_at', { ascending: false }).limit(50);
      if (!res.error) setUserSessions(res.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const validatePassword = (password: string) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const isValid = Object.values(criteria).every(Boolean);
    return { isValid, criteria };
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid } = validatePassword(signupData.password);
    if (!isValid) {
      toast({
        title: "Invalid Password",
        description: "Password must meet all requirements",
        variant: "destructive"
      });
      return;
    }

    try {
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: signupData.displayName
          }
        }
      });

      if (error) {
        
        // Handle specific Supabase error types
        let errorMessage = error.message;
        if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
          errorMessage = "Connection failed. Please check your internet connection and try again.";
        } else if (error.message.includes('User already registered')) {
          errorMessage = "An account with this email already exists. Please try signing in instead.";
        } else if (error.message.includes('Invalid email')) {
          errorMessage = "Please enter a valid email address.";
        } else if (error.message.includes('Password should be')) {
          errorMessage = "Password does not meet requirements.";
        } else if (error.status === 422) {
          errorMessage = "Invalid email or password format.";
        } else if (error.status === 500) {
          errorMessage = "Server error. Please try again in a moment.";
        }
        
        toast({
          title: "Signup Error",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Account Created!",
        description: "Please check your email to confirm your account."
      });
      
      setIsSignupOpen(false);
      setSignupData({ email: '', password: '', displayName: '' });
    } catch (error) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "Network Error",
        description: "Failed to connect to the server. Please check your internet connection and try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });

      if (error) {
        toast({
          title: "Login Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in."
      });
      
      setIsLoginOpen(false);
      setLoginData({ email: '', password: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Welcome to CoachAssist AI</h1>
              <p className="text-muted-foreground mt-2">
                Sign up or log in to start creating training sessions
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Create an account or sign in to save your teams and sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      Create Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Your Account</DialogTitle>
                      <DialogDescription>
                        Join CoachAssist AI to save your teams and training sessions
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSignUpSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          type="text"
                          placeholder="Your name"
                          value={signupData.displayName}
                          onChange={(e) => setSignupData(prev => ({ ...prev, displayName: e.target.value }))}
                          required
                          maxLength={50}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="coach@example.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="relative">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-8 h-7 w-7 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                        {signupData.password && (
                          <div className="mt-2 text-sm space-y-1">
                            {Object.entries(validatePassword(signupData.password).criteria).map(([key, valid]) => (
                              <div key={key} className={`flex items-center gap-2 ${valid ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{valid ? '✓' : '✗'}</span>
                                <span>
                                  {key === 'length' && '8+ characters'}
                                  {key === 'uppercase' && 'Uppercase letter'}
                                  {key === 'lowercase' && 'Lowercase letter'}
                                  {key === 'number' && 'Number'}
                                  {key === 'special' && 'Special character'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button type="submit" className="w-full">
                        Create Account
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" size="lg">
                      Sign In
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Welcome Back</DialogTitle>
                      <DialogDescription>
                        Sign in to your CoachAssist AI account
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="loginEmail">Email</Label>
                        <Input
                          id="loginEmail"
                          type="email"
                          placeholder="coach@example.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="loginPassword">Password</Label>
                        <Input
                          id="loginPassword"
                          type="password"
                          placeholder="Your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Sign In
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground">
              Manage your profile, teams, and training sessions
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teams ({userTeams.length})
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Sessions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Display Name</Label>
                      <p className="text-sm text-muted-foreground">
                        {userProfile?.display_name || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <Label>Member Since</Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label>Teams Created</Label>
                      <p className="text-sm text-muted-foreground">
                        {userTeams.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams">
              <div className="space-y-4">
                {userTeams.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Teams Yet</h3>
                      <p className="text-muted-foreground text-center">
                        Create your first team to start planning training sessions
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  userTeams.map((team) => (
                    <Card key={team.id}>
                      <CardHeader>
                        <CardTitle>{team.name}</CardTitle>
                        <CardDescription>
                          {team.age_group} • {team.skill_level} • {team.player_count} players
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label>Session Duration</Label>
                            <p className="text-muted-foreground">{team.session_duration} minutes</p>
                          </div>
                          <div>
                            <Label>Playing Style</Label>
                            <p className="text-muted-foreground">{team.playing_style || 'Not specified'}</p>
                          </div>
                          <div className="col-span-2">
                            <Label>Current Focus</Label>
                            <p className="text-muted-foreground">{team.current_focus || 'Not specified'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="sessions">
              <div className="flex flex-wrap gap-2 mb-4"><Button asChild><Link to="/sessions">Manage my sessions</Link></Button><Button asChild variant="outline"><Link to="/block">Plan a training block</Link></Button></div>
              {userSessions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
                    <Button asChild className="mt-2"><Link to="/plan">Plan a session</Link></Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {userSessions.map((s) => (
                    <Link key={s.id} to={`/session/${s.id}`} className="block">
                      <Card className="hover:border-primary transition-colors">
                        <CardHeader className="py-4">
                          <CardTitle className="text-base">{s.title}</CardTitle>
                          <CardDescription>
                            {new Date(s.created_at).toLocaleDateString()} {s.is_public ? '• Shared' : ''}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;