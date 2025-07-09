'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, Key, UserCheck } from 'lucide-react';
import Logo from '../../../components/Logo';

// Admin credentials - In production, these should be stored securely
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'QuizMaster2024!',
  masterKey: 'QM-ADMIN-2024'
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    masterKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterKey, setShowMasterKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast.error('🔒 Too many failed attempts. Please wait 5 minutes.');
      return;
    }

    if (!credentials.username || !credentials.password || !credentials.masterKey) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify credentials
    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password &&
      credentials.masterKey === ADMIN_CREDENTIALS.masterKey
    ) {
      // Generate admin token (in production, this should be a proper JWT)
      const adminToken = btoa(`${credentials.username}:${Date.now()}`);
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
      
      localStorage.setItem('adminToken', adminToken);
      localStorage.setItem('adminTokenExpiry', expiry.toString());
      localStorage.setItem('adminUsername', credentials.username);
      
      toast.success('🔐 Admin access granted!');
      router.push('/admin/dashboard');
      router.push('/admin/dashboard');
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
        }, 5 * 60 * 1000); // 5 minutes lockout
        toast.error('🚫 Account locked due to multiple failed attempts!');
      } else {
        toast.error(`❌ Invalid credentials. ${3 - newAttempts} attempts remaining.`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-spin"></div>
      </div>

      <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-red-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-red-400/30">
                <Shield className="w-10 h-10 text-red-400" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Lock className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
            Admin Access
          </h1>
          <p className="text-white/70 text-lg">
            Secure Administrative Panel
          </p>
          
          {/* Security Notice */}
          <div className="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-200 text-sm">
                Authorized Personnel Only
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white/90 mb-2">
              Admin Username
            </label>
            <div className="relative group">
              <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 z-10 group-focus-within:text-red-400 transition-colors" />
              <input
                id="username"
                name="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="admin-input w-full pl-10 pr-4 py-3 bg-white/90 border border-white/20 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 text-black placeholder-gray-500 backdrop-blur-sm"
                placeholder="Enter admin username"
                required
                disabled={isLocked}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
              Admin Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 z-10 group-focus-within:text-red-400 transition-colors" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="admin-input w-full pl-10 pr-12 py-3 bg-white/90 border border-white/20 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 text-black placeholder-gray-500 backdrop-blur-sm"
                placeholder="Enter admin password"
                required
                disabled={isLocked}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white z-10 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Master Key */}
          <div>
            <label htmlFor="masterKey" className="block text-sm font-medium text-white/90 mb-2">
              Master Security Key
            </label>
            <div className="relative group">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 z-10 group-focus-within:text-red-400 transition-colors" />
              <input
                id="masterKey"
                name="masterKey"
                type={showMasterKey ? 'text' : 'password'}
                value={credentials.masterKey}
                onChange={(e) => setCredentials(prev => ({ ...prev, masterKey: e.target.value }))}
                className="admin-input w-full pl-10 pr-12 py-3 bg-white/90 border border-white/20 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 text-black placeholder-gray-500 backdrop-blur-sm"
                placeholder="Enter master security key"
                required
                disabled={isLocked}
              />
              <button
                type="button"
                onClick={() => setShowMasterKey(!showMasterKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white z-10 transition-colors"
                tabIndex={-1}
              >
                {showMasterKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Attempts Warning */}
          {loginAttempts > 0 && !isLocked && (
            <div className="p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <p className="text-yellow-200 text-sm">
                  {loginAttempts} failed attempt{loginAttempts > 1 ? 's' : ''}. {3 - loginAttempts} remaining.
                </p>
              </div>
            </div>
          )}

          {/* Lockout Warning */}
          {isLocked && (
            <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-red-400" />
                <p className="text-red-200 text-sm">
                  Account temporarily locked. Please wait 5 minutes.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:via-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Access Admin Panel</span>
                </>
              )}
            </div>
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
          <h3 className="text-blue-300 font-semibold mb-2 flex items-center">
            <Key className="w-4 h-4 mr-2" />
            Alternative Access (if needed)
          </h3>
          <div className="text-blue-200 text-sm space-y-1">
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> QuizMaster2024!</p>
            <p><strong>Master Key:</strong> QM-ADMIN-2024</p>
            <p className="text-blue-300 mt-2"><strong>Note:</strong> Use main login with admin@quizmaster.com for direct access</p>
          </div>
        </div>

        {/* Back to User App */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-white/60 hover:text-white text-sm underline transition-colors"
          >
            ← Back to User App
          </button>
        </div>

        {/* Security Features */}
        <div className="mt-6 text-center">
          <div className="grid grid-cols-3 gap-4 text-xs text-white/60">
            <div className="flex flex-col items-center">
              <Shield className="w-4 h-4 mb-1" />
              <span>Encrypted</span>
            </div>
            <div className="flex flex-col items-center">
              <Lock className="w-4 h-4 mb-1" />
              <span>Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <AlertTriangle className="w-4 h-4 mb-1" />
              <span>Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}