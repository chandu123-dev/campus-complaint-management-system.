import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Shield, GraduationCap, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const QuickDemoToolbar: React.FC = () => {
  const { user, quickLogin } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  const handleQuickSwitch = async (role: 'student' | 'admin') => {
    const success = await quickLogin(role);
    if (success) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset database to clean campus demo state with initial complaints, categories and locations?')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await authService.resetDatabase();
      toast.success(res.message || 'Database reset successfully');
      window.location.reload();
    } catch (err: any) {
      toast.error('Failed to reset database');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="font-semibold text-white tracking-wide">MERN Campus Portal</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span className="text-slate-400">
          Current: <strong className="text-slate-200 font-medium">{user ? `${user.name} (${user.role})` : 'Guest / Not Signed In'}</strong>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 hidden sm:inline">Demo Switcher:</span>
        <button
          onClick={() => handleQuickSwitch('student')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded border border-slate-700 font-medium transition-colors cursor-pointer"
          title="Login as Aanya Sharma (Student)"
        >
          <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
          <span>Student Demo</span>
        </button>

        <button
          onClick={() => handleQuickSwitch('admin')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 font-medium transition-colors cursor-pointer"
          title="Login as Dr. Marcus Vance (Admin)"
        >
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Admin Demo</span>
        </button>

        <button
          onClick={handleReset}
          disabled={isResetting}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-medium transition-colors cursor-pointer disabled:opacity-50"
          title="Reset database to initial seed"
        >
          <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
          <span>Reset DB</span>
        </button>
      </div>
    </div>
  );
};
