'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, Trophy, Users, Star } from 'lucide-react';
import Logo from './Logo';

interface AuthFormProps {
  onSuccess: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSetupInstructions, setShowSetupInstructions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Check if this is admin login
      const isAdminEmail = email.toLowerCase() === 'admin@quizmaster.com';
      
      if (isAdminEmail) {
        if (password === 'QuizMaster2024!') {
        // Admin login successful - set admin session and redirect directly to dashboard
        const adminToken = btoa(`admin:${Date.now()}`);
        const expiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
        
        localStorage.setItem('adminToken', adminToken);
        localStorage.setItem('adminTokenExpiry', expiry.toString());
        localStorage.setItem('adminUsername', 'admin');
        
        toast.success('🔐 Admin access granted!');
        window.location.href = '/admin/dashboard';
        return;
        } else {
          toast.error('❌ Invalid admin password');
          setLoading(false);
          return;
        }
      }
      
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('🎉 Welcome back, Quiz Master!');
      } else {
        // Prevent admin email registration
        if (isAdminEmail) {
          toast.error('❌ Admin email cannot be used for registration');
          setLoading(false);
          return;
        }
        
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('🚀 Account created! Ready to test your knowledge?');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Auth error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      if (error.code === 'auth/api-key-not-valid' || 
          error.code === 'auth/invalid-api-key' || 
          error.message.includes('api-key-not-valid') ||
          error.message.includes('invalid-api-key')) {
        toast.error('Firebase not configured properly!');
        setShowSetupInstructions(true);
      } else if (error.code === 'auth/invalid-credential') {
        if (isLogin) {
          toast.error('❌ Invalid email or password. Please check your credentials or create an account if you\'re new.');
        } else {
          toast.error('❌ Unable to create account. Please check your email format and ensure your password is at least 6 characters.');
        }
      } else if (error.code === 'auth/user-not-found') {
        toast.error('❌ No account found with this email. Please create an account first.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('❌ Incorrect password. Please try again.');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('❌ Email already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('❌ Password is too weak. Please use at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('❌ Invalid email address format.');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('❌ Too many failed attempts. Please try again later.');
      } else {
        toast.error(`❌ Authentication failed: ${error.code || 'Unknown error'}`);
        setShowSetupInstructions(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Trophy className="w-8 h-8 text-yellow-400 opacity-30" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delayed">
          <Star className="w-6 h-6 text-pink-400 opacity-30" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float">
          <Sparkles className="w-7 h-7 text-blue-400 opacity-30" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Logo size="lg" showText={true} variant="white" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              {isLogin ? 'Welcome Back, Champion!' : 'Join the Quiz Revolution!'}
            </h1>
            <p className="text-white/80 text-lg">
              {isLogin ? 'Ready to challenge your mind again?' : 'Become a QuizMaster and unlock your potential'}
            </p>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">10K+</div>
                <div className="text-xs text-white/70">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">5K+</div>
                <div className="text-xs text-white/70">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">98%</div>
                <div className="text-xs text-white/70">Success Rate</div>
              </div>
            </div>
            
            {/* Login Credentials Info */}
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xs text-white/70 space-y-1">
                <p><strong>User Login:</strong> Any email + password (6+ chars)</p>
                <p><strong>Admin Login:</strong> admin@quizmaster.com</p>
                <p><strong>Admin Password:</strong> QuizMaster2024!</p>
              </div>
            </div>
          </div>

          {showSetupInstructions && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-300 mb-2">Firebase Setup Required</h3>
                  <div className="text-xs text-red-200 space-y-1">
                    <p><strong>Step 1:</strong> Go to Firebase Console</p>
                    <p><strong>Step 2:</strong> Create new project or select existing</p>
                    <p><strong>Step 3:</strong> Enable Authentication Email/Password</p>
                    <p><strong>Step 4:</strong> Get config from Project Settings</p>
                    <p><strong>Step 5:</strong> Update lib/firebase.ts file</p>
                  </div>
                  <button 
                    onClick={() => setShowSetupInstructions(false)}
                    className="mt-2 text-xs text-red-300 underline hover:text-red-200"
                  >
                    Hide instructions
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 z-10 group-focus-within:text-purple-400 transition-colors" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 text-white placeholder-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 z-10 group-focus-within:text-purple-400 transition-colors" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 text-white placeholder-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white z-10 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              {!isLogin && (
                <p className="text-xs text-white/60 mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-yellow-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{isLogin ? 'Sign In & Start Quiz' : 'Create Account & Play'}</span>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setShowSetupInstructions(false);
              }}
              className="text-white/80 hover:text-white font-medium transition-colors relative group"
            >
              <span className="relative z-10">
                {isLogin ? "New here? Join the Quiz Community" : 'Already a QuizMaster? Sign in'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -m-2"></div>
            </button>
          </div>

          {!showSetupInstructions && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowSetupInstructions(true)}
                className="text-sm text-white/60 hover:text-white/80 underline transition-colors"
              >
                Need help with Firebase setup?
              </button>
            </div>
          )}

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xs text-white/80">Compete & Win</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xs text-white/80">Join Community</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}