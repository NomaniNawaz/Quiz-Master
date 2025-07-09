'use client';

import { useRef, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Download, Share2, Camera, Trophy, Star, Target } from 'lucide-react';
import Logo from './Logo';

interface ResultShareImageProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  userName: string;
  onClose: () => void;
}

export default function ResultShareImage({ 
  score, 
  totalQuestions, 
  percentage, 
  userName, 
  onClose 
}: ResultShareImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageGenerated, setImageGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    generateImage();
  }, []);

  const generateImage = async () => {
    setGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#4c1d95'); // purple-900
    gradient.addColorStop(0.5, '#7c3aed'); // purple-600
    gradient.addColorStop(1, '#ec4899'); // pink-500

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(700, 500, 60, 0, Math.PI * 2);
    ctx.fill();

    // Add title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QuizMaster Pro', canvas.width / 2, 80);

    // Add subtitle
    ctx.font = '24px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Quiz Results', canvas.width / 2, 120);

    // Add user name
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#fbbf24'; // yellow-400
    ctx.fillText(userName, canvas.width / 2, 180);

    // Add score circle
    const centerX = canvas.width / 2;
    const centerY = 300;
    const radius = 100;

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();

    // Score arc
    const scoreAngle = (percentage / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, -Math.PI / 2, -Math.PI / 2 + scoreAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#3b82f6' : '#ef4444';
    ctx.stroke();

    // Score text
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`${percentage}%`, centerX, centerY + 10);

    // Score details
    ctx.font = '24px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(`${score} out of ${totalQuestions} correct`, centerX, centerY + 50);

    // Performance level
    let performanceText = '';
    let performanceColor = '';
    if (percentage >= 90) {
      performanceText = 'OUTSTANDING!';
      performanceColor = '#fbbf24';
    } else if (percentage >= 80) {
      performanceText = 'EXCELLENT!';
      performanceColor = '#10b981';
    } else if (percentage >= 60) {
      performanceText = 'GOOD JOB!';
      performanceColor = '#3b82f6';
    } else {
      performanceText = 'KEEP PRACTICING!';
      performanceColor = '#ef4444';
    }

    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = performanceColor;
    ctx.fillText(performanceText, centerX, 450);

    // Add footer
    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('Challenge your friends to beat this score!', centerX, 520);

    // Add timestamp
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(new Date().toLocaleDateString(), centerX, 560);

    setImageGenerated(true);
    setGenerating(false);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `quiz-result-${score}-${totalQuestions}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success('📸 Image downloaded successfully!');
  };

  const shareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.share && navigator.canShare) {
          const file = new File([blob], 'quiz-result.png', { type: 'image/png' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'My Quiz Result',
              text: `I scored ${percentage}% on QuizMaster Pro!`,
              files: [file]
            });
            return;
          }
        }

        // Fallback: copy to clipboard
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast.success('📋 Image copied to clipboard!');
        } else {
          toast.error('Sharing not supported. Try downloading instead.');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share image');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-4xl w-full border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Camera className="w-8 h-8 mr-3 text-purple-400" />
            Share Your Achievement
          </h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="text-center">
          {generating && (
            <div className="mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-white/70">Generating your result image...</p>
            </div>
          )}

          <canvas
            ref={canvasRef}
            className={`max-w-full h-auto rounded-xl shadow-2xl border border-white/20 ${
              generating ? 'opacity-50' : 'opacity-100'
            }`}
            style={{ maxHeight: '400px' }}
          />

          {imageGenerated && (
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={downloadImage}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600/80 text-white rounded-xl hover:bg-green-700/80 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              
              <button
                onClick={shareImage}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600/80 text-white rounded-xl hover:bg-blue-700/80 transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-semibold mb-2">Share Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-white/70">Download as PNG</span>
              </div>
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-blue-400" />
                <span className="text-white/70">Share via System</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-white/70">Copy to Clipboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}