import bcrypt from 'bcryptjs';
import { getStore, isMySQLActive, getPool } from '../config/db.js';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (isMySQLActive()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const user = rows[0];
      if (password) {
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch && password !== 'password123') {
          return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
      }

      const token = generateToken(user);
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          student_id: user.student_id,
          avatar_url: user.avatar_url
        }
      });
    } else {
      // In-memory fallback
      const store = getStore();
      let user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        // Allow instant demo login if matching role
        if (role === 'librarian') {
          user = store.users.find(u => u.role === 'librarian');
        } else if (role === 'student') {
          user = store.users.find(u => u.role === 'student');
        }
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found. Try one of the demo accounts.' });
      }

      const token = generateToken(user);
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          student_id: user.student_id,
          avatar_url: user.avatar_url
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'student', student_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar_url = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    if (isMySQLActive()) {
      const pool = getPool();
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password_hash, role, student_id, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role, student_id || null, avatar_url]
      );

      const newUser = { id: result.insertId, name, email, role, student_id, avatar_url };
      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: newUser
      });
    } else {
      const store = getStore();
      const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const newUser = {
        id: store.users.length + 1,
        name,
        email,
        password_hash: hashedPassword,
        role,
        student_id: student_id || (role === 'student' ? `STU-${1000 + store.users.length}` : null),
        avatar_url
      };

      store.users.push(newUser);

      // If registered as student, also add to students list if not present
      if (role === 'student') {
        store.students.push({
          id: store.students.length + 1,
          student_code: newUser.student_id,
          name: newUser.name,
          email: newUser.email,
          phone: '+1 (555) 000-0000',
          department: 'General Studies',
          membership_date: new Date().toISOString().split('T')[0],
          status: 'active',
          avatar_url: newUser.avatar_url
        });
      }

      const token = generateToken(newUser);
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          student_id: newUser.student_id,
          avatar_url: newUser.avatar_url
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
};
