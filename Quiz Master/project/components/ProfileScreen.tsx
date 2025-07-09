'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  Award, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Edit3, 
  Save, 
  X, 
  Crown, 
  Zap, 
  Brain, 
  Medal,
  Calendar,
  Globe,
  Users,
  Flame,
  ChevronRight,
  Camera,
  Shield,
  Bell,
  Palette,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import Logo from './Logo';

interface ProfileScreenProps {
  userEmail: string;
  onBack: () => void;
  onLogout: () => void;
}

interface UserStats {
  quizzesCompleted: number;
  successRate: number;
  bestStreak: number;
  totalPoints: number;
  rank: string;
  level: number;
  averageTime: string;
  favoriteCategory: string;
  joinDate: string;
  achievements: string[];
  weeklyGoal: number;
  weeklyProgress: number;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  notifications: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionsPerQuiz: number;
  timeLimit: boolean;
}

export default function ProfileScreen({ userEmail, onBack, onLogout }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [userStats, setUserStats] = useState<UserStats>({
    quizzesCompleted: 0,
    successRate: 0,
    bestStreak: 0,
    totalPoints: 0,
    rank: 'New Player',
    level: 1,
    averageTime: '2:30',
    favoriteCategory: 'General Knowledge',
    joinDate: new Date().toLocaleDateString(),
    achievements: [],
    weeklyGoal: 5,
    weeklyProgress: 2
  });
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'dark',
    soundEnabled: true,
    notifications: true,
    difficulty: 'mixed',
    questionsPerQuiz: 15,
    timeLimit: true
  });

  useEffect(() => {
    // Load user stats and preferences
    const savedStats = localStorage.getItem('userStats');
    const savedPreferences = localStorage.getItem('userPreferences');
    const savedDisplayName = localStorage.getItem('displayName');
    
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setUserStats({
        ...stats,
        averageTime: '2:30',
        favoriteCategory: 'Science & Technology',
        joinDate: '2024-01-15',
        achievements: getAchievements(stats),
        weeklyGoal: 5,
        weeklyProgress: Math.floor(Math.random() * 5) + 1
      });
    }
    
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
    
    if (savedDisplayName) {
      setDisplayName(savedDisplayName);
    } else {
      setDisplayName(getUserName(userEmail));
    }
  }, [userEmail]);

  const getAchievements = (stats: any) => {
    const achievements = [];
    if (stats.quizzesCompleted >= 1) achievements.push('First Quiz');
    if (stats.successRate >= 80) achievements.push('High Achiever');
    if (stats.successRate >= 90) achievements.push('Quiz Master');
    if (stats.bestStreak >= 5) achievements.push('Streak Master');
    if (stats.totalPoints >= 1000) achievements.push('Point Collector');
    if (stats.level >= 5) achievements.push('Level Up');
    return achievements;
  };

  const getUserName = (email: string) => {
    if (!email) return 'Quiz Master';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._]/g, ' ');
  };

  const handleSaveProfile = () => {
    localStorage.setItem('displayName', displayName);
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    setIsEditing(false);
    toast.success('✅ Profile updated successfully!');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('👋 Logged out successfully!');
      onLogout();
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const getLevelProgress = () => {
    const pointsForCurrentLevel = (userStats.level - 1) * 1000;
    const pointsForNextLevel = userStats.level * 1000;
    const currentLevelPoints = userStats.totalPoints - pointsForCurrentLevel;
    const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
    return (currentLevelPoints / pointsNeeded) * 100;
  };

  const getRankColor = () => {
    if (userStats.level >= 10) return 'text-purple-400';
    if (userStats.level >= 5) return 'text-yellow-400';
    if (userStats.level >= 3) return 'text-blue-400';
    return 'text-green-400';
  };

  const getRankIcon = () => {
    if (userStats.level >= 10) return Crown;
    if (userStats.level >= 5) return Trophy;
    if (userStats.level >= 3) return Medal;
    return Star;
  };

  const achievementsList = [
    { id: 'first-quiz', name: 'First Quiz', description: 'Complete your first quiz', icon: Target, unlocked: userStats.achievements.includes('First Quiz') },
    { id: 'high-achiever', name: 'High Achiever', description: 'Score 80% or higher', icon: Trophy, unlocked: userStats.achievements.includes('High Achiever') },
    { id: 'quiz-master', name: 'Quiz Master', description: 'Score 90% or higher', icon: Crown, unlocked: userStats.achievements.includes('Quiz Master') },
    { id: 'streak-master', name: 'Streak Master', description: 'Get 5+ correct answers in a row', icon: Flame, unlocked: userStats.achievements.includes('Streak Master') },
    { id: 'point-collector', name: 'Point Collector', description: 'Earn 1000+ total points', icon: Star, unlocked: userStats.achievements.includes('Point Collector') },
    { id: 'level-up', name: 'Level Up', description: 'Reach level 5', icon: TrendingUp, unlocked: userStats.achievements.includes('Level Up') },
    { id: 'speed-demon', name: 'Speed Demon', description: 'Complete quiz in under 2 minutes', icon: Zap, unlocked: false },
    { id: 'perfectionist', name: 'Perfectionist', description: 'Get 100% score', icon: Award, unlocked: false }
  ];

  const RankIcon = getRankIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                <span>Back to Home</span>
              </button>
              <div className="w-px h-6 bg-white/20"></div>
              <Logo size="sm" showText={true} variant="white" />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all backdrop-blur-sm border border-red-400/30"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-6 border border-white/20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold text-white relative overflow-hidden">
                <span>{displayName.charAt(0)}</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
              </div>
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
              <div className="absolute -top-2 -right-2">
                <RankIcon className={`w-8 h-8 ${getRankColor()}`} />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="text-2xl font-bold text-white bg-white/10 border border-white/20 rounded-lg px-3 py-1 focus:ring-2 focus:ring-purple-400"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-white">{displayName}</h1>
                )}
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {isEditing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </button>
              </div>
              
              <p className="text-white/70 mb-4 flex items-center justify-center lg:justify-start">
                <Mail className="w-4 h-4 mr-2" />
                {userEmail}
              </p>

              {/* Level Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">Level {userStats.level}</span>
                  <span className="text-white/60">{userStats.totalPoints} / {userStats.level * 1000} XP</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getLevelProgress()}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{userStats.quizzesCompleted}</div>
                  <div className="text-xs text-white/70">Quizzes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{userStats.successRate}%</div>
                  <div className="text-xs text-white/70">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{userStats.bestStreak}</div>
                  <div className="text-xs text-white/70">Best Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-2 mb-6 border border-white/20">
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'stats', label: 'Statistics', icon: BarChart3 },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/30 text-white border border-purple-400/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Overview</h2>
              
              {/* Weekly Progress */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-blue-400" />
                  Weekly Progress
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/80">Goal: {userStats.weeklyGoal} quizzes</span>
                  <span className="text-white/60">{userStats.weeklyProgress} / {userStats.weeklyGoal}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(userStats.weeklyProgress / userStats.weeklyGoal) * 100}%` }}
                  ></div>
                </div>
                <p className="text-white/70 text-sm">
                  {userStats.weeklyProgress >= userStats.weeklyGoal 
                    ? '🎉 Congratulations! You\'ve completed your weekly goal!' 
                    : `${userStats.weeklyGoal - userStats.weeklyProgress} more quizzes to reach your goal!`
                  }
                </p>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-green-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[
                    { action: 'Completed Science Quiz', score: '85%', time: '2 hours ago' },
                    { action: 'Unlocked Achievement', name: 'High Achiever', time: '1 day ago' },
                    { action: 'Completed General Knowledge Quiz', score: '92%', time: '2 days ago' },
                    { action: 'Reached Level 3', time: '3 days ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{activity.action}</div>
                        {activity.score && <div className="text-green-400 text-sm">{activity.score}</div>}
                        {activity.name && <div className="text-yellow-400 text-sm">{activity.name}</div>}
                      </div>
                      <div className="text-white/60 text-sm">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Detailed Statistics</h2>
              
              {/* Performance Metrics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Points', value: userStats.totalPoints, icon: Star, color: 'text-yellow-400' },
                  { label: 'Average Time', value: userStats.averageTime, icon: Clock, color: 'text-blue-400' },
                  { label: 'Favorite Category', value: userStats.favoriteCategory, icon: Brain, color: 'text-purple-400' },
                  { label: 'Member Since', value: userStats.joinDate, icon: Calendar, color: 'text-green-400' }
                ].map((stat, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                    <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Performance Chart */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Performance Trends</h3>
                <div className="space-y-4">
                  {[
                    { category: 'Science & Technology', score: 85, color: 'bg-blue-500' },
                    { category: 'History & Geography', score: 78, color: 'bg-green-500' },
                    { category: 'Sports & Entertainment', score: 92, color: 'bg-yellow-500' },
                    { category: 'Mathematics', score: 70, color: 'bg-red-500' },
                    { category: 'General Knowledge', score: 88, color: 'bg-purple-500' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-white/80">
                        <span>{item.category}</span>
                        <span>{item.score}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {achievementsList.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-6 rounded-xl border transition-all ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30' 
                        : 'bg-white/5 border-white/10 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.unlocked ? 'bg-yellow-500/20' : 'bg-white/10'
                      }`}>
                        <achievement.icon className={`w-6 h-6 ${
                          achievement.unlocked ? 'text-yellow-400' : 'text-white/40'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${
                          achievement.unlocked ? 'text-white' : 'text-white/60'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm ${
                          achievement.unlocked ? 'text-white/80' : 'text-white/40'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <div className="text-yellow-400">
                          <Award className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
              
              {/* Appearance */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Palette className="w-6 h-6 mr-3 text-purple-400" />
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Theme</span>
                    <div className="flex space-x-2">
                      {[
                        { value: 'light', icon: Sun, label: 'Light' },
                        { value: 'dark', icon: Moon, label: 'Dark' },
                        { value: 'auto', icon: Monitor, label: 'Auto' }
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => setPreferences(prev => ({ ...prev, theme: theme.value as any }))}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                            preferences.theme === theme.value
                              ? 'bg-purple-500/30 text-white border border-purple-400/30'
                              : 'bg-white/10 text-white/70 hover:text-white'
                          }`}
                        >
                          <theme.icon className="w-4 h-4" />
                          <span className="text-sm">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio & Notifications */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Bell className="w-6 h-6 mr-3 text-blue-400" />
                  Audio & Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {preferences.soundEnabled ? <Volume2 className="w-5 h-5 text-green-400" /> : <VolumeX className="w-5 h-5 text-red-400" />}
                      <span className="text-white/80">Sound Effects</span>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                      className={`w-12 h-6 rounded-full transition-all ${
                        preferences.soundEnabled ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                        preferences.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-blue-400" />
                      <span className="text-white/80">Push Notifications</span>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, notifications: !prev.notifications }))}
                      className={`w-12 h-6 rounded-full transition-all ${
                        preferences.notifications ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                        preferences.notifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quiz Preferences */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Brain className="w-6 h-6 mr-3 text-green-400" />
                  Quiz Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Difficulty Level</span>
                    <select
                      value={preferences.difficulty}
                      onChange={(e) => setPreferences(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Questions per Quiz</span>
                    <select
                      value={preferences.questionsPerQuiz}
                      onChange={(e) => setPreferences(prev => ({ ...prev, questionsPerQuiz: parseInt(e.target.value) }))}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-400"
                    >
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                      <option value={25}>25 Questions</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span className="text-white/80">Time Limit</span>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, timeLimit: !prev.timeLimit }))}
                      className={`w-12 h-6 rounded-full transition-all ${
                        preferences.timeLimit ? 'bg-green-500' : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                        preferences.timeLimit ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="text-center">
                <button
                  onClick={handleSaveProfile}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:via-pink-700 hover:to-yellow-600 transition-all flex items-center space-x-3 mx-auto shadow-2xl transform hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}