import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const DB_FILE = path.join(DATA_DIR, 'campus_db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Initial seed data generator
function getInitialSeedData() {
  const adminSalt = bcrypt.genSaltSync(10);
  const studentSalt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('AdminPassword123!', adminSalt);
  const studentHash = bcrypt.hashSync('StudentPassword123!', studentSalt);

  const adminId = 'usr_admin_01';
  const student1Id = 'usr_stu_01';
  const student2Id = 'usr_stu_02';

  const users = [
    {
      _id: adminId,
      name: 'Dr. Marcus Vance',
      studentId: 'ADM-1001',
      email: 'admin@campus.edu',
      passwordHash: adminHash,
      department: 'Dean of Student Affairs / Administration',
      year: 'Faculty & Admin',
      role: 'admin',
      avatarUrl: '/src/assets/images/avatar_admin_default_1791611367003.jpg',
      createdAt: new Date('2026-08-01T08:00:00Z').toISOString()
    },
    {
      _id: student1Id,
      name: 'Aanya Sharma',
      studentId: 'STU2024042',
      email: 'aanya.sharma@campus.edu',
      passwordHash: studentHash,
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      role: 'student',
      avatarUrl: '/src/assets/images/avatar_student_default_1791611356199.jpg',
      createdAt: new Date('2026-08-15T09:30:00Z').toISOString()
    },
    {
      _id: student2Id,
      name: 'Rohan Patel',
      studentId: 'STU2024108',
      email: 'rohan.patel@campus.edu',
      passwordHash: studentHash,
      department: 'Mechanical Engineering',
      year: '2nd Year',
      role: 'student',
      avatarUrl: '/src/assets/images/avatar_student_default_1791611356199.jpg',
      createdAt: new Date('2026-09-01T10:15:00Z').toISOString()
    }
  ];

  const categories = [
    { _id: 'cat_01', name: 'Infrastructure', description: 'Classrooms, broken desks, doors, windows, and structural issues', isActive: true },
    { _id: 'cat_02', name: 'Electrical', description: 'Lighting, fans, air conditioning, power sockets, and wiring', isActive: true },
    { _id: 'cat_03', name: 'Water Supply', description: 'Drinking water coolers, washroom faucets, and RO filtration', isActive: true },
    { _id: 'cat_04', name: 'Cleanliness', description: 'Restroom sanitation, waste disposal, corridors, and campus hygiene', isActive: true },
    { _id: 'cat_05', name: 'Hostel', description: 'Hostel room repairs, mess food, laundry, and dormitory facilities', isActive: true },
    { _id: 'cat_06', name: 'Library', description: 'Study cubicles, digital catalog access, AC noise, and book availability', isActive: true },
    { _id: 'cat_07', name: 'Laboratory', description: 'Lab apparatus, computers, chemical safety equipment, and software licenses', isActive: true },
    { _id: 'cat_08', name: 'Internet and Wi-Fi', description: 'Campus Wi-Fi connectivity, speed bottlenecks, and login gateway', isActive: true },
    { _id: 'cat_09', name: 'Transportation', description: 'College shuttle buses, route timings, parking, and driver conduct', isActive: true },
    { _id: 'cat_10', name: 'Other', description: 'General grievances and administrative services', isActive: true }
  ];

  const locations = [
    { _id: 'loc_01', name: 'Main Academic Block A', description: 'Lecture Halls 101-405, Dean Offices', isActive: true },
    { _id: 'loc_02', name: 'Science & Engineering Complex', description: 'Labs, Mechanical workshops, CS Labs', isActive: true },
    { _id: 'loc_03', name: 'The Nexus Central Library', description: 'Ground floor reading hall, 2nd floor silent cubicles', isActive: true },
    { _id: 'loc_04', name: 'Boys Hostel Block 3', description: 'Rooms 301-340, North wing', isActive: true },
    { _id: 'loc_05', name: 'Girls Hostel Block 2', description: 'Rooms 201-250, South courtyard', isActive: true },
    { _id: 'loc_06', name: 'Student Dining Hall & Canteen', description: 'Central Mess & Cafeteria zone', isActive: true },
    { _id: 'loc_07', name: 'Sports Arena & Gymnasium', description: 'Indoor courts, outdoor stadium', isActive: true },
    { _id: 'loc_08', name: 'East Campus Parking & Bus Bay', description: 'Shuttle stop and bicycle stands', isActive: true }
  ];

  const complaints = [
    {
      _id: 'cmp_01',
      complaintId: 'CMP-2026-1001',
      title: 'Broken ceiling projector and flickering lighting in Hall 204',
      description: 'The overhead digital projector in Academic Block A (Lecture Hall 204) disconnects every 10 minutes during morning lectures. In addition, the fluorescent light panel directly above the podium flickers loudly, disrupting classes.',
      category: 'Electrical',
      location: 'Main Academic Block A',
      priority: 'High',
      status: 'In Progress',
      student: student1Id,
      assignedDepartment: 'Campus Electrical Works',
      attachmentUrl: '/src/assets/images/campus_facility_cleanliness_1791611379611.jpg',
      adminComments: 'Electrician team dispatched. Replacement ballast ordered and new HDMI extender installed.',
      resolutionNotes: '',
      statusHistory: [
        {
          previousStatus: 'None',
          newStatus: 'Submitted',
          timestamp: new Date('2026-10-02T09:15:00Z').toISOString(),
          updatedBy: 'Aanya Sharma',
          remarks: 'Complaint lodged by student'
        },
        {
          previousStatus: 'Submitted',
          newStatus: 'Acknowledged',
          timestamp: new Date('2026-10-02T11:30:00Z').toISOString(),
          updatedBy: 'Dr. Marcus Vance',
          remarks: 'Assigned to Electrical maintenance supervisor'
        },
        {
          previousStatus: 'Acknowledged',
          newStatus: 'In Progress',
          timestamp: new Date('2026-10-03T14:00:00Z').toISOString(),
          updatedBy: 'Dr. Marcus Vance',
          remarks: 'Work order #EW-409 generated, parts under replacement'
        }
      ],
      createdAt: new Date('2026-10-02T09:15:00Z').toISOString(),
      updatedAt: new Date('2026-10-03T14:00:00Z').toISOString()
    },
    {
      _id: 'cmp_02',
      complaintId: 'CMP-2026-1002',
      title: 'Water cooler leaking and filter replacement overdue',
      description: 'The drinking water cooler on the 2nd floor of Nexus Library is leaking water onto the tile walkway, posing a slipping hazard. The filter indicator also shows red.',
      category: 'Water Supply',
      location: 'The Nexus Central Library',
      priority: 'Urgent',
      status: 'Resolved',
      student: student1Id,
      assignedDepartment: 'Facilities & Sanitation',
      attachmentUrl: '',
      adminComments: 'Plumbing contractor serviced the unit and installed dual-stage filter.',
      resolutionNotes: 'Drain pipe leak fixed, RO membrane replaced, leak sensor tested and certified clean on Oct 4.',
      statusHistory: [
        {
          previousStatus: 'None',
          newStatus: 'Submitted',
          timestamp: new Date('2026-10-03T08:20:00Z').toISOString(),
          updatedBy: 'Aanya Sharma',
          remarks: 'Water leakage reported'
        },
        {
          previousStatus: 'Submitted',
          newStatus: 'In Progress',
          timestamp: new Date('2026-10-03T10:00:00Z').toISOString(),
          updatedBy: 'Dr. Marcus Vance',
          remarks: 'Priority plumbing dispatched'
        },
        {
          previousStatus: 'In Progress',
          newStatus: 'Resolved',
          timestamp: new Date('2026-10-04T16:45:00Z').toISOString(),
          updatedBy: 'Dr. Marcus Vance',
          remarks: 'Filters replaced and water test report verified'
        }
      ],
      createdAt: new Date('2026-10-03T08:20:00Z').toISOString(),
      updatedAt: new Date('2026-10-04T16:45:00Z').toISOString()
    },
    {
      _id: 'cmp_03',
      complaintId: 'CMP-2026-1003',
      title: 'Wi-Fi gateway dropouts in CS Computer Lab 3',
      description: 'High packet loss and intermittent DNS failure when connecting more than 20 workstations to the lab access point. Causes compiler timeouts during practical exams.',
      category: 'Internet and Wi-Fi',
      location: 'Science & Engineering Complex',
      priority: 'Urgent',
      status: 'Submitted',
      student: student1Id,
      assignedDepartment: 'IT Network Operations',
      attachmentUrl: '',
      adminComments: '',
      resolutionNotes: '',
      statusHistory: [
        {
          previousStatus: 'None',
          newStatus: 'Submitted',
          timestamp: new Date('2026-10-08T11:40:00Z').toISOString(),
          updatedBy: 'Aanya Sharma',
          remarks: 'Complaint registered'
        }
      ],
      createdAt: new Date('2026-10-08T11:40:00Z').toISOString(),
      updatedAt: new Date('2026-10-08T11:40:00Z').toISOString()
    },
    {
      _id: 'cmp_04',
      complaintId: 'CMP-2026-1004',
      title: 'Broken window latch in Hostel Block 3 Room 314',
      description: 'The south-facing window latch is snapped and rattles violently in high wind. Water enters during heavy rain.',
      category: 'Hostel',
      location: 'Boys Hostel Block 3',
      priority: 'Medium',
      status: 'Acknowledged',
      student: student2Id,
      assignedDepartment: 'Hostel Wardens & Maintenance',
      attachmentUrl: '',
      adminComments: 'Hostel warden notified; carpenter will inspect on Friday morning.',
      resolutionNotes: '',
      statusHistory: [
        {
          previousStatus: 'None',
          newStatus: 'Submitted',
          timestamp: new Date('2026-10-05T14:10:00Z').toISOString(),
          updatedBy: 'Rohan Patel',
          remarks: 'Initial report'
        },
        {
          previousStatus: 'Submitted',
          newStatus: 'Acknowledged',
          timestamp: new Date('2026-10-06T09:00:00Z').toISOString(),
          updatedBy: 'Dr. Marcus Vance',
          remarks: 'Inspected by caretaker'
        }
      ],
      createdAt: new Date('2026-10-05T14:10:00Z').toISOString(),
      updatedAt: new Date('2026-10-06T09:00:00Z').toISOString()
    },
    {
      _id: 'cmp_05',
      complaintId: 'CMP-2026-1005',
      title: 'Inadequate trash receptacles outside Student Dining Hall',
      description: 'During lunch hours (12 PM to 2 PM), waste containers overflow rapidly, leading to litter on the lawn.',
      category: 'Cleanliness',
      location: 'Student Dining Hall & Canteen',
      priority: 'Low',
      status: 'Rejected',
      student: student2Id,
      assignedDepartment: 'Facilities & Sanitation',
      attachmentUrl: '',
      adminComments: 'New 120-liter segregated waste bins were already installed yesterday as part of the green campus initiative.',
      resolutionNotes: 'Duplicate issue addressed by campus-wide rollout of color-coded receptacles.',
      statusHistory: [
        {
          previousStatus: 'None',
          newStatus: 'Submitted',
          timestamp: new Date('2026-10-04T12:30:00Z').toISOString(),
          updatedBy: 'Rohan Patel',
          remarks: 'Submitted'
        },
        {
          previousStatus: 'Submitted',
          newStatus: 'Rejected',
          timestamp: new Date('2026-10-05T11:00:00Z').toISOString(),
          updatedBy: 'Dr. Marcus Vance',
          remarks: 'Already implemented under university green campus phase 2'
        }
      ],
      createdAt: new Date('2026-10-04T12:30:00Z').toISOString(),
      updatedAt: new Date('2026-10-05T11:00:00Z').toISOString()
    }
  ];

  return { users, categories, locations, complaints };
}

class DatabaseStore {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.resetToSeed();
      }
    } catch (err) {
      console.error('Error loading database file, re-initializing seed:', err);
      this.resetToSeed();
    }
  }

  resetToSeed() {
    this.data = getInitialSeedData();
    this.save();
    return this.data;
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database store:', err);
    }
  }

  // Collection access
  collection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }

  // Users
  findUserById(id) {
    return this.collection('users').find(u => u._id === id || u.studentId === id);
  }

  findUserByEmail(email) {
    return this.collection('users').find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserByStudentId(studentId) {
    return this.collection('users').find(u => u.studentId.toUpperCase() === studentId.toUpperCase());
  }

  createUser(userData) {
    const newUser = {
      _id: generateId('usr'),
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.collection('users').push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id, updates) {
    const index = this.collection('users').findIndex(u => u._id === id);
    if (index === -1) return null;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.save();
    return this.data.users[index];
  }

  // Complaints
  getComplaints(filters = {}) {
    let list = [...this.collection('complaints')];

    if (filters.student) {
      list = list.filter(c => c.student === filters.student);
    }
    if (filters.status && filters.status !== 'All') {
      list = list.filter(c => c.status === filters.status);
    }
    if (filters.priority && filters.priority !== 'All') {
      list = list.filter(c => c.priority === filters.priority);
    }
    if (filters.category && filters.category !== 'All') {
      list = list.filter(c => c.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.complaintId.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }

    // Sort descending by createdAt by default
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Populate student field with student data
    return list.map(c => {
      const studentObj = this.findUserById(c.student);
      return {
        ...c,
        studentDetails: studentObj
          ? {
              _id: studentObj._id,
              name: studentObj.name,
              studentId: studentObj.studentId,
              email: studentObj.email,
              department: studentObj.department,
              year: studentObj.year
            }
          : null
      };
    });
  }

  findComplaintById(id) {
    const complaint = this.collection('complaints').find(c => c._id === id || c.complaintId === id);
    if (!complaint) return null;
    const studentObj = this.findUserById(complaint.student);
    return {
      ...complaint,
      studentDetails: studentObj
        ? {
            _id: studentObj._id,
            name: studentObj.name,
            studentId: studentObj.studentId,
            email: studentObj.email,
            department: studentObj.department,
            year: studentObj.year
          }
        : null
    };
  }

  createComplaint(complaintData) {
    const year = new Date().getFullYear();
    const count = this.collection('complaints').length + 1001;
    const complaintId = `CMP-${year}-${count}`;

    const newComplaint = {
      _id: generateId('cmp'),
      complaintId,
      assignedDepartment: 'General Administration',
      adminComments: '',
      resolutionNotes: '',
      status: 'Submitted',
      statusHistory: [
        {
          previousStatus: 'None',
          newStatus: 'Submitted',
          timestamp: new Date().toISOString(),
          updatedBy: complaintData.studentName || 'Student',
          remarks: 'Complaint registered successfully'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...complaintData
    };

    delete newComplaint.studentName;

    this.collection('complaints').push(newComplaint);
    this.save();
    return this.findComplaintById(newComplaint._id);
  }

  updateComplaint(id, updates) {
    const index = this.collection('complaints').findIndex(c => c._id === id || c.complaintId === id);
    if (index === -1) return null;

    const current = this.data.complaints[index];
    this.data.complaints[index] = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.findComplaintById(this.data.complaints[index]._id);
  }

  deleteComplaint(id) {
    const index = this.collection('complaints').findIndex(c => c._id === id || c.complaintId === id);
    if (index === -1) return false;
    this.data.complaints.splice(index, 1);
    this.save();
    return true;
  }

  // Categories
  getCategories() {
    return this.collection('categories');
  }

  createCategory(categoryData) {
    const newCat = {
      _id: generateId('cat'),
      isActive: true,
      ...categoryData
    };
    this.collection('categories').push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id, updates) {
    const index = this.collection('categories').findIndex(c => c._id === id);
    if (index === -1) return null;
    this.data.categories[index] = { ...this.data.categories[index], ...updates };
    this.save();
    return this.data.categories[index];
  }

  deleteCategory(id) {
    const index = this.collection('categories').findIndex(c => c._id === id);
    if (index === -1) return false;
    this.data.categories.splice(index, 1);
    this.save();
    return true;
  }

  // Locations
  getLocations() {
    return this.collection('locations');
  }

  createLocation(locationData) {
    const newLoc = {
      _id: generateId('loc'),
      isActive: true,
      ...locationData
    };
    this.collection('locations').push(newLoc);
    this.save();
    return newLoc;
  }

  updateLocation(id, updates) {
    const index = this.collection('locations').findIndex(l => l._id === id);
    if (index === -1) return null;
    this.data.locations[index] = { ...this.data.locations[index], ...updates };
    this.save();
    return this.data.locations[index];
  }

  deleteLocation(id) {
    const index = this.collection('locations').findIndex(l => l._id === id);
    if (index === -1) return false;
    this.data.locations.splice(index, 1);
    this.save();
    return true;
  }
}

export const dbStore = new DatabaseStore();
