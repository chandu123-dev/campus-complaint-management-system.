import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { QuickDemoToolbar } from '../components/common/QuickDemoToolbar';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <QuickDemoToolbar />
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">404</h1>
          <h2 className="text-base font-semibold text-slate-800">Page Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page or campus grievance record you are looking for does not exist or has been moved.
          </p>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Portal Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
