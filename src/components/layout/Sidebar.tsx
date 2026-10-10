import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  UserCheck,
  Users,
  Tags,
  MapPin,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, isAdmin, isStudent } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/student/submit-complaint', label: 'Submit Grievance', icon: PlusCircle },
    { to: '/student/complaints', label: 'My Complaints', icon: FileText },
    { to: '/student/profile', label: 'Student Profile', icon: UserCheck }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'All Complaints', icon: FileText },
    { to: '/admin/students', label: 'Registered Students', icon: Users },
    { to: '/admin/categories', label: 'Categories', icon: Tags },
    { to: '/admin/locations', label: 'Campus Locations', icon: MapPin }
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-65px)]">
      {/* Role descriptor header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        {isAdmin ? (
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            {isAdmin ? 'Administration Portal' : 'Student Workspace'}
          </p>
          <p className="text-sm font-semibold text-slate-800 truncate">
            {user?.name}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile Summary Card */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="text-xs text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>ID:</span>
            <span className="font-mono tabular-nums text-slate-700 font-semibold">{user?.studentId}</span>
          </div>
          <div className="flex justify-between">
            <span>Dept:</span>
            <span className="text-slate-700 font-medium truncate max-w-[130px]">{user?.department}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
