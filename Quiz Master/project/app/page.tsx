'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Toaster } from 'react-hot-toast';
import AuthForm from '@/components/AuthForm';
import HomeScreen from '@/components/HomeScreen';
import QuizScreen from '@/components/QuizScreen';
import ResultScreen from '@/components/ResultScreen';
import { Question, UserAnswer } from '@/lib/types';

type Screen = 'auth' | 'home' | 'quiz' | 'result';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<UserAnswer[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setCurrentScreen(user ? 'home' : 'auth');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    setCurrentScreen('home');
  };

  const handleStartQuiz = () => {
    setCurrentScreen('quiz');
  };

  const handleQuitQuiz = () => {
    setCurrentScreen('home');
  };

  const handleQuizComplete = (score: number, answers: UserAnswer[], questions: Question[]) => {
    setQuizScore(score);
    setQuizAnswers(answers);
    setQuizQuestions(questions);
    setCurrentScreen('result');
  };

  const handleRestartQuiz = () => {
    setCurrentScreen('quiz');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      
      {currentScreen === 'auth' && (
        <AuthForm onSuccess={handleAuthSuccess} />
      )}
      
      {currentScreen === 'home' && user && (
        <HomeScreen 
          userEmail={user.email || ''} 
          onStartQuiz={handleStartQuiz}
          onLogout={handleLogout}
        />
      )}
      
      {currentScreen === 'quiz' && (
        <QuizScreen 
          onQuizComplete={handleQuizComplete} 
          onQuitQuiz={handleQuitQuiz}
        />
      )}
      
      {currentScreen === 'result' && (
        <ResultScreen 
          score={quizScore}
          totalQuestions={quizQuestions.length}
          answers={quizAnswers}
          questions={quizQuestions}
          onRestartQuiz={handleRestartQuiz}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}