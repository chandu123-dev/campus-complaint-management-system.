import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element wordmark */}
      <Link
        to="/"
        className="text-lg font-bold tracking-tight text-slate-900 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
      >
        Campus Grievance Portal
      </Link>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <Link
          to="/"
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            isActive('/') ? 'text-blue-700 font-semibold' : ''
          }`}
        >
          Home
        </Link>

        {isAuthenticated && isStudent && (
          <>
            <Link
              to="/student/dashboard"
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/student/dashboard') ? 'text-blue-700 font-semibold' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/student/complaints"
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/student/complaints') ? 'text-blue-700 font-semibold' : ''
              }`}
            >
              My Complaints
            </Link>
            <Link
              to="/student/profile"
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/student/profile') ? 'text-blue-700 font-semibold' : ''
              }`}
            >
              Profile
            </Link>
          </>
        )}

        {isAuthenticated && isAdmin && (
          <>
            <Link
              to="/admin/dashboard"
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/admin/dashboard') ? 'text-blue-700 font-semibold' : ''
              }`}
            >
              Admin Dashboard
            </Link>
            <Link
              to="/admin/complaints"
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/admin/complaints') ? 'text-blue-700 font-semibold' : ''
              }`}
            >
              Complaints Queue
            </Link>
            <Link
              to="/admin/students"
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/admin/students') ? 'text-blue-700 font-semibold' : ''
              }`}
            >
              Student Directory
            </Link>
          </>
        )}

        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/login') ? 'text-blue-700 font-semibold' : ''
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/register') ? 'text-blue-700 font-semibold' : ''
              }`}
            >
              Register
            </Link>
          </>
        )}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {isStudent && (
              <Link
                to="/student/submit-complaint"
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
              >
                Submit Complaint
              </Link>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <span className="text-xs text-slate-600 font-medium hidden sm:inline whitespace-nowrap">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Portal Login
          </Link>
        )}
      </div>
    </header>
  );
};
