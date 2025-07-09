'use client';

import { useState, useEffect } from 'react';
import { Question, UserAnswer } from '@/lib/types';
import { toast } from 'react-hot-toast';
import { Save, Play, Trash2, Clock, Target } from 'lucide-react';

interface SavedQuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  timeLeft: number;
  streak: number;
  totalPoints: number;
  difficulty: string;
  savedAt: string;
}

interface SaveResumeManagerProps {
  currentState?: {
    questions: Question[];
    currentQuestionIndex: number;
    userAnswers: UserAnswer[];
    timeLeft: number;
    streak: number;
    totalPoints: number;
    difficulty: string;
  };
  onResumeQuiz: (state: SavedQuizState) => void;
  onSaveQuiz: () => void;
}

export default function SaveResumeManager({ currentState, onResumeQuiz, onSaveQuiz }: SaveResumeManagerProps) {
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuizState[]>([]);
  const [showSavedQuizzes, setShowSavedQuizzes] = useState(false);

  useEffect(() => {
    loadSavedQuizzes();
  }, []);

  const loadSavedQuizzes = () => {
    try {
      const saved = localStorage.getItem('savedQuizzes');
      if (saved) {
        setSavedQuizzes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved quizzes:', error);
    }
  };

  const saveCurrentQuiz = () => {
    if (!currentState) {
      toast.error('No quiz in progress to save');
      return;
    }

    const savedQuiz: SavedQuizState = {
      ...currentState,
      savedAt: new Date().toISOString()
    };

    const existingSaved = [...savedQuizzes];
    existingSaved.unshift(savedQuiz);
    
    // Keep only the latest 5 saved quizzes
    const limitedSaved = existingSaved.slice(0, 5);
    
    localStorage.setItem('savedQuizzes', JSON.stringify(limitedSaved));
    setSavedQuizzes(limitedSaved);
    
    toast.success('💾 Quiz saved successfully!');
    onSaveQuiz();
  };

  const resumeQuiz = (savedQuiz: SavedQuizState) => {
    onResumeQuiz(savedQuiz);
    setShowSavedQuizzes(false);
    toast.success('▶️ Quiz resumed!');
  };

  const deleteSavedQuiz = (index: number) => {
    const updated = savedQuizzes.filter((_, i) => i !== index);
    localStorage.setItem('savedQuizzes', JSON.stringify(updated));
    setSavedQuizzes(updated);
    toast.success('🗑️ Saved quiz deleted');
  };

  const clearAllSaved = () => {
    localStorage.removeItem('savedQuizzes');
    setSavedQuizzes([]);
    toast.success('🗑️ All saved quizzes cleared');
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const saved = new Date(dateString);
    const diffMs = now.getTime() - saved.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <>
      {/* Save/Resume Buttons */}
      <div className="flex items-center space-x-3">
        {currentState && (
          <button
            onClick={saveCurrentQuiz}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all border border-green-400/30"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">Save Progress</span>
          </button>
        )}
        
        {savedQuizzes.length > 0 && (
          <button
            onClick={() => setShowSavedQuizzes(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-400/30"
          >
            <Play className="w-4 h-4" />
            <span className="text-sm">Resume Quiz ({savedQuizzes.length})</span>
          </button>
        )}
      </div>

      {/* Saved Quizzes Modal */}
      {showSavedQuizzes && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-white/20 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Play className="w-8 h-8 mr-3 text-blue-400" />
                Resume Saved Quiz
              </h2>
              <button 
                onClick={() => setShowSavedQuizzes(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {savedQuizzes.length === 0 ? (
              <div className="text-center py-8">
                <Save className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">No saved quizzes found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedQuizzes.map((savedQuiz, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="text-white font-semibold capitalize">
                            {savedQuiz.difficulty} Quiz
                          </div>
                          <div className="text-white/60 text-sm">
                            {formatTimeAgo(savedQuiz.savedAt)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-blue-400" />
                            <span className="text-white/70">
                              Question {savedQuiz.currentQuestionIndex + 1}/{savedQuiz.questions.length}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-green-400" />
                            <span className="text-white/70">
                              {savedQuiz.timeLeft}s left
                            </span>
                          </div>
                          <div className="text-white/70">
                            Score: {savedQuiz.userAnswers.filter(a => a.isCorrect).length}/{savedQuiz.userAnswers.length}
                          </div>
                          <div className="text-white/70">
                            Points: {savedQuiz.totalPoints}
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                              style={{ width: `${((savedQuiz.currentQuestionIndex + 1) / savedQuiz.questions.length) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => resumeQuiz(savedQuiz)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-400/30"
                        >
                          <Play className="w-4 h-4" />
                          <span>Resume</span>
                        </button>
                        
                        <button
                          onClick={() => deleteSavedQuiz(index)}
                          className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-400/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <button
                    onClick={clearAllSaved}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-400/30"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                  
                  <button
                    onClick={() => setShowSavedQuizzes(false)}
                    className="px-6 py-2 bg-gray-600/80 text-white rounded-lg hover:bg-gray-700/80 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}