'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/lib/types';
import { toast } from 'react-hot-toast';
import { Wifi, WifiOff, Download, RefreshCw, Database } from 'lucide-react';

interface OfflineManagerProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

export default function OfflineManager({ onQuestionsLoaded }: OfflineManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [cachedQuestions, setCachedQuestions] = useState<Question[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('🌐 Back online! Syncing latest questions...');
      syncQuestions();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('📱 You\'re offline. Using cached questions.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached questions on mount
    loadCachedQuestions();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCachedQuestions = () => {
    try {
      const cached = localStorage.getItem('cachedQuestions');
      const lastSyncTime = localStorage.getItem('lastQuestionSync');
      
      if (cached) {
        const questions = JSON.parse(cached);
        setCachedQuestions(questions);
        onQuestionsLoaded(questions);
      }
      
      if (lastSyncTime) {
        setLastSync(new Date(lastSyncTime));
      }
    } catch (error) {
      console.error('Error loading cached questions:', error);
    }
  };

  const syncQuestions = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    setSyncing(true);
    try {
      // Import fetchQuestions dynamically to avoid circular dependency
      const { fetchQuestions } = await import('@/lib/api');
      const questions = await fetchQuestions();
      
      // Cache questions
      localStorage.setItem('cachedQuestions', JSON.stringify(questions));
      localStorage.setItem('lastQuestionSync', new Date().toISOString());
      
      setCachedQuestions(questions);
      setLastSync(new Date());
      onQuestionsLoaded(questions);
      
      toast.success('✅ Questions synced successfully!');
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('❌ Sync failed. Using cached questions.');
      
      // Use cached questions as fallback
      if (cachedQuestions.length > 0) {
        onQuestionsLoaded(cachedQuestions);
      }
    } finally {
      setSyncing(false);
    }
  };

  const clearCache = () => {
    localStorage.removeItem('cachedQuestions');
    localStorage.removeItem('lastQuestionSync');
    setCachedQuestions([]);
    setLastSync(null);
    toast.success('🗑️ Cache cleared successfully!');
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-400" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-400" />
          )}
          <div>
            <div className="text-white font-medium">
              {isOnline ? 'Online' : 'Offline Mode'}
            </div>
            <div className="text-white/60 text-sm">
              {cachedQuestions.length} questions cached
              {lastSync && (
                <span className="ml-2">
                  • Last sync: {lastSync.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isOnline && (
            <button
              onClick={syncQuestions}
              disabled={syncing}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-400/30 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span className="text-sm">{syncing ? 'Syncing...' : 'Sync'}</span>
            </button>
          )}
          
          <button
            onClick={clearCache}
            className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-400/30"
          >
            <Database className="w-4 h-4" />
            <span className="text-sm">Clear Cache</span>
          </button>
        </div>
      </div>

      {!isOnline && cachedQuestions.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-yellow-300 font-medium">No cached questions available</div>
              <div className="text-yellow-200/80 text-sm">Connect to internet to download questions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}