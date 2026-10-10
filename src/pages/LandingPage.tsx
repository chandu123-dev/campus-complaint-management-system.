import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QuickDemoToolbar } from '../components/common/QuickDemoToolbar';
import { Navbar } from '../components/layout/Navbar';
import {
  FileCheck2,
  Clock,
  ShieldCheck,
  Building2,
  Zap,
  Droplets,
  Wifi,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, isStudent, isAdmin } = useAuth();

  const campusFeatures = [
    {
      title: 'Direct Administrative Escalation',
      desc: 'All grievances route directly to university deans, facilities coordinators, and campus engineers with auditable tracking.',
      icon: ShieldCheck
    },
    {
      title: 'Transparent Multi-Stage Timeline',
      desc: 'Track your complaint from initial submission to department assignment, progress updates, and resolution sign-off.',
      icon: Clock
    },
    {
      title: 'Role-Based Accountability',
      desc: 'Verified student access coupled with administrative resolution logs prevents duplicate or unverified issues.',
      icon: FileCheck2
    }
  ];

  const primaryCategories = [
    { name: 'Electrical & AC', icon: Zap, count: 'Fast Triage' },
    { name: 'Water & RO Coolers', icon: Droplets, count: 'Sanitation' },
    { name: 'Wi-Fi & Network', icon: Wifi, count: 'IT Operations' },
    { name: 'Infrastructure & Labs', icon: Building2, count: 'Maintenance' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <QuickDemoToolbar />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold text-blue-700 tracking-wider uppercase">
              Official University Student Affairs Portal
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight text-balance">
              Campus Complaint & Facility Resolution System
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              A centralized, transparent platform for university students to voice concerns, report facility malfunctions, and monitor real-time maintenance workflows with complete institutional accountability.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Student Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                  >
                    <span>Register Account</span>
                  </Link>
                </>
              )}
            </div>

            {/* Quiet trust markers adhering to constitution */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% Student Verified
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                24-48hr Average Resolution
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Administrative Transparency
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <img
                src="/src/assets/images/hero_campus_banner_1791611346513.jpg"
                alt="University campus academic pavilions and student library"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                  University Central Campus
                </div>
                <h3 className="text-lg font-bold">The Nexus Center & Academic Quad</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Active monitoring across all lecture blocks, hostels, and scientific facilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How Campus Resolution Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every submission triggers an auditable workflow from registration to administrative closure.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {campusFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Facility Categories */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Supported Campus Categories</h2>
              <p className="text-xs text-slate-500 mt-1">Select any domain when filing your grievance</p>
            </div>
            <Link
              to="/login"
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
            >
              <span>View all categories in portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {primaryCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-blue-700 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{cat.name}</h4>
                    <span className="text-xs text-slate-500">{cat.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-slate-300 font-medium">
            Campus Complaint Management System &copy; {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-6">
            <span>Dean of Student Welfare</span>
            <span aria-hidden="true">·</span>
            <span>Estates & Maintenance Division</span>
            <span aria-hidden="true">·</span>
            <span>IT Services Gateway</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
