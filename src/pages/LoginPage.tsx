import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QuickDemoToolbar } from '../components/common/QuickDemoToolbar';
import { Navbar } from '../components/layout/Navbar';
import { LogIn, KeyRound, User as UserIcon, Shield, GraduationCap, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/dashboard' : '/student/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;

    setIsSubmitting(true);
    const success = await login({ identifier, password });
    setIsSubmitting(false);

    if (success) {
      // Role routing happens via useEffect or direct check
    }
  };

  const fillCredentials = (type: 'student' | 'admin') => {
    if (type === 'admin') {
      setIdentifier('admin@campus.edu');
      setPassword('AdminPassword123!');
    } else {
      setIdentifier('STU2024042');
      setPassword('StudentPassword123!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <QuickDemoToolbar />
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Campus Account Sign In
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your Student ID or institutional email to access grievances
            </p>
          </div>

          {/* Quick Demo Pre-fills */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="block text-xs font-semibold text-slate-500 mb-2">
              Instant Fill for Academic Review:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('student')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-slate-200 hover:border-blue-400 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Fill Student</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-slate-200 hover:border-amber-400 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Fill Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address or Student ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. STU2024042 or user@campus.edu"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>New student without an account? </span>
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
