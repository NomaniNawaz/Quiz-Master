'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Play, LogOut, Trophy, Settings, UserCircle, Zap, Target, Award, TrendingUp, Clock, Star, Users, Brain, Sparkles, BarChart3, Globe, Lightbulb, Medal, MessageSquare } from 'lucide-react';
import { Shield } from 'lucide-react';
import Logo from './Logo';
import ProfileScreen from './ProfileScreen';
import AdminPanel from './AdminPanel';
import { useState, useEffect } from 'react';
import DifficultySelector from './DifficultySelector';
import OfflineManager from './OfflineManager';
import FeedbackForm from './FeedbackForm';

interface HomeScreenProps {
  userEmail: string;
  onStartQuiz: () => void;
  onLogout: () => void;
}

export default function HomeScreen({ userEmail, onStartQuiz, onLogout }: HomeScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [motivationalQuote, setMotivationalQuote] = useState(0);
  const [showSmartQuestions, setShowSmartQuestions] = useState(false);
  const [showPrecisionScoring, setShowPrecisionScoring] = useState(false);
  const [showGlobalRanking, setShowGlobalRanking] = useState(false);
  const [showLightningFast, setShowLightningFast] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userStats, setUserStats] = useState({
    quizzesCompleted: 0,
    successRate: 0,
    bestStreak: 0,
    totalPoints: 0,
    rank: 'New Player',
    level: 1
  });

  const quotes = [
    "Knowledge is power. Test yours today! 🧠",
    "Every expert was once a beginner. Start your journey! 🚀",
    "Challenge yourself and discover your potential! ⭐",
    "The more you learn, the more you earn! 💎",
    "Success is the sum of small efforts repeated! 🏆"
  ];

  const globalRankings = [
    { rank: 1, name: "QuizMaster_Pro", score: 2847, country: "🇮🇳" },
    { rank: 2, name: "BrainStorm_99", score: 2756, country: "🇺🇸" },
    { rank: 3, name: "KnowledgeKing", score: 2689, country: "🇬🇧" },
    { rank: 4, name: "SmartCookie", score: 2634, country: "🇨🇦" },
    { rank: 5, name: "ThinkTank", score: 2598, country: "🇦🇺" },
  ];

  const smartQuestionCategories = [
    { name: "Science & Technology", difficulty: "Advanced", questions: 150, icon: "🔬" },
    { name: "History & Geography", difficulty: "Intermediate", questions: 200, icon: "🌍" },
    { name: "Sports & Entertainment", difficulty: "Easy", questions: 180, icon: "⚽" },
    { name: "Mathematics", difficulty: "Expert", questions: 120, icon: "🔢" },
    { name: "General Knowledge", difficulty: "Mixed", questions: 300, icon: "🧠" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const quoteTimer = setInterval(() => {
      setMotivationalQuote(prev => (prev + 1) % quotes.length);
    }, 4000);
    
    // Check if user is admin
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
    
    // Load user stats from localStorage
    const savedStats = localStorage.getItem('userStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    
    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Clear admin status
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminEmail');
      
      await signOut(auth);
      toast.success('👋 See you soon, Quiz Master!');
      onLogout();
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleSmartQuestions = () => {
    setShowSmartQuestions(true);
    toast.success('🧠 Smart Questions feature activated!');
  };

  const handlePrecisionScoring = () => {
    setShowPrecisionScoring(true);
    toast.success('🎯 Precision Scoring analytics opened!');
  };

  const handleGlobalRanking = () => {
    setShowGlobalRanking(true);
    toast.success('🌍 Global Rankings loaded!');
  };

  const handleLightningFast = () => {
    setShowLightningFast(true);
    toast.success('⚡ Lightning Fast mode activated!');
  };

  const handleProfile = () => {
    setShowProfile(true);
    toast.success('👤 Profile opened!');
  };

  const handleCommunity = () => {
    setShowCommunity(true);
    toast.success('👥 Community hub opened!');
  };

  const handleStartQuiz = () => {
    setShowDifficultySelector(true);
  };

  const handleDifficultySelected = (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    setSelectedDifficulty(difficulty);
    setShowDifficultySelector(false);
    onStartQuiz();
  };

  const handleFeedback = () => {
    setShowFeedbackForm(true);
    toast.success('📝 Feedback form opened!');
  };

  const handleAdminPanel = () => {
    setShowAdminPanel(true);
    toast.success('🔐 Admin panel opened!');
  };

  const getUserName = (email: string) => {
    if (!email) return 'Quiz Master';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._]/g, ' ');
  };

  const userName = getUserName(userEmail);
  const timeString = currentTime.toLocaleTimeString();
  const dateString = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // If profile is open, show ProfileScreen
  if (showProfile) {
    return (
      <ProfileScreen 
        userEmail={userEmail}
        onBack={() => setShowProfile(false)}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float-${i % 3}`}
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${i * 0.5}s`
            }}
          >
            {i % 3 === 0 && <Star className="w-4 h-4 text-yellow-400/30" />}
            {i % 3 === 1 && <Sparkles className="w-5 h-5 text-blue-400/30" />}
            {i % 3 === 2 && <Trophy className="w-4 h-4 text-pink-400/30" />}
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-8 border border-white/20">
          {/* Offline Manager */}
          <OfflineManager onQuestionsLoaded={() => {}} />
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Logo size="md" showText={false} variant="white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  Welcome back, {userName}! 👋
                </h1>
                <p className="text-white/70 text-sm">{userEmail}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Level {userStats.level}</span>
                  </div>
                  <div className="text-white/60 text-sm">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {timeString}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={handleProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-all backdrop-blur-sm border border-blue-400/30 group"
              >
                <Settings className="w-4 h-4 text-blue-300 group-hover:text-blue-200 transition-colors" />
                <span className="text-sm text-blue-300 group-hover:text-blue-200">Profile</span>
              </button>

              {/* Admin Panel Access for Admin Users */}
              {userEmail.toLowerCase() === 'admin@quizmaster.com' && (
                <button 
                  onClick={() => window.location.href = '/admin/dashboard'}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl transition-all backdrop-blur-sm border border-purple-400/30 group"
                >
                  <Shield className="w-4 h-4 text-purple-300 group-hover:text-purple-200 transition-colors" />
                  <span className="text-sm text-purple-300 group-hover:text-purple-200">Admin Panel</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all backdrop-blur-sm border border-red-400/30"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Motivational Quote Banner */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-yellow-400/30 text-center">
          <div className="text-2xl font-bold text-white mb-2 transition-all duration-500">
            {quotes[motivationalQuote]}
          </div>
          <div className="text-white/70">{dateString}</div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Quiz Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20 text-center relative overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full animate-spin"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-white rounded-full animate-ping"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full animate-pulse"></div>
              </div>

              <div className="relative z-10">
                <div className="mb-6">
                  <div className="relative inline-block">
                    <Logo size="xl" showText={false} variant="white" />
                    <div className="absolute -top-2 -right-2 animate-bounce">
                      <Zap className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Ready for the Ultimate Challenge?
                </h2>
                <p className="text-white/80 text-xl mb-8 leading-relaxed">
                  Test your knowledge across multiple topics and compete with thousands of quiz masters worldwide!
                </p>

                <button
                  onClick={onStartQuiz}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-purple-700 hover:via-pink-700 hover:to-yellow-600 transform hover:scale-110 transition-all duration-300 flex items-center space-x-4 mx-auto shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Play className="w-8 h-8 relative z-10" />
                  <span className="relative z-10">Start Epic Quiz</span>
                  <Sparkles className="w-6 h-6 relative z-10 animate-pulse" />
                </button>

                {/* Enhanced Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-3xl font-bold text-yellow-400">{userStats.quizzesCompleted}</div>
                    <div className="text-sm text-white/70">Quizzes Completed</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-3xl font-bold text-green-400">{userStats.successRate}%</div>
                    <div className="text-sm text-white/70">Success Rate</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-3xl font-bold text-blue-400">{userStats.bestStreak}</div>
                    <div className="text-sm text-white/70">Best Streak</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Stats */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
                Live Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Active Players</span>
                  <span className="text-green-400 font-bold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Quizzes Today</span>
                  <span className="text-blue-400 font-bold">3,892</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Your Rank</span>
                  <span className="text-yellow-400 font-bold">#{userStats.rank}</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-yellow-400" />
                Achievements
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <Trophy className="w-8 h-8 text-gray-400" />
                  <div>
                    <div className="text-white font-medium">First Quiz</div>
                    <div className="text-white/60 text-sm">Complete your first quiz</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 opacity-50">
                  <Star className="w-8 h-8 text-gray-400" />
                  <div>
                    <div className="text-white font-medium">Perfect Score</div>
                    <div className="text-white/60 text-sm">Get 100% in a quiz</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 opacity-50">
                  <Zap className="w-8 h-8 text-gray-400" />
                  <div>
                    <div className="text-white font-medium">Speed Demon</div>
                    <div className="text-white/60 text-sm">Complete quiz in under 2 min</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-400" />
                Community
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                <div className="text-white/70 mb-4">Quiz Masters Worldwide</div>
                <button 
                  onClick={handleCommunity}
                  className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-2 rounded-lg transition-all border border-blue-400/30"
                >
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          {[
            { 
              icon: Brain, 
              title: "Smart Questions", 
              desc: "AI-powered adaptive difficulty", 
              color: "purple",
              onClick: handleSmartQuestions
            },
            { 
              icon: Target, 
              title: "Precision Scoring", 
              desc: "Detailed performance analytics", 
              color: "blue",
              onClick: handlePrecisionScoring
            },
            { 
              icon: Trophy, 
              title: "Global Rankings", 
              desc: "Compete with players worldwide", 
              color: "yellow",
              onClick: handleGlobalRanking
            },
            { 
              icon: Zap, 
              title: "Lightning Fast", 
              desc: "Instant results and feedback", 
              color: "pink",
              onClick: handleLightningFast
            }
          ].map((feature, index) => (
            <div key={index} className="space-y-2">
            <button
              key={index}
              onClick={feature.onClick}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer transform hover:scale-105"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-${feature.color}-500/20 group-hover:bg-${feature.color}-500/30 transition-all`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
              </div>
              <h3 className="font-semibold text-white mb-2 text-center">{feature.title}</h3>
              <p className="text-white/70 text-sm text-center">{feature.desc}</p>
            </button>
            </div>
          ))}
          
          {/* Feedback Button */}
          <button
            onClick={handleFeedback}
            className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer transform hover:scale-105"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-orange-500/20 group-hover:bg-orange-500/30 transition-all">
              <MessageSquare className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="font-semibold text-white mb-2 text-center">Feedback</h3>
            <p className="text-white/70 text-sm text-center">Share your thoughts</p>
          </button>
        </div>
      </div>

      {/* Modal Components */}
      
      {/* Smart Questions Modal */}
      {showSmartQuestions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-white/20 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Brain className="w-8 h-8 mr-3 text-purple-400" />
                Smart Questions
              </h2>
              <button 
                onClick={() => setShowSmartQuestions(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {smartQuestionCategories.map((category, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{category.icon}</div>
                      <div>
                        <h3 className="text-white font-semibold">{category.name}</h3>
                        <p className="text-white/60 text-sm">{category.questions} questions available</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      category.difficulty === 'Expert' ? 'bg-red-500/20 text-red-300' :
                      category.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-300' :
                      category.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                      category.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {category.difficulty}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  setShowSmartQuestions(false);
                  onStartQuiz();
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Start Smart Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Precision Scoring Modal */}
      {showPrecisionScoring && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
                Precision Scoring Analytics
              </h2>
              <button 
                onClick={() => setShowPrecisionScoring(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{userStats.successRate}%</div>
                  <div className="text-white/70">Overall Accuracy</div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{userStats.totalPoints}</div>
                  <div className="text-white/70">Total Points</div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{userStats.bestStreak}</div>
                  <div className="text-white/70">Best Streak</div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{userStats.level}</div>
                  <div className="text-white/70">Current Level</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Performance Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Science & Tech</span>
                  <span className="text-green-400">85%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">History</span>
                  <span className="text-yellow-400">72%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Sports</span>
                  <span className="text-blue-400">90%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Ranking Modal */}
      {showGlobalRanking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Globe className="w-8 h-8 mr-3 text-yellow-400" />
                Global Rankings
              </h2>
              <button 
                onClick={() => setShowGlobalRanking(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              {globalRankings.map((player, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-300 text-black' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-white/20 text-white'
                    }`}>
                      {player.rank}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{player.name}</div>
                      <div className="text-white/60 text-sm">{player.score} points</div>
                    </div>
                  </div>
                  <div className="text-2xl">{player.country}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-400/30 text-center">
              <div className="text-white font-semibold mb-2">Your Current Rank</div>
              <div className="text-2xl font-bold text-yellow-400">#{userStats.rank}</div>
              <div className="text-white/70 text-sm">Keep playing to climb higher!</div>
            </div>
          </div>
        </div>
      )}

      {/* Lightning Fast Modal */}
      {showLightningFast && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Zap className="w-8 h-8 mr-3 text-pink-400" />
                Lightning Fast Mode
              </h2>
              <button 
                onClick={() => setShowLightningFast(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-2">Speed Challenge</h3>
              <p className="text-white/70">Answer questions as fast as possible!</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold text-pink-400">10s</div>
                <div className="text-white/70 text-sm">Per Question</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold text-yellow-400">2x</div>
                <div className="text-white/70 text-sm">Points Multiplier</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold text-green-400">15</div>
                <div className="text-white/70 text-sm">Questions</div>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => {
                  setShowLightningFast(false);
                  onStartQuiz();
                  toast.success('⚡ Lightning Fast mode activated!');
                }}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all"
              >
                Start Lightning Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Modal */}
      {showCommunity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Users className="w-8 h-8 mr-3 text-blue-400" />
                Community Hub
              </h2>
              <button 
                onClick={() => setShowCommunity(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">10,247</div>
                <div className="text-white/70">Active Members</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">1,892</div>
                <div className="text-white/70">Online Now</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-2">🏆 Weekly Challenge</h3>
                <p className="text-white/70 text-sm">Complete 5 quizzes this week to earn bonus points!</p>
                <div className="mt-2 bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-2">🎯 Daily Goal</h3>
                <p className="text-white/70 text-sm">Score above 80% in today's quiz</p>
                <div className="mt-2 text-yellow-400 text-sm">Reward: 100 bonus points</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty Selector Modal */}
      {showDifficultySelector && (
        <DifficultySelector
          onSelect={handleDifficultySelected}
          onClose={() => setShowDifficultySelector(false)}
        />
      )}

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <FeedbackForm
          userEmail={userEmail}
          onClose={() => setShowFeedbackForm(false)}
        />
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(360deg); }
        }
        .animate-float-0 { animation: float-0 8s ease-in-out infinite; }
        .animate-float-1 { animation: float-1 10s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 12s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}