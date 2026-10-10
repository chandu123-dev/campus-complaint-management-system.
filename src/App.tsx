/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { SubmitComplaintPage } from './pages/SubmitComplaintPage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { ComplaintDetailsPage } from './pages/ComplaintDetailsPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageComplaintsPage } from './pages/ManageComplaintsPage';
import { ManageStudentsPage } from './pages/ManageStudentsPage';
import { ManageCategoriesPage } from './pages/ManageCategoriesPage';
import { ManageLocationsPage } from './pages/ManageLocationsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Route Guards
const ProtectedStudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, isStudent, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs text-slate-500">
        Authenticating campus session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs text-slate-500">
        Verifying administrator credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f172a',
            color: '#fff',
            fontSize: '12px',
            borderRadius: '10px'
          }
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedStudentRoute>
                <StudentDashboard />
              </ProtectedStudentRoute>
            }
          />
          <Route
            path="/student/submit-complaint"
            element={
              <ProtectedStudentRoute>
                <SubmitComplaintPage />
              </ProtectedStudentRoute>
            }
          />
          <Route
            path="/student/complaints"
            element={
              <ProtectedStudentRoute>
                <MyComplaintsPage />
              </ProtectedStudentRoute>
            }
          />
          <Route
            path="/student/complaints/:id"
            element={
              <ProtectedStudentRoute>
                <ComplaintDetailsPage />
              </ProtectedStudentRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedStudentRoute>
                <StudentProfilePage />
              </ProtectedStudentRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedAdminRoute>
                <ManageComplaintsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/complaints/:id"
            element={
              <ProtectedAdminRoute>
                <ComplaintDetailsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedAdminRoute>
                <ManageStudentsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedAdminRoute>
                <ManageCategoriesPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/locations"
            element={
              <ProtectedAdminRoute>
                <ManageLocationsPage />
              </ProtectedAdminRoute>
            }
          />

          {/* Generic complaint view */}
          <Route
            path="/complaints/:id"
            element={
              <ProtectedStudentRoute>
                <ComplaintDetailsPage />
              </ProtectedStudentRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
