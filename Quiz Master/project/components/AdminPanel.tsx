'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Download,
  Upload,
  RefreshCw,
  TrendingUp,
  Target,
  Clock,
  Star,
  Award,
  Brain,
  Globe,
  Calendar,
  Filter,
  Search,
  X,
  Save,
  AlertTriangle,
  CheckCircle,
  PieChart,
  Activity
} from 'lucide-react';
import Logo from './Logo';

interface AdminPanelProps {
  onClose: () => void;
}

interface Question {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: number;
  difficulty?: string;
  category?: string;
  created_at?: string;
}

interface UserScore {
  id: number;
  user_id: string;
  score: number;
  total_questions: number;
  quiz_date: string;
  percentage: number;
}

interface Analytics {
  totalUsers: number;
  totalQuizzes: number;
  averageScore: number;
  totalQuestions: number;
  popularDifficulty: string;
  recentActivity: any[];
  scoreDistribution: { range: string; count: number; percentage: number }[];
  dailyStats: { date: string; quizzes: number; users: number }[];
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'questions' | 'users' | 'analytics' | 'settings'>('dashboard');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userScores, setUserScores] = useState<UserScore[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Question management
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // New question form
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_option: 1,
    difficulty: 'medium',
    category: 'general'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadQuestions(),
        loadUserScores(),
        loadAnalytics()
      ]);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    try {
      // Load from localStorage for demo (replace with actual API)
      const saved = localStorage.getItem('adminQuestions');
      if (saved) {
        setQuestions(JSON.parse(saved));
      } else {
        // Load default questions
        const defaultQuestions = [
          {
            id: 1,
            question: "What is the capital of France?",
            option1: "London",
            option2: "Berlin", 
            option3: "Paris",
            option4: "Madrid",
            correct_option: 3,
            difficulty: "easy",
            category: "geography",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            question: "Which planet is known as the Red Planet?",
            option1: "Venus",
            option2: "Mars",
            option3: "Jupiter", 
            option4: "Saturn",
            correct_option: 2,
            difficulty: "medium",
            category: "science",
            created_at: new Date().toISOString()
          }
        ];
        setQuestions(defaultQuestions);
        localStorage.setItem('adminQuestions', JSON.stringify(defaultQuestions));
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const loadUserScores = async () => {
    try {
      // Generate mock user scores for demo
      const mockScores: UserScore[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        user_id: `user_${i + 1}@example.com`,
        score: Math.floor(Math.random() * 15) + 1,
        total_questions: 15,
        quiz_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        percentage: 0
      }));

      mockScores.forEach(score => {
        score.percentage = Math.round((score.score / score.total_questions) * 100);
      });

      setUserScores(mockScores);
    } catch (error) {
      console.error('Error loading user scores:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const totalUsers = new Set(userScores.map(s => s.user_id)).size || 247;
      const totalQuizzes = userScores.length || 1250;
      const averageScore = userScores.length > 0 
        ? Math.round(userScores.reduce((sum, s) => sum + s.percentage, 0) / userScores.length)
        : 72;

      const scoreDistribution = [
        { range: '90-100%', count: 0, percentage: 0 },
        { range: '80-89%', count: 0, percentage: 0 },
        { range: '70-79%', count: 0, percentage: 0 },
        { range: '60-69%', count: 0, percentage: 0 },
        { range: 'Below 60%', count: 0, percentage: 0 }
      ];

      userScores.forEach(score => {
        if (score.percentage >= 90) scoreDistribution[0].count++;
        else if (score.percentage >= 80) scoreDistribution[1].count++;
        else if (score.percentage >= 70) scoreDistribution[2].count++;
        else if (score.percentage >= 60) scoreDistribution[3].count++;
        else scoreDistribution[4].count++;
      });

      scoreDistribution.forEach(item => {
        item.percentage = totalQuizzes > 0 ? Math.round((item.count / totalQuizzes) * 100) : 0;
      });

      const analytics: Analytics = {
        totalUsers,
        totalQuizzes,
        averageScore,
        totalQuestions: questions.length,
        popularDifficulty: 'Medium',
        recentActivity: userScores.slice(0, 10),
        scoreDistribution,
        dailyStats: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          quizzes: Math.floor(Math.random() * 50) + 20,
          users: Math.floor(Math.random() * 30) + 10
        })).reverse()
      };

      setAnalytics(analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim() || !newQuestion.option1.trim() || 
        !newQuestion.option2.trim() || !newQuestion.option3.trim() || 
        !newQuestion.option4.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const question: Question = {
      ...newQuestion,
      id: Date.now(),
      created_at: new Date().toISOString()
    };

    const updatedQuestions = [...questions, question];
    setQuestions(updatedQuestions);
    localStorage.setItem('adminQuestions', JSON.stringify(updatedQuestions));

    setNewQuestion({
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correct_option: 1,
      difficulty: 'medium',
      category: 'general'
    });
    setShowAddQuestion(false);
    toast.success('✅ Question added successfully!');
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion({
      question: question.question,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      correct_option: question.correct_option,
      difficulty: question.difficulty || 'medium',
      category: question.category || 'general'
    });
    setShowAddQuestion(true);
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion) return;

    const updatedQuestions = questions.map(q => 
      q.id === editingQuestion.id 
        ? { ...editingQuestion, ...newQuestion }
        : q
    );

    setQuestions(updatedQuestions);
    localStorage.setItem('adminQuestions', JSON.stringify(updatedQuestions));
    
    setEditingQuestion(null);
    setShowAddQuestion(false);
    setNewQuestion({
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correct_option: 1,
      difficulty: 'medium',
      category: 'general'
    });
    toast.success('✅ Question updated successfully!');
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = questions.filter(q => q.id !== id);
      setQuestions(updatedQuestions);
      localStorage.setItem('adminQuestions', JSON.stringify(updatedQuestions));
      toast.success('🗑️ Question deleted successfully!');
    }
  };

  const exportData = () => {
    const data = {
      questions,
      userScores,
      analytics,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('📊 Data exported successfully!');
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === 'all' || q.category === filterCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo size="sm" showText={true} variant="white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-white/70">Manage your quiz application</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all border border-green-400/30"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              <button
                onClick={onClose}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-400/30"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-white/5 border-r border-white/20 p-4">
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'questions', label: 'Questions', icon: Brain },
                { id: 'users', label: 'Users & Scores', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-500/30 text-white border border-purple-400/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
              </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && analytics && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-white">{analytics.totalUsers}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Quizzes</p>
                        <p className="text-2xl font-bold text-white">{analytics.totalQuizzes}</p>
                      </div>
                      <Target className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Average Score</p>
                        <p className="text-2xl font-bold text-white">{analytics.averageScore}%</p>
                      </div>
                      <Star className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Questions</p>
                        <p className="text-2xl font-bold text-white">{analytics.totalQuestions}</p>
                      </div>
                      <Brain className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Score Distribution */}
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <PieChart className="w-6 h-6 mr-2 text-blue-400" />
                      Score Distribution
                    </h3>
                    <div className="space-y-3">
                      {analytics.scoreDistribution.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white/80">{item.range}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-white text-sm w-12">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Activity className="w-6 h-6 mr-2 text-green-400" />
                      Recent Quiz Activity
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {analytics.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{activity.user_id}</p>
                            <p className="text-white/60 text-sm">
                              {new Date(activity.quiz_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{activity.percentage}%</p>
                            <p className="text-white/60 text-sm">{activity.score}/{activity.total_questions}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Questions Tab */}
            {activeTab === 'questions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Question Management</h2>
                  <button
                    onClick={() => setShowAddQuestion(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all border border-purple-400/30"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Question</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                      <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-400 text-white placeholder-white/50"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="all">All Categories</option>
                    <option value="general">General</option>
                    <option value="science">Science</option>
                    <option value="history">History</option>
                    <option value="geography">Geography</option>
                    <option value="sports">Sports</option>
                    <option value="technology">Technology</option>
                  </select>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {filteredQuestions.map((question) => (
                    <div key={question.id} className="bg-white/10 rounded-xl p-6 border border-white/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-2">{question.question}</h3>
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {[question.option1, question.option2, question.option3, question.option4].map((option, index) => (
                              <div 
                                key={index}
                                className={`p-2 rounded-lg text-sm ${
                                  index + 1 === question.correct_option 
                                    ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                                    : 'bg-white/5 text-white/80'
                                }`}
                              >
                                {String.fromCharCode(65 + index)}. {option}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`px-2 py-1 rounded ${
                              question.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                              question.difficulty === 'medium' ? 'bg-blue-500/20 text-blue-300' :
                              question.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {question.difficulty}
                            </span>
                            <span className="text-white/60">{question.category}</span>
                            {question.created_at && (
                              <span className="text-white/60">
                                {new Date(question.created_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Users & Scores</h2>
                
                <div className="bg-white/10 rounded-xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/10">
                        <tr>
                          <th className="px-6 py-3 text-left text-white font-semibold">User</th>
                          <th className="px-6 py-3 text-left text-white font-semibold">Score</th>
                          <th className="px-6 py-3 text-left text-white font-semibold">Percentage</th>
                          <th className="px-6 py-3 text-left text-white font-semibold">Date</th>
                          <th className="px-6 py-3 text-left text-white font-semibold">Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userScores.slice(0, 20).map((score) => (
                          <tr key={score.id} className="border-t border-white/10 hover:bg-white/5">
                            <td className="px-6 py-4 text-white">{score.user_id}</td>
                            <td className="px-6 py-4 text-white">{score.score}/{score.total_questions}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-sm ${
                                score.percentage >= 80 ? 'bg-green-500/20 text-green-300' :
                                score.percentage >= 60 ? 'bg-blue-500/20 text-blue-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                                {score.percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-white/70">
                              {new Date(score.quiz_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              {score.percentage >= 90 && <Award className="w-5 h-5 text-yellow-400" />}
                              {score.percentage >= 80 && score.percentage < 90 && <Star className="w-5 h-5 text-green-400" />}
                              {score.percentage >= 60 && score.percentage < 80 && <Target className="w-5 h-5 text-blue-400" />}
                              {score.percentage < 60 && <AlertTriangle className="w-5 h-5 text-red-400" />}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && analytics && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Detailed Analytics</h2>
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Quiz Completion Rate</h3>
                    <div className="text-3xl font-bold text-green-400 mb-2">87%</div>
                    <p className="text-white/70 text-sm">Users who complete quizzes</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Average Time</h3>
                    <div className="text-3xl font-bold text-blue-400 mb-2">2:45</div>
                    <p className="text-white/70 text-sm">Minutes per quiz</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Return Rate</h3>
                    <div className="text-3xl font-bold text-purple-400 mb-2">64%</div>
                    <p className="text-white/70 text-sm">Users who take multiple quizzes</p>
                  </div>
                </div>

                {/* Daily Activity Chart */}
                <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Daily Activity (Last 7 Days)</h3>
                  <div className="space-y-4">
                    {analytics.dailyStats.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white/80 w-20">{day.date}</span>
                        <div className="flex-1 mx-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-white/70">Quizzes</span>
                                <span className="text-white">{day.quizzes}</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${(day.quizzes / 70) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-white/70">Users</span>
                                <span className="text-white">{day.users}</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${(day.users / 40) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">System Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Quiz Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Default Questions per Quiz</label>
                        <input 
                          type="number" 
                          defaultValue="15"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Time per Question (seconds)</label>
                        <input 
                          type="number" 
                          defaultValue="30"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <label className="text-white/80">Enable power-ups</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">System Maintenance</h3>
                    <div className="space-y-4">
                      <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-400/30">
                        Clear Cache
                      </button>
                      <button className="w-full px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-all border border-yellow-400/30">
                        Backup Database
                      </button>
                      <button className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-400/30">
                        Reset Statistics
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Question Modal */}
        {showAddQuestion && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-white/20 max-h-[80vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Question</label>
                  <textarea
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 resize-none"
                    rows={3}
                    placeholder="Enter your question..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Option A</label>
                    <input
                      type="text"
                      value={newQuestion.option1}
                      onChange={(e) => setNewQuestion({...newQuestion, option1: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400"
                      placeholder="Option A"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Option B</label>
                    <input
                      type="text"
                      value={newQuestion.option2}
                      onChange={(e) => setNewQuestion({...newQuestion, option2: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400"
                      placeholder="Option B"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Option C</label>
                    <input
                      type="text"
                      value={newQuestion.option3}
                      onChange={(e) => setNewQuestion({...newQuestion, option3: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400"
                      placeholder="Option C"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Option D</label>
                    <input
                      type="text"
                      value={newQuestion.option4}
                      onChange={(e) => setNewQuestion({...newQuestion, option4: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400"
                      placeholder="Option D"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Correct Answer</label>
                    <select
                      value={newQuestion.correct_option}
                      onChange={(e) => setNewQuestion({...newQuestion, correct_option: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400"
                    >
                      <option value={1}>Option A</option>
                      <option value={2}>Option B</option>
                      <option value={3}>Option C</option>
                      <option value={4}>Option D</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Difficulty</label>
                    <select
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Category</label>
                    <select
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="general">General</option>
                      <option value="science">Science</option>
                      <option value="history">History</option>
                      <option value="geography">Geography</option>
                      <option value="sports">Sports</option>
                      <option value="technology">Technology</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddQuestion(false);
                    setEditingQuestion(null);
                    setNewQuestion({
                      question: '',
                      option1: '',
                      option2: '',
                      option3: '',
                      option4: '',
                      correct_option: 1,
                      difficulty: 'medium',
                      category: 'general'
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-600/80 text-white rounded-lg hover:bg-gray-700/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingQuestion ? 'Update Question' : 'Add Question'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}