'use client';

import { Brain, Zap, Star, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

export default function Logo({ size = 'md', showText = true, variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          bg: 'bg-white/20 backdrop-blur-sm',
          text: 'text-white',
          icon: 'text-white',
          gradient: 'from-white to-white/80',
          accent: 'text-yellow-400'
        };
      case 'dark':
        return {
          bg: 'bg-gray-800',
          text: 'text-gray-800',
          icon: 'text-white',
          gradient: 'from-gray-600 to-gray-800',
          accent: 'text-yellow-400'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-purple-100 to-pink-100',
          text: 'text-gray-800',
          icon: 'text-purple-600',
          gradient: 'from-purple-600 to-pink-600',
          accent: 'text-yellow-500'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="flex items-center space-x-3">
      {/* Enhanced Logo Icon */}
      <div className={`${sizeClasses[size]} ${colors.bg} rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl border border-white/30`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-yellow-500/30 animate-pulse"></div>
        
        {/* Main Icon */}
        <div className="relative z-20 flex items-center justify-center">
          <Brain className={`${iconSizeClasses[size]} ${colors.icon} drop-shadow-lg`} />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1 right-1 z-10">
          <Zap className={`w-3 h-3 ${colors.accent} animate-pulse`} />
        </div>
        <div className="absolute bottom-1 left-1 z-10">
          <Star className={`w-2 h-2 ${colors.accent} animate-spin`} style={{ animationDuration: '3s' }} />
        </div>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/20 to-transparent opacity-60 animate-pulse"></div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-sm"></div>
      </div>

      {/* Enhanced App Name */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold ${colors.text} leading-tight relative`}>
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
              QuizMaster
            </span>
            <span className={`${colors.text} ml-1`}>Pro</span>
            {(size === 'lg' || size === 'xl') && (
              <Sparkles className="inline w-4 h-4 text-yellow-400 ml-1 animate-pulse" />
            )}
          </h1>
          {(size === 'lg' || size === 'xl') && (
            <p className="text-sm text-gray-500 font-medium bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Test Your Knowledge
            </p>
          )}
          {size === 'md' && showText && (
            <div className="flex items-center space-x-1 mt-1">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Interactive</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}