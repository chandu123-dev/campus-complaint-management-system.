import React from 'react';
import { ComplaintStatus } from '../../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  // Comply with Zero-Pill & Metadata Discipline:
  // Clean unboxed text with subtle typographic dot/indicator or soft rounded square, never candy pills
  switch (status) {
    case 'Submitted':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" aria-hidden="true" />
          <span>Submitted</span>
        </span>
      );
    case 'Acknowledged':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" aria-hidden="true" />
          <span>Acknowledged</span>
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          <span>In Progress</span>
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
          <span>Resolved</span>
        </span>
      );
    case 'Rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" aria-hidden="true" />
          <span>Rejected</span>
        </span>
      );
    default:
      return <span className={`text-xs text-slate-500 ${className}`}>{status}</span>;
  }
};
