'use client';

import { useEffect, useState } from 'react';
import { Question, UserAnswer } from '@/lib/types';
import { submitScore } from '@/lib/api';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Trophy, RotateCcw, LogOut, Share2, CheckCircle, XCircle, Star, Award, Target, Zap, TrendingUp, Clock, Medal, Crown, Sparkles, BarChart3, Globe, Users, Brain } from 'lucide-react';
import Logo from './Logo';
import ResultShareImage from './ResultShareImage';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  questions: Question[];
  onRestartQuiz: () => void;
  onLogout: () => void;
}

export default function ResultScreen({ 
  score, 
  totalQuestions, 
  answers, 
  questions, 
  onRestartQuiz, 
  onLogout 
}: ResultScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [showGlobalComparison, setShowGlobalComparison] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showShareImage, setShowShareImage] = useState(false);
  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    // Submit score to backend
    const saveScore = async () => {
      if (auth.currentUser) {
        const success = await submitScore(auth.currentUser.uid, score, totalQuestions);
        if (success) {
          toast.success('🎉 Score saved successfully!');
        }
      }
    };
    saveScore();

    // Trigger animations
    setTimeout(() => setAnimateScore(true), 500);
    if (percentage >= 80) {
      setTimeout(() => setShowConfetti(true), 1000);
    }
  }, [score, totalQuestions, percentage]);

  const getScoreColor = () => {
    if (percentage >= 90) return 'text-yellow-400';
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-blue-400';
    return 'text-red-400';
  };

  const getScoreGradient = () => {
    if (percentage >= 90) return 'from-yellow-400 to-orange-400';
    if (percentage >= 80) return 'from-green-400 to-emerald-400';
    if (percentage >= 60) return 'from-blue-400 to-cyan-400';
    return 'from-red-400 to-pink-400';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding! You\'re a Quiz Master! 🏆', icon: Crown };
    if (percentage >= 80) return { text: 'Excellent work! Keep it up! 🎉', icon: Trophy };
    if (percentage >= 60) return { text: 'Good job! You\'re improving! 👍', icon: Medal };
    return { text: 'Keep practicing! You\'ll get better! 💪', icon: Target };
  };

  const getPerformanceLevel = () => {
    if (percentage >= 90) return 'LEGENDARY';
    if (percentage >= 80) return 'EXCELLENT';
    if (percentage >= 60) return 'GOOD';
    return 'NEEDS IMPROVEMENT';
  };

  const handleShare = async () => {
    const shareText = `🎯 I just scored ${score}/${totalQuestions} (${percentage}%) on QuizMaster Pro! Think you can beat my score? 🚀`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuizMaster Pro Results',
          text: shareText,
        });
      } catch (error) {
        navigator.clipboard.writeText(shareText);
        toast.success('📋 Results copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('📋 Results copied to clipboard!');
    }
  };

  const handleDetailedAnalysis = () => {
    setShowDetailedAnalysis(true);
    toast.success('📊 Detailed analysis opened!');
  };

  const handleGlobalComparison = () => {
    setShowGlobalComparison(true);
    toast.success('🌍 Global comparison loaded!');
  };

  const handleShareOptions = () => {
    setShowShareOptions(true);
    toast.success('📱 Share options opened!');
  };

  const handleShareImage = () => {
    setShowShareImage(true);
    toast.success('📸 Creating shareable image...');
  };

  const getOptionText = (question: Question, optionNumber: number) => {
    switch (optionNumber) {
      case 1: return question.option1;
      case 2: return question.option2;
      case 3: return question.option3;
      case 4: return question.option4;
      default: return '';
    }
  };

  const scoreMessage = getScoreMessage();
  const ScoreIcon = scoreMessage.icon;

  const globalStats = {
    averageScore: 65,
    totalPlayers: 10247,
    yourRank: Math.floor(Math.random() * 1000) + 1,
    betterThan: Math.max(0, percentage - 10 + Math.random() * 20)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        {showConfetti && (
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <Star className="w-4 h-4 text-yellow-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 p-4 max-w-6xl mx-auto">
        {/* Main Score Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 text-center border border-white/20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full animate-spin"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white rounded-full animate-ping"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white rounded-full animate-pulse"></div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Logo size="lg" showText={true} variant="white" />
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h1>
            
            {/* Performance Level Badge */}
            <div className={`inline-block px-6 py-2 rounded-full text-sm font-bold mb-6 bg-gradient-to-r ${getScoreGradient()} text-white`}>
              {getPerformanceLevel()}
            </div>
            
            <p className="text-white/80 text-xl mb-8">{scoreMessage.text}</p>
            
            {/* Animated Score Display */}
            <div className="mb-8">
              <div className={`text-8xl font-bold mb-4 bg-gradient-to-r ${getScoreGradient()} bg-clip-text text-transparent transition-all duration-1000 ${animateScore ? 'scale-110' : 'scale-100'}`}>
                {score}/{totalQuestions}
              </div>
              <div className={`text-4xl font-bold ${getScoreColor()} flex items-center justify-center space-x-3`}>
                <ScoreIcon className="w-10 h-10" />
                <span>{percentage}%</span>
                <ScoreIcon className="w-10 h-10" />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{score}</div>
                <div className="text-sm text-white/70">Correct</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-400">{totalQuestions - score}</div>
                <div className="text-sm text-white/70">Incorrect</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">{percentage}%</div>
                <div className="text-sm text-white/70">Accuracy</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">2:30</div>
                <div className="text-sm text-white/70">Time</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={onRestartQuiz}
                className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:via-blue-700 hover:to-purple-700 transition-all flex items-center space-x-3 shadow-2xl transform hover:scale-105 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <RotateCcw className="w-6 h-6 relative z-10" />
                <span className="relative z-10">🎯 Play Again</span>
              </button>
              
              <button
                onClick={handleShareOptions}
                className="bg-blue-600/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700/80 transition-all flex items-center space-x-3 shadow-lg border border-blue-400/30"
              >
                <Share2 className="w-6 h-6" />
                <span>Share Score</span>
              </button>
              
              <button
                onClick={handleShareImage}
                className="bg-purple-600/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700/80 transition-all flex items-center space-x-3 shadow-lg border border-purple-400/30"
              >
                <Camera className="w-6 h-6" />
                <span>Share Image</span>
              </button>
              
              <button
                onClick={onLogout}
                className="bg-gray-600/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-700/80 transition-all flex items-center space-x-3 shadow-lg border border-gray-400/30"
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={handleDetailedAnalysis}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group text-left"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Detailed Analysis</h3>
                <p className="text-white/60 text-sm">View performance breakdown</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleGlobalComparison}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group text-left"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-all">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Global Comparison</h3>
                <p className="text-white/60 text-sm">See how you rank globally</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowShareOptions(true)}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group text-left"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Share & Challenge</h3>
                <p className="text-white/60 text-sm">Challenge friends to beat you</p>
              </div>
            </div>
          </button>
        </div>

        {/* Achievements Section */}
        {percentage >= 80 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Award className="w-8 h-8 mr-3 text-yellow-400" />
              Achievements Unlocked!
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {percentage >= 90 && (
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 text-center animate-bounce-in">
                  <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                  <div className="text-yellow-400 font-bold">Quiz Master</div>
                  <div className="text-white/70 text-sm">Scored 90%+</div>
                </div>
              )}
              {percentage >= 80 && (
                <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center animate-bounce-in">
                  <Trophy className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <div className="text-green-400 font-bold">High Achiever</div>
                  <div className="text-white/70 text-sm">Scored 80%+</div>
                </div>
              )}
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 text-center animate-bounce-in">
                <Zap className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <div className="text-blue-400 font-bold">Quiz Completed</div>
                <div className="text-white/70 text-sm">Finished the quiz</div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Results */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Target className="w-8 h-8 mr-3 text-purple-400" />
            Review Your Answers
          </h2>
          
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = answers.find(a => a.questionId === question.id);
              const isCorrect = userAnswer?.isCorrect || false;
              
              return (
                <div key={question.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-4 text-lg">
                        {index + 1}. {question.question}
                      </h3>
                      
                      <div className="grid gap-3">
                        {[1, 2, 3, 4].map((optionNumber) => {
                          const isUserAnswer = userAnswer?.selectedOption === optionNumber;
                          const isCorrectAnswer = question.correct_option === optionNumber;
                          
                          let optionClass = "p-4 rounded-lg border transition-all ";
                          if (isCorrectAnswer) {
                            optionClass += "border-green-500/50 bg-green-500/20 text-green-100";
                          } else if (isUserAnswer && !isCorrect) {
                            optionClass += "border-red-500/50 bg-red-500/20 text-red-100";
                          } else {
                            optionClass += "border-white/20 bg-white/5 text-white/80";
                          }
                          
                          return (
                            <div key={optionNumber} className={optionClass}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                                    isCorrectAnswer ? 'bg-green-500 text-white' :
                                    isUserAnswer ? 'bg-red-500 text-white' : 'bg-white/20 text-white/70'
                                  }`}>
                                    {String.fromCharCode(64 + optionNumber)}
                                  </div>
                                  <span className="font-medium">
                                    {getOptionText(question, optionNumber)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {isCorrectAnswer && (
                                    <span className="text-sm font-medium text-green-400 bg-green-500/20 px-2 py-1 rounded">
                                      ✓ Correct
                                    </span>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <span className="text-sm font-medium text-red-400 bg-red-500/20 px-2 py-1 rounded">
                                      Your choice
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      
      {/* Detailed Analysis Modal */}
      {showDetailedAnalysis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-white/20 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
                Detailed Performance Analysis
              </h2>
              <button 
                onClick={() => setShowDetailedAnalysis(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">{percentage}%</div>
                    <div className="text-white/70">Overall Score</div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">2:30</div>
                    <div className="text-white/70">Total Time</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Question-by-Question Analysis</h3>
                <div className="space-y-2">
                  {questions.map((_, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer?.isCorrect || false;
                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <span className="text-white/80">Question {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <span className={`text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {isCorrect ? 'Correct' : 'Wrong'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Comparison Modal */}
      {showGlobalComparison && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Globe className="w-8 h-8 mr-3 text-green-400" />
                Global Performance Comparison
              </h2>
              <button 
                onClick={() => setShowGlobalComparison(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">#{globalStats.yourRank}</div>
                <div className="text-white/70">Your Global Rank</div>
                <div className="text-green-400 text-sm mt-1">
                  Better than {Math.round(globalStats.betterThan)}% of players!
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <div className="text-2xl font-bold text-blue-400">{globalStats.averageScore}%</div>
                  <div className="text-white/70 text-sm">Global Average</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                  <div className="text-2xl font-bold text-purple-400">{globalStats.totalPlayers.toLocaleString()}</div>
                  <div className="text-white/70 text-sm">Total Players</div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3">Performance Distribution</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">90-100%</span>
                    <span className="text-yellow-400">15%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">80-89%</span>
                    <span className="text-green-400">25%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">70-79%</span>
                    <span className="text-blue-400">30%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Below 70%</span>
                    <span className="text-red-400">30%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Options Modal */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Share2 className="w-8 h-8 mr-3 text-blue-400" />
                Share Your Score
              </h2>
              <button 
                onClick={() => setShowShareOptions(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleShare}
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-3 rounded-lg transition-all border border-blue-400/30 flex items-center justify-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Share via System</span>
              </button>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`🎯 I scored ${percentage}% on QuizMaster Pro! Can you beat me? 🚀`);
                  toast.success('📋 Copied to clipboard!');
                }}
                className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-300 py-3 rounded-lg transition-all border border-green-400/30 flex items-center justify-center space-x-2"
              >
                <Brain className="w-5 h-5" />
                <span>Copy Challenge Text</span>
              </button>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Challenge Friends</h3>
                <p className="text-white/70 text-sm mb-3">
                  Share your score and challenge friends to beat your {percentage}% score!
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{percentage}%</div>
                  <div className="text-white/60 text-sm">Your Score to Beat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Image Modal */}
      {showShareImage && (
        <ResultShareImage
          score={score}
          totalQuestions={totalQuestions}
          percentage={percentage}
          userName={getUserName(auth.currentUser?.email || '')}
          onClose={() => setShowShareImage(false)}
        />
      )}
    </div>
  );
}
function getUserName(email: string) {
  if (!email) return 'Quiz Master';
  const name = email.split('@')[0];
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._]/g, ' ');
}