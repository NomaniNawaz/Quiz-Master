'use client';

import { useState, useEffect } from 'react';
import { Question, UserAnswer } from '@/lib/types';
import { fetchQuestions } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { ChevronRight, Clock, CheckCircle, XCircle, Zap, Target, Brain, Star, Timer, Award, Lightbulb, TrendingUp, BarChart3, Flame } from 'lucide-react';
import { X, Home, AlertTriangle } from 'lucide-react';
import Logo from './Logo';
import SaveResumeManager from './SaveResumeManager';

interface QuizScreenProps {
  onQuizComplete: (score: number, answers: UserAnswer[], questions: Question[]) => void;
  onQuitQuiz?: () => void;
}

export default function QuizScreen({ onQuizComplete, onQuitQuiz }: QuizScreenProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [powerUpsUsed, setPowerUpsUsed] = useState({
    hint: false,
    extraTime: false,
    fiftyFifty: false
  });
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !quizStartTime) {
      setQuizStartTime(new Date());
      setQuestionStartTime(new Date());
    }
  }, [questions]);

  useEffect(() => {
    if (timeLeft > 0 && !answering && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answering) {
      handleTimeUp();
    }
  }, [timeLeft, answering, questions.length]);

  const loadQuestions = async () => {
    try {
      const fetchedQuestions = await fetchQuestions();
      setQuestions(fetchedQuestions);
    } catch (error) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    if (selectedOption === null) {
      toast.error('⏰ Time\'s up! Moving to next question');
      handleNextQuestion(true);
    }
  };

  const handleOptionSelect = (optionNumber: number) => {
    if (answering || eliminatedOptions.includes(optionNumber)) return;
    setSelectedOption(optionNumber);
  };

  const calculatePoints = (isCorrect: boolean, timeUsed: number) => {
    if (!isCorrect) return 0;
    
    let basePoints = 100;
    let timeBonus = Math.max(0, (30 - timeUsed) * 2); // Bonus for speed
    let streakBonus = streak * 10; // Bonus for streak
    
    return basePoints + timeBonus + streakBonus;
  };

  const handleNextQuestion = (timeUp = false) => {
    if (selectedOption === null && !timeUp) {
      toast.error('Please select an answer');
      return;
    }

    setAnswering(true);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_option;
    
    // Calculate time used
    const timeUsed = questionStartTime ? 30 - timeLeft : 30;
    const points = calculatePoints(isCorrect, timeUsed);
    
    if (isCorrect) {
      setStreak(streak + 1);
      setTotalPoints(prev => prev + points);
      toast.success(`🎉 Correct! +${points} points! Streak: ${streak + 1}`);
    } else {
      setStreak(0);
      if (!timeUp) {
        toast.error(`❌ Incorrect! Correct answer: ${getOptionText(currentQuestion.correct_option)}`);
      }
    }
    
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption: selectedOption || 0,
      isCorrect
    };

    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setAnswering(false);
        setTimeLeft(30);
        setShowHint(false);
        setQuestionStartTime(new Date());
        setEliminatedOptions([]);
        setPowerUpsUsed({ hint: false, extraTime: false, fiftyFifty: false });
      } else {
        const score = newAnswers.filter(a => a.isCorrect).length;
        // Save stats to localStorage
        const currentStats = JSON.parse(localStorage.getItem('userStats') || '{"quizzesCompleted": 0, "successRate": 0, "bestStreak": 0, "totalPoints": 0, "rank": "New Player", "level": 1}');
        const newStats = {
          ...currentStats,
          quizzesCompleted: currentStats.quizzesCompleted + 1,
          successRate: Math.round(((currentStats.successRate * currentStats.quizzesCompleted) + (score / questions.length * 100)) / (currentStats.quizzesCompleted + 1)),
          bestStreak: Math.max(currentStats.bestStreak, streak),
          totalPoints: currentStats.totalPoints + totalPoints,
          level: Math.floor((currentStats.totalPoints + totalPoints) / 1000) + 1
        };
        localStorage.setItem('userStats', JSON.stringify(newStats));
        
        onQuizComplete(score, newAnswers, questions);
      }
    }, 1500);
  };

  const useHint = () => {
    if (powerUpsUsed.hint) return;
    setShowHint(true);
    setPowerUpsUsed(prev => ({ ...prev, hint: true }));
    toast.success('💡 Hint activated!');
  };

  const useExtraTime = () => {
    if (powerUpsUsed.extraTime) return;
    setTimeLeft(prev => prev + 15);
    setPowerUpsUsed(prev => ({ ...prev, extraTime: true }));
    toast.success('⏰ +15 seconds added!');
  };

  const useFiftyFifty = () => {
    if (powerUpsUsed.fiftyFifty) return;
    const currentQuestion = questions[currentQuestionIndex];
    const correctOption = currentQuestion.correct_option;
    const wrongOptions = [1, 2, 3, 4].filter(opt => opt !== correctOption);
    const optionsToEliminate = wrongOptions.slice(0, 2);
    setEliminatedOptions(optionsToEliminate);
    setPowerUpsUsed(prev => ({ ...prev, fiftyFifty: true }));
    toast.success('🎯 50:50 activated! 2 wrong answers eliminated!');
  };

  const handleSaveQuiz = () => {
    // Quiz saved, could show a message or redirect
    toast.success('💾 Quiz progress saved!');
  };

  const handleResumeQuiz = (savedState: any) => {
    setQuestions(savedState.questions);
    setCurrentQuestionIndex(savedState.currentQuestionIndex);
    setUserAnswers(savedState.userAnswers);
    setTimeLeft(savedState.timeLeft);
    setStreak(savedState.streak);
    setTotalPoints(savedState.totalPoints);
    setDifficulty(savedState.difficulty);
    setQuestionStartTime(new Date());
  };

  const handleQuitQuiz = () => {
    if (currentQuestionIndex === 0) {
      // If no questions answered yet, quit directly
      toast.success('🏠 Quiz exited.');
      if (onQuitQuiz) {
        onQuitQuiz();
      }
    } else {
      // Show confirmation if some progress made
      setShowQuitConfirmation(true);
    }
  };

  const confirmQuitQuiz = () => {
    toast.success('🏠 Quiz exited. Progress not saved.');
    if (onQuitQuiz) {
      onQuitQuiz();
    }
  };

  const cancelQuit = () => {
    setShowQuitConfirmation(false);
  };

  const getTimeColor = () => {
    if (timeLeft > 20) return 'text-green-400';
    if (timeLeft > 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTimeBarColor = () => {
    if (timeLeft > 20) return 'bg-green-500';
    if (timeLeft > 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
        <div className="text-center relative z-10">
          <Logo size="lg" showText={true} variant="white" />
          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <div className="text-white text-xl">Preparing your quiz...</div>
          </div>
          <div className="mt-4 text-white/70">Get ready to test your knowledge!</div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" showText={true} variant="white" />
          <p className="text-white/80 mt-6 text-xl">No questions available</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const getOptionText = (optionNumber: number) => {
    switch (optionNumber) {
      case 1: return currentQuestion.option1;
      case 2: return currentQuestion.option2;
      case 3: return currentQuestion.option3;
      case 4: return currentQuestion.option4;
      default: return '';
    }
  };

  const getOptionClass = (optionNumber: number) => {
    let baseClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-300 relative overflow-hidden group ";
    
    if (eliminatedOptions.includes(optionNumber)) {
      baseClass += "border-gray-500 bg-gray-500/20 text-gray-400 opacity-50 cursor-not-allowed";
    } else if (answering) {
      if (optionNumber === currentQuestion.correct_option) {
        baseClass += "border-green-500 bg-green-500/20 text-green-100 shadow-lg shadow-green-500/25";
      } else if (optionNumber === selectedOption) {
        baseClass += "border-red-500 bg-red-500/20 text-red-100 shadow-lg shadow-red-500/25";
      } else {
        baseClass += "border-white/20 bg-white/5 text-white/50";
      }
    } else if (selectedOption === optionNumber) {
      baseClass += "border-purple-500 bg-purple-500/20 text-purple-100 shadow-lg shadow-purple-500/25 transform scale-105";
    } else {
      baseClass += "border-white/20 bg-white/10 text-white hover:border-purple-400 hover:bg-purple-500/10 hover:transform hover:scale-102 backdrop-blur-sm cursor-pointer";
    }
    
    return baseClass;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-spin"></div>
      </div>

      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Logo size="sm" showText={true} variant="white" />
              
              {/* Quit Button */}
              <button
                onClick={handleQuitQuiz}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all backdrop-blur-sm border border-red-400/30"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Quit Quiz</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Streak Counter */}
              {streak > 0 && (
                <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-400/30">
                  <Flame className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{streak} streak!</span>
                </div>
              )}
              
              {/* Points */}
              <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
                <Star className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-bold">{totalPoints} pts</span>
              </div>
              
              {/* Timer */}
              <div className="flex items-center space-x-2">
                <Timer className={`w-5 h-5 ${getTimeColor()}`} />
                <span className={`text-lg font-bold ${getTimeColor()}`}>
                  {timeLeft}s
                </span>
              </div>
              
              {/* Question Counter */}
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-white/80">
                  {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Stats Button */}
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30 hover:bg-blue-500/30 transition-all"
              >
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm">Stats</span>
              </button>
              
              {/* Save/Resume Manager */}
              <SaveResumeManager
                currentState={{
                  questions,
                  currentQuestionIndex,
                  userAnswers,
                  timeLeft,
                  streak,
                  totalPoints,
                  difficulty
                }}
                onSaveQuiz={handleSaveQuiz}
                onResumeQuiz={handleResumeQuiz}
              />
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 h-4 rounded-full transition-all duration-500 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <div className="text-right mt-2">
              <span className="text-sm font-medium text-white/80">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className={`${getTimeBarColor()} h-2 rounded-full transition-all duration-1000`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Live Stats Panel */}
          {showStats && (
            <div className="mt-4 grid grid-cols-4 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{userAnswers.filter(a => a.isCorrect).length}</div>
                <div className="text-xs text-white/70">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">{userAnswers.filter(a => !a.isCorrect).length}</div>
                <div className="text-xs text-white/70">Wrong</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {userAnswers.length > 0 ? Math.round((userAnswers.filter(a => a.isCorrect).length / userAnswers.length) * 100) : 0}%
                </div>
                <div className="text-xs text-white/70">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">{Math.round((currentQuestionIndex + 1) / questions.length * 100)}%</div>
                <div className="text-xs text-white/70">Progress</div>
              </div>
            </div>
          )}
        </div>

        {/* Power-ups Panel */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-4 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Power-ups
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={useHint}
                disabled={powerUpsUsed.hint || showHint}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  powerUpsUsed.hint ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-400/30'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm">Hint</span>
              </button>
              
              <button
                onClick={useExtraTime}
                disabled={powerUpsUsed.extraTime}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  powerUpsUsed.extraTime ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-400/30'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm">+15s</span>
              </button>
              
              <button
                onClick={useFiftyFifty}
                disabled={powerUpsUsed.fiftyFifty}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  powerUpsUsed.fiftyFifty ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-400/30'
                }`}
              >
                <Target className="w-4 h-4" />
                <span className="text-sm">50:50</span>
              </button>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-6 border border-white/20 relative overflow-hidden">
          {/* Question Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4">
              <Brain className="w-16 h-16 text-white" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Star className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-white leading-relaxed flex-1">
                {currentQuestion.question}
              </h2>
              <div className="ml-4 text-right">
                <div className="text-sm text-white/60">Question {currentQuestionIndex + 1}</div>
                <div className="text-lg font-bold text-purple-400">
                  {100 + Math.max(0, (30 - (30 - timeLeft)) * 2) + (streak * 10)} pts
                </div>
              </div>
            </div>

            {showHint && (
              <div className="mb-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30 animate-bounce-in">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  <p className="text-blue-200 text-sm">
                    💡 Think carefully about the key terms in the question! Look for context clues.
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {[1, 2, 3, 4].map((optionNumber) => (
                <button
                  key={optionNumber}
                  onClick={() => handleOptionSelect(optionNumber)}
                  disabled={answering || eliminatedOptions.includes(optionNumber)}
                  className={getOptionClass(optionNumber)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        eliminatedOptions.includes(optionNumber) ? 'bg-gray-500 text-gray-300' :
                        answering && optionNumber === currentQuestion.correct_option 
                          ? 'bg-green-500 text-white' 
                          : answering && optionNumber === selectedOption 
                          ? 'bg-red-500 text-white'
                          : selectedOption === optionNumber 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-white/20 text-white/80'
                      }`}>
                        {eliminatedOptions.includes(optionNumber) ? '✕' : String.fromCharCode(64 + optionNumber)}
                      </div>
                      <span className={`font-medium text-lg ${eliminatedOptions.includes(optionNumber) ? 'line-through' : ''}`}>
                        {getOptionText(optionNumber)}
                      </span>
                    </div>
                    {answering && optionNumber === currentQuestion.correct_option && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                    {answering && optionNumber === selectedOption && optionNumber !== currentQuestion.correct_option && (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={() => handleNextQuestion()}
            disabled={selectedOption === null || answering}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-yellow-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto shadow-2xl transform hover:scale-105 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10">
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </span>
            <ChevronRight className="w-6 h-6 relative z-10" />
          </button>
          
          {selectedOption === null && (
            <p className="text-white/60 mt-3 text-sm">
              Select an answer to continue
            </p>
          )}
        </div>

        {/* Enhanced Quiz Stats */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-green-400">{userAnswers.filter(a => a.isCorrect).length}</div>
            <div className="text-sm text-white/70">Correct</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-red-400">{userAnswers.filter(a => !a.isCorrect).length}</div>
            <div className="text-sm text-white/70">Incorrect</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-yellow-400">{streak}</div>
            <div className="text-sm text-white/70">Streak</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {userAnswers.length > 0 ? Math.round((userAnswers.filter(a => a.isCorrect).length / userAnswers.length) * 100) : 0}%
            </div>
            <div className="text-sm text-white/70">Accuracy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-purple-400">{totalPoints}</div>
            <div className="text-sm text-white/70">Points</div>
          </div>
        </div>
      </div>

      {/* Quit Confirmation Modal */}
      {showQuitConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Quit Quiz?</h3>
              <p className="text-white/70 mb-6">
                Are you sure you want to quit? Your current progress will be lost unless you save it first.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-lg font-bold text-yellow-400">{currentQuestionIndex + 1}/{questions.length}</div>
                  <div className="text-sm text-white/70">Questions Completed</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-lg font-bold text-green-400">{totalPoints}</div>
                  <div className="text-sm text-white/70">Points Earned</div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelQuit}
                  className="flex-1 px-6 py-3 bg-gray-600/80 text-white rounded-xl hover:bg-gray-700/80 transition-all"
                >
                  Continue Quiz
                </button>
                <button
                  onClick={confirmQuitQuiz}
                  className="flex-1 px-6 py-3 bg-red-600/80 text-white rounded-xl hover:bg-red-700/80 transition-all flex items-center justify-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>Quit & Go Home</span>
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                <p className="text-blue-200 text-sm">
                  💡 Tip: Use "Save Progress" to continue later without losing your progress!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}