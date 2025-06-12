
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Save, Clock, Settings, Plus, Eye, EyeOff } from 'lucide-react';

const AccountPage = ({ onBack }) => {
  const [user, setUser] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    qualifications: 'UEFA B License',
    club: 'Greenfield FC'
  });

  const [savedSessions] = useState([
    {
      id: 1,
      title: 'U12 Technical Skills',
      date: '2024-01-15',
      duration: 60,
      teamName: 'Greenfield U12s',
      objectives: ['Ball control', 'Passing accuracy']
    },
    {
      id: 2,
      title: 'U16 Tactical Awareness',
      date: '2024-01-12',
      duration: 90,
      teamName: 'Greenfield U16s',
      objectives: ['Defensive shape', 'Counter-attacking']
    },
    {
      id: 3,
      title: 'Senior Fitness Focus',
      date: '2024-01-10',
      duration: 75,
      teamName: 'Greenfield Seniors',
      objectives: ['Endurance', 'Sprint training']
    }
  ]);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    qualifications: ''
  });

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(signUpData.password);
  const passwordsMatch = signUpData.password === signUpData.confirmPassword;

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (passwordValidation.isValid && passwordsMatch) {
      console.log('Account created successfully');
      setIsSignUpModalOpen(false);
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
            <h1 className="text-xl font-bold text-gray-900">My Account</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CoachAssist</h2>
            <p className="text-gray-600 mb-6">Create an account to save your sessions and access your coaching library</p>
            
            <div className="flex gap-4 justify-center">
              <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="px-8">Login</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Login to Your Account</DialogTitle>
                    <DialogDescription>
                      Enter your credentials to access your saved sessions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input id="login-email" type="email" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</Label>
                      <Input id="login-password" type="password" className="mt-1" />
                    </div>
                    <Button className="w-full bg-green-500 hover:bg-green-600">Login</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isSignUpModalOpen} onOpenChange={setIsSignUpModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600 px-8">Sign Up</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Your Account</DialogTitle>
                    <DialogDescription>
                      Join thousands of coaches using CoachAssist
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSignUpSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input 
                        id="signup-name"
                        type="text" 
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input 
                        id="signup-email"
                        type="email" 
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
                      <div className="relative mt-1">
                        <Input 
                          id="signup-password"
                          type={showPassword ? "text" : "password"} 
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                          className="pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      {signUpData.password && (
                        <div className="mt-2 space-y-1 text-xs">
                          <div className={`flex items-center ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="mr-2">{passwordValidation.minLength ? '✓' : '✗'}</span>
                            At least 8 characters
                          </div>
                          <div className={`flex items-center ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="mr-2">{passwordValidation.hasUpperCase ? '✓' : '✗'}</span>
                            One uppercase letter
                          </div>
                          <div className={`flex items-center ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="mr-2">{passwordValidation.hasLowerCase ? '✓' : '✗'}</span>
                            One lowercase letter
                          </div>
                          <div className={`flex items-center ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="mr-2">{passwordValidation.hasNumbers ? '✓' : '✗'}</span>
                            One number
                          </div>
                          <div className={`flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="mr-2">{passwordValidation.hasSpecialChar ? '✓' : '✗'}</span>
                            One special character
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                      <div className="relative mt-1">
                        <Input 
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"} 
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                          className="pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      {signUpData.confirmPassword && (
                        <div className="mt-1 text-xs">
                          <div className={`flex items-center ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="mr-2">{passwordsMatch ? '✓' : '✗'}</span>
                            Passwords match
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="signup-qualifications" className="text-sm font-medium text-gray-700">Coaching Qualifications (Optional)</Label>
                      <Input 
                        id="signup-qualifications"
                        type="text" 
                        placeholder="e.g. UEFA B License"
                        value={signUpData.qualifications}
                        onChange={(e) => setSignUpData({...signUpData, qualifications: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600"
                      disabled={!passwordValidation.isValid || !passwordsMatch}
                    >
                      Create Account
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Preview of what they'll get with an account */}
        <Tabs defaultValue="saved-sessions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border border-gray-200 rounded-xl p-1">
            <TabsTrigger value="saved-sessions" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Save className="w-4 h-4 mr-2" />
              Saved Sessions
            </TabsTrigger>
            <TabsTrigger value="recent-sessions" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              Recent Sessions
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved-sessions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Saved Sessions</h3>
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
            
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <Save className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No saved sessions yet</p>
              <p className="text-sm text-gray-500">Create an account to save your session plans and templates</p>
            </div>
          </TabsContent>

          <TabsContent value="recent-sessions" className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Training Sessions</h3>
            
            <div className="space-y-4">
              {savedSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <CardDescription>{session.teamName} • {session.duration} minutes</CardDescription>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {session.objectives.map((objective, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {objective}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Session</Button>
                      <Button size="sm" variant="outline">Duplicate</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coach Profile</CardTitle>
                <CardDescription>Manage your coaching information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profile-name" className="text-sm font-medium text-gray-700">Full Name</Label>
                    <Input 
                      id="profile-name"
                      type="text" 
                      value={user.name}
                      className="mt-1"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input 
                      id="profile-email"
                      type="email" 
                      value={user.email}
                      className="mt-1"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile-qualifications" className="text-sm font-medium text-gray-700">Qualifications</Label>
                    <Input 
                      id="profile-qualifications"
                      type="text" 
                      value={user.qualifications}
                      className="mt-1"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile-club" className="text-sm font-medium text-gray-700">Club/Organization</Label>
                    <Input 
                      id="profile-club"
                      type="text" 
                      value={user.club}
                      className="mt-1"
                      disabled
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-4">Create an account to edit your profile and preferences</p>
                  <Button disabled className="bg-gray-300">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AccountPage;
