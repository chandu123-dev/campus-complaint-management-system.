import bcrypt from 'bcryptjs';
import { dbStore } from '../data/store.js';
import { generateToken } from '../config/jwt.js';

export const register = async (req, res) => {
  try {
    const { name, studentId, email, department, year, password } = req.body;

    if (!name || !studentId || !email || !department || !year || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, studentId, email, department, year, password.'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Check duplicate email
    const existingByEmail = dbStore.findUserByEmail(email);
    if (existingByEmail) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    // Check duplicate studentId
    const existingById = dbStore.findUserByStudentId(studentId);
    if (existingById) {
      return res.status(409).json({ success: false, message: 'An account with this Student ID already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Strictly enforce student role - NEVER allow public admin creation
    const newUser = dbStore.createUser({
      name: name.trim(),
      studentId: studentId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      year: year.trim(),
      passwordHash,
      role: 'student',
      avatarUrl: '/src/assets/images/avatar_student_default_1791611356199.jpg'
    });

    const token = generateToken({ id: newUser._id, role: newUser.role });

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Student account registered successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // Can be email or studentId

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both your identifier (email or student ID) and password.' });
    }

    let user = dbStore.findUserByEmail(identifier.trim());
    if (!user) {
      user = dbStore.findUserByStudentId(identifier.trim());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email/ID or password.' });
    }

    const token = generateToken({ id: user._id, role: user.role });
    const { passwordHash: _, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving user profile.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, department, year, currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    const user = dbStore.findUserById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (department) updates.department = department.trim();
    if (year) updates.year = year.trim();

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to set a new password.' });
      }
      const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      }
      updates.passwordHash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    }

    const updatedUser = dbStore.updateUser(userId, updates);
    const { passwordHash: _, ...safeUser } = updatedUser;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: safeUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Error updating profile.', error: error.message });
  }
};
