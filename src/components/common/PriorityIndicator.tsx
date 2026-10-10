import React from 'react';
import { ComplaintPriority } from '../../types';

interface PriorityIndicatorProps {
  priority: ComplaintPriority;
  className?: string;
}

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ priority, className = '' }) => {
  switch (priority) {
    case 'Urgent':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold text-red-700 tracking-tight ${className}`}>
          <span className="w-2 h-2 rounded-sm bg-red-600" aria-hidden="true" />
          <span>Urgent</span>
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 tracking-tight ${className}`}>
          <span className="w-2 h-2 rounded-sm bg-orange-500" aria-hidden="true" />
          <span>High</span>
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 tracking-tight ${className}`}>
          <span className="w-2 h-2 rounded-sm bg-amber-400" aria-hidden="true" />
          <span>Medium</span>
        </span>
      );
    case 'Low':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 tracking-tight ${className}`}>
          <span className="w-2 h-2 rounded-sm bg-slate-400" aria-hidden="true" />
          <span>Low</span>
        </span>
      );
    default:
      return <span className={`text-xs text-slate-500 ${className}`}>{priority}</span>;
  }
};
