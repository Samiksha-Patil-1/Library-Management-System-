import { getStore, isMySQLActive, getPool } from '../config/db.js';

export const getStudents = async (req, res) => {
  try {
    const { search = '', department = '' } = req.query;

    if (isMySQLActive()) {
      const pool = getPool();
      let query = 'SELECT * FROM students WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (name LIKE ? OR student_code LIKE ? OR email LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
      }

      if (department) {
        query += ' AND department = ?';
        params.push(department);
      }

      query += ' ORDER BY id ASC';
      const [rows] = await pool.query(query, params);
      return res.json({ success: true, data: rows, total: rows.length });
    } else {
      const store = getStore();
      let filtered = [...store.students];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          s => s.name.toLowerCase().includes(q) ||
               s.student_code.toLowerCase().includes(q) ||
               s.email.toLowerCase().includes(q)
        );
      }

      if (department) {
        filtered = filtered.filter(s => s.department.toLowerCase() === department.toLowerCase());
      }

      return res.json({ success: true, data: filtered, total: filtered.length });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve students', error: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMySQLActive()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM students WHERE id = ? OR student_code = ?', [id, id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      return res.json({ success: true, data: rows[0] });
    } else {
      const store = getStore();
      const student = store.students.find(s => s.id === Number(id) || s.student_code === id);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      return res.json({ success: true, data: student });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve student', error: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, department = 'General Studies', student_code } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const code = student_code || `22${Math.floor(100 + Math.random() * 900)}`;
    const avatar_url = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

    if (isMySQLActive()) {
      const pool = getPool();
      const [result] = await pool.query(
        `INSERT INTO students (student_code, name, email, phone, department, membership_date, status, avatar_url)
         VALUES (?, ?, ?, ?, ?, CURDATE(), 'active', ?)`,
        [code, name, email, phone || '+1 (555) 000-0000', department, avatar_url]
      );
      const [created] = await pool.query('SELECT * FROM students WHERE id = ?', [result.insertId]);
      return res.status(201).json({ success: true, message: 'Student registered successfully', data: created[0] });
    } else {
      const store = getStore();
      const newStudent = {
        id: store.students.length + 1,
        student_code: code,
        name,
        email,
        phone: phone || '+1 (555) 000-0000',
        department,
        membership_date: new Date().toISOString().split('T')[0],
        status: 'active',
        avatar_url
      };
      store.students.push(newStudent);
      store.stats.activeStudents += 1;
      return res.status(201).json({ success: true, message: 'Student registered successfully', data: newStudent });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to register student', error: error.message });
  }
};
