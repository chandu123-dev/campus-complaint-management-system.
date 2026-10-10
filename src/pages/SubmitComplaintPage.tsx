import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { complaintService } from '../services/complaintService';
import { categoryService } from '../services/categoryService';
import { locationService } from '../services/locationService';
import { Category, CampusLocation, ComplaintPriority } from '../types';
import {
  Send,
  AlertTriangle,
  Upload,
  Calendar,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export const SubmitComplaintPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          categoryService.getCategories(),
          locationService.getLocations()
        ]);

        const activeCats = (catRes.categories || []).filter((c) => c.isActive);
        const activeLocs = (locRes.locations || []).filter((l) => l.isActive);

        setCategories(activeCats);
        setLocations(activeLocs);

        if (activeCats.length > 0) setCategory(activeCats[0].name);
        if (activeLocs.length > 0) setLocation(activeLocs[0].name);
      } catch (err) {
        toast.error('Failed to load categories or campus locations');
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentUrl(reader.result as string);
        toast.success('Evidence image attached');
      };
      reader.readAsDataURL(file);
    }
  };

  const useSampleEvidence = () => {
    setAttachmentUrl('/src/assets/images/campus_facility_cleanliness_1791611379611.jpg');
    toast.success('Sample facility image attached for preview');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category || !location) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await complaintService.createComplaint({
        title,
        description,
        category,
        location,
        priority,
        attachmentUrl
      });

      if (res.success) {
        toast.success(`Complaint filed successfully! ID: ${res.complaint.complaintId}`);
        navigate(`/student/complaints/${res.complaint._id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Lodge New Grievance"
      subtitle="Report facility, electrical, academic, or hostel issues with official administrative tracking"
    >
      <div className="max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submission Date indicator */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Calendar className="w-4 h-4 text-slate-500" />
              Submission Timestamp
            </span>
            <span className="font-mono tabular-nums font-semibold text-slate-800">
              {new Date().toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Broken laboratory AC unit in Chemistry Lab 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Provide a clear, brief headline summarizing the problem.
            </span>
          </div>

          {/* Category & Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoadingMetadata}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campus Location <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isLoadingMetadata}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {locations.map((loc) => (
                  <option key={loc._id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Urgency & Priority Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Low', 'Medium', 'High', 'Urgent'] as ComplaintPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                    priority === p
                      ? p === 'Urgent'
                        ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-200'
                        : p === 'High'
                        ? 'bg-orange-50 border-orange-500 text-orange-700 ring-2 ring-orange-200'
                        : p === 'Medium'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-200'
                        : 'bg-slate-100 border-slate-500 text-slate-800 ring-2 ring-slate-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Mark "Urgent" only for critical hazards (electrical sparks, severe water leaks, safety risks).
            </span>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the exact location details, room numbers, symptoms, when it occurs, and how it impacts campus operations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Optional Attachment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Evidence Photograph / Attachment (Optional)
            </label>

            {attachmentUrl ? (
              <div className="relative inline-block border border-slate-200 rounded-xl overflow-hidden">
                <img
                  src={attachmentUrl}
                  alt="Complaint evidence preview"
                  className="w-48 h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setAttachmentUrl('')}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-dashed border-slate-300 hover:border-blue-400 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Choose file to upload (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={useSampleEvidence}
                  className="px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  Attach Sample Campus Facility Photo
                </button>
              </div>
            )}
          </div>

          {/* Submission action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Assigned automatically to student affairs triage.
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Grievance...' : 'Submit Grievance'}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
