'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import AdminDashboard from '../../../components/admin/AdminDashboard';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('adminToken');
    const adminExpiry = localStorage.getItem('adminTokenExpiry');
    
    if (adminToken && adminExpiry) {
      const now = new Date().getTime();
      const expiry = parseInt(adminExpiry);
      
      if (now < expiry) {
        setIsAuthenticated(true);
      } else {
        // Token expired, clear it and redirect
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiry');
        localStorage.removeItem('adminUsername');
        toast.error('🔒 Session expired. Please login again.');
        router.push('/admin/login');
      }
    } else {
      // No token, redirect to login
      router.push('/admin/login');
    }
    
    setLoading(false);
  }, [router]);

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    localStorage.removeItem('adminUsername');
    toast.success('👋 Admin logged out successfully!');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <AdminDashboard onLogout={handleAdminLogout} />;
}