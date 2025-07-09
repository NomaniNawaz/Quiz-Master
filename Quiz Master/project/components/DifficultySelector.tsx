'use client';

import { useState } from 'react';
import { Brain, Zap, Target, Crown, Star, TrendingUp } from 'lucide-react';

interface DifficultySelectorProps {
  onSelect: (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => void;
  onClose: () => void;
}

export default function DifficultySelector({ onSelect, onClose }: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert' | null>(null);

  const difficulties = [
    {
      id: 'easy' as const,
      name: 'Easy',
      description: 'Perfect for beginners',
      icon: Star,
      color: 'green',
      questions: 10,
      timePerQuestion: 45,
      pointMultiplier: 1,
      features: ['Basic questions', 'More time', 'Hints available']
    },
    {
      id: 'medium' as const,
      name: 'Medium',
      description: 'Balanced challenge',
      icon: Target,
      color: 'blue',
      questions: 15,
      timePerQuestion: 30,
      pointMultiplier: 1.5,
      features: ['Moderate difficulty', 'Standard time', 'Limited hints']
    },
    {
      id: 'hard' as const,
      name: 'Hard',
      description: 'For quiz masters',
      icon: Brain,
      color: 'purple',
      questions: 20,
      timePerQuestion: 20,
      pointMultiplier: 2,
      features: ['Challenging questions', 'Less time', 'No hints']
    },
    {
      id: 'expert' as const,
      name: 'Expert',
      description: 'Ultimate challenge',
      icon: Crown,
      color: 'yellow',
      questions: 25,
      timePerQuestion: 15,
      pointMultiplier: 3,
      features: ['Expert level', 'Minimal time', 'No power-ups']
    }
  ];

  const handleSelect = () => {
    if (selectedDifficulty) {
      onSelect(selectedDifficulty);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 mr-3 text-purple-400" />
            Choose Your Challenge Level
          </h2>
          <p className="text-white/70 text-lg">Select the difficulty that matches your expertise</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.id}
              onClick={() => setSelectedDifficulty(difficulty.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                selectedDifficulty === difficulty.id
                  ? `border-${difficulty.color}-400 bg-${difficulty.color}-500/20 transform scale-105`
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-${difficulty.color}-500/20`}>
                  <difficulty.icon className={`w-6 h-6 text-${difficulty.color}-400`} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{difficulty.name}</h3>
                <p className="text-white/70 text-sm mb-4">{difficulty.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Questions:</span>
                    <span className="text-white">{difficulty.questions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Time/Question:</span>
                    <span className="text-white">{difficulty.timePerQuestion}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Point Multiplier:</span>
                    <span className={`text-${difficulty.color}-400 font-bold`}>{difficulty.pointMultiplier}x</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {difficulty.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-white/60">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${difficulty.color}-400 mr-2`}></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {selectedDifficulty === difficulty.id && (
                  <div className="absolute top-2 right-2">
                    <div className={`w-6 h-6 rounded-full bg-${difficulty.color}-500 flex items-center justify-center`}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-600/80 text-white rounded-xl font-semibold hover:bg-gray-700/80 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedDifficulty}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 text-white rounded-xl font-semibold hover:from-purple-700 hover:via-pink-700 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>Start {selectedDifficulty ? difficulties.find(d => d.id === selectedDifficulty)?.name : ''} Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
}