'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MessageSquare, Star, Send, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';

interface FeedbackFormProps {
  onClose: () => void;
  userEmail: string;
}

export default function FeedbackForm({ onClose, userEmail }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general' | 'compliment'>('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const feedbackTypes = [
    { id: 'bug', label: 'Bug Report', icon: ThumbsDown, color: 'red' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'blue' },
    { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'purple' },
    { id: 'compliment', label: 'Compliment', icon: ThumbsUp, color: 'green' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setSubmitting(true);

    try {
      // Simulate API call - replace with actual implementation
      const feedbackData = {
        userEmail,
        rating,
        type: feedbackType,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Store in localStorage for demo (replace with actual API)
      const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
      existingFeedback.push(feedbackData);
      localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));

      // In production, send to your backend or Google Sheets
      // await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(feedbackData)
      // });

      toast.success('🙏 Thank you for your feedback!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-white/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 mr-3 text-purple-400" />
            Share Your Feedback
          </h2>
          <p className="text-white/70">Help us improve QuizMaster Pro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-white/90 font-medium mb-3">
              How would you rate your experience?
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-lg transition-all ${
                    star <= rating 
                      ? 'text-yellow-400 transform scale-110' 
                      : 'text-white/40 hover:text-yellow-400'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Type */}
          <div>
            <label className="block text-white/90 font-medium mb-3">
              What type of feedback is this?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {feedbackTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFeedbackType(type.id as any)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    feedbackType === type.id
                      ? `border-${type.color}-400 bg-${type.color}-500/20`
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <type.icon className={`w-5 h-5 text-${type.color}-400`} />
                    <span className="text-white text-sm font-medium">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-white/90 font-medium mb-3">
              Your feedback
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              rows={4}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all text-white placeholder-white/50 resize-none"
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-600/80 text-white rounded-lg hover:bg-gray-700/80 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Privacy Note */}
        <div className="mt-4 text-center">
          <p className="text-white/50 text-xs">
            Your feedback helps us improve. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  );
}