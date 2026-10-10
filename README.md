# Campus Complaint Management System (MERN Stack)

A complete, modern, full-stack college grievance management system built with React (Vite), Node.js, Express, and MongoDB/JSON Document Store, featuring role-based access control (RBAC), multi-stage lifecycle tracking, and an administrative command center.

---

## 🏛️ System Overview

The **Campus Complaint Management System** enables university students to voice concerns, report facility malfunctions, and monitor real-time maintenance workflows with institutional accountability. College administrators can triage, assign tasks to departments, track progress timelines, document official resolutions, and manage campus facilities.

### Key Highlights
- **Role-Based Access Control (RBAC)**: Distinct permissions for Students and Administrators with secure JWT authentication and bcrypt password hashing.
- **Auditable Status Progression**: Real-time status transitions: `Submitted` ➔ `Acknowledged` ➔ `In Progress` ➔ `Resolved` (or `Rejected`), with complete audit logs and administrator remarks.
- **Administrative Command Center**: Comprehensive metrics, Recharts workload analytics by category and status, high-priority emergency queue, and department assignment.
- **Zero-Pill Minimalist UI**: High-legibility typographic design adhering to modern frontend guidelines with tabular figures for numbers and dates.
- **Dual-Mode Backend**: Can run embedded within the Vite dev server for instant zero-config cloud development, or as a standalone Express server on port 5000.

---

## 🚀 Quick Start & Demo Accounts

The database comes pre-seeded with verified test accounts:

| Role | Name | Email / Student ID | Password | Access Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | Dr. Marcus Vance | `admin@campus.edu` / `ADM-1001` | `AdminPassword123!` | Full admin dashboard, triage queue, student directory, category & location management |
| **Student** | Aanya Sharma | `aanya.sharma@campus.edu` / `STU2024042` | `StudentPassword123!` | Submit complaints, view personal grievances, track status timeline, update student profile |
| **Student** | Rohan Patel | `rohan.patel@campus.edu` / `STU2024108` | `StudentPassword123!` | Submit complaints, track status |

*Tip: Use the **Demo Switcher** at the very top of the app to switch roles with a single click.*

---

## ⚙️ Project Structure

```
campus-complaint-management/
├── server/
│   ├── config/             # JWT and Database configurations
│   ├── controllers/        # Auth, Complaint, Admin, Category, Location controllers
│   ├── data/               # Persistent database store & seed data (JSON/Mongo)
│   ├── middleware/         # JWT authentication & Role-based authorization
│   ├── models/             # Mongoose schemas (User, Complaint, Category, Location)
│   ├── routes/             # REST API routes (/api/auth, /api/complaints, etc.)
│   ├── scripts/            # Database seed script (node scripts/seed.js)
│   ├── test/               # Automated integration tests (node test/api.test.js)
│   ├── app.js              # Express app initialization & route mounts
│   ├── server.js           # Standalone Express server runner (Port 5000)
│   ├── package.json        # Server dependencies
│   └── .env.example        # Server environment variables
├── src/
│   ├── assets/             # Campus images and avatars
│   ├── components/
│   │   ├── common/         # StatusBadge, PriorityIndicator, Timeline, QuickDemoToolbar
│   │   └── layout/         # Navbar (Top Bar Contract), Sidebar, DashboardLayout
│   ├── context/            # AuthContext (React context for user session)
│   ├── pages/              # All 14 application pages
│   ├── services/           # Axios API services (auth, complaint, admin, etc.)
│   ├── types/              # TypeScript interfaces and models
│   ├── App.tsx             # Route definitions and route guards
│   ├── main.tsx            # React root mount
│   └── index.css           # Tailwind CSS styles
├── package.json
└── vite.config.ts
```

---

## 🛠️ Installation & Execution

### 1. Running in Development (Unified Mode)
In this repository, the Express backend is integrated directly into the dev server via Vite middleware:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Running Backend as Standalone Service
If deploying the backend separately on port 5000:
```bash
# Start standalone Express backend on port 5000
npm run server
# Or: node server/server.js
```

### 3. Running Automated API Tests
Run the comprehensive test suite verifying authentication, student submission, admin triage, and analytics:
```bash
node server/test/api.test.js
```

---

## 📡 REST API Documentation

### Authentication Endpoints
- `POST /api/auth/register` — Register a verified student account.
- `POST /api/auth/login` — Sign in using email or student ID.
- `GET /api/auth/me` — Retrieve current authenticated profile (Requires Bearer token).
- `PUT /api/auth/profile` — Update user name, department, year, or change password.

### Complaint Endpoints
- `POST /api/complaints` — Submit a grievance with title, description, category, location, priority.
- `GET /api/complaints` — Retrieve complaints (filtered to the student's records if logged in as student).
- `GET /api/complaints/:id` — View details, timeline, and administrative comments.
- `PUT /api/complaints/:id` — Update complaint (Allowed only when status is `Submitted`).
- `DELETE /api/complaints/:id` — Withdraw complaint (Allowed only when status is `Submitted`).
- `PATCH /api/complaints/:id/status` — *(Admin Only)* Transition status and append to audit history.

### Admin Endpoints
- `GET /api/admin/dashboard` — Live metrics, resolution rates, Recharts aggregations.
- `GET /api/admin/students` — Complete student directory with individual complaint counters.
- `GET /api/admin/complaints` — Full campus complaint registry with multi-column filtering.
- `PATCH /api/admin/complaints/:id/assign` — Assign department or maintenance crew.
- `PATCH /api/admin/complaints/:id/resolve` — Document official resolution notes and close grievance.

### Categories & Campus Locations
- `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`
- `GET /api/locations`, `POST /api/locations`, `PUT /api/locations/:id`, `DELETE /api/locations/:id`

---

## 🔐 Security Features
- **Password Protection**: Passwords salted and hashed with `bcryptjs`.
- **JWT Protection**: Authenticated endpoints verified via `jsonwebtoken`.
- **Anti-Privilege Escalation**: Public registration strictly assigns the `student` role. Admin routes are guarded by `authorizeRole('admin')`.
- **Isolation of Student Records**: Students can only inspect or modify their own submissions.
