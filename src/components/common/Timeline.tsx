import React from 'react';
import { ComplaintStatus, StatusHistoryItem } from '../../types';
import { CheckCircle2, Clock, AlertCircle, XCircle, ArrowRight } from 'lucide-react';

interface TimelineProps {
  currentStatus: ComplaintStatus;
  history: StatusHistoryItem[];
  createdAt: string;
}

const statusStages: ComplaintStatus[] = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved'];

export const Timeline: React.FC<TimelineProps> = ({ currentStatus, history, createdAt }) => {
  const isRejected = currentStatus === 'Rejected';

  const getStageIndex = (status: ComplaintStatus) => {
    if (status === 'Submitted') return 0;
    if (status === 'Acknowledged') return 1;
    if (status === 'In Progress') return 2;
    if (status === 'Resolved') return 3;
    return -1;
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="space-y-6">
      {/* Visual Pipeline Progression (Stage Steps) */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Lifecycle Progression
        </h4>

        {isRejected ? (
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <span className="font-semibold">Complaint Closed as Rejected:</span>
              <span className="ml-1 text-red-700">This grievance was reviewed and marked as rejected by university administration.</span>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center justify-between">
            {/* Background connecting bar */}
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />

            {statusStages.map((stage, idx) => {
              const isCompleted = currentIndex >= idx;
              const isCurrent = currentStatus === stage;

              return (
                <div key={stage} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isCurrent ? 'text-blue-700 font-semibold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Status Event Log */}
      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Status Audit Trail & Remarks
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {history && history.length > 0 ? (
            history.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Node dot */}
                <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-slate-400 group-first:bg-blue-600 ring-4 ring-white" />

                <div className="text-xs text-slate-500 flex items-center gap-2 mb-1">
                  <span className="font-mono tabular-nums text-slate-600">
                    {new Date(item.timestamp).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-slate-700">Updated by {item.updatedBy}</span>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-1">
                  <span>{item.previousStatus}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-blue-600">{item.newStatus}</span>
                </div>

                {item.remarks && (
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80 mt-1.5 leading-relaxed">
                    {item.remarks}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500">
              Submitted on {new Date(createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
