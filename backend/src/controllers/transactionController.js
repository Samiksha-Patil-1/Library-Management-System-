import { getStore, isMySQLActive, getPool } from '../config/db.js';

export const getTransactions = async (req, res) => {
  try {
    const { status = '', search = '', student_id, book_id } = req.query;

    if (isMySQLActive()) {
      const pool = getPool();
      let query = `
        SELECT t.*, s.name as student_name, s.student_code, s.email as student_email, s.avatar_url as student_avatar,
               b.title as book_title, b.author as book_author, b.isbn, b.cover_url as book_cover
        FROM transactions t
        JOIN students s ON t.student_id = s.id
        JOIN books b ON t.book_id = b.id
        WHERE 1=1
      `;
      const params = [];

      if (status && status !== 'All Statuses' && status !== 'All') {
        query += ' AND t.status = ?';
        params.push(status);
      }

      if (student_id) {
        query += ' AND (t.student_id = ? OR s.student_code = ?)';
        params.push(student_id, student_id);
      }

      if (book_id) {
        query += ' AND (t.book_id = ? OR b.isbn = ?)';
        params.push(book_id, book_id);
      }

      if (search) {
        query += ' AND (s.name LIKE ? OR b.title LIKE ? OR t.transaction_code LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
      }

      query += ' ORDER BY t.id DESC';
      const [rows] = await pool.query(query, params);
      return res.json({ success: true, data: rows, total: rows.length });
    } else {
      const store = getStore();
      let list = store.transactions.map(t => {
        const student = store.students.find(s => s.id === t.student_id) || { name: t.student_name || 'Student', student_code: '22401' };
        const book = store.books.find(b => b.id === t.book_id) || { title: t.book_title || 'Book', author: 'Author', cover_url: '' };
        return {
          ...t,
          student_name: student.name,
          student_code: student.student_code,
          student_avatar: student.avatar_url,
          book_title: book.title,
          book_author: book.author,
          book_cover: book.cover_url
        };
      });

      if (status && status !== 'All Statuses' && status !== 'All') {
        list = list.filter(t => t.status.toLowerCase() === status.toLowerCase());
      }

      if (student_id) {
        list = list.filter(t => t.student_id === Number(student_id) || t.student_code === student_id);
      }

      if (book_id) {
        list = list.filter(t => t.book_id === Number(book_id));
      }

      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          t => (t.student_name && t.student_name.toLowerCase().includes(q)) ||
               (t.book_title && t.book_title.toLowerCase().includes(q)) ||
               (t.transaction_code && t.transaction_code.toLowerCase().includes(q))
        );
      }

      return res.json({ success: true, data: list, total: list.length });
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve transactions', error: error.message });
  }
};

export const issueBook = async (req, res) => {
  try {
    const { student_id, student_code, book_id, isbn, issue_date, return_due_date, notes } = req.body;

    if ((!student_id && !student_code) || (!book_id && !isbn)) {
      return res.status(400).json({ success: false, message: 'Student and Book identification are required' });
    }

    const todayStr = issue_date || new Date().toISOString().split('T')[0];
    const dueDateStr = return_due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (isMySQLActive()) {
      const pool = getPool();

      // Find student
      let [students] = await pool.query('SELECT * FROM students WHERE id = ? OR student_code = ?', [student_id || 0, student_code || '']);
      if (students.length === 0) {
        return res.status(404).json({ success: false, message: 'Student not found with provided ID/Code' });
      }
      const student = students[0];

      // Find book
      let [books] = await pool.query('SELECT * FROM books WHERE id = ? OR isbn = ?', [book_id || 0, isbn || '']);
      if (books.length === 0) {
        return res.status(404).json({ success: false, message: 'Book not found with provided ID/ISBN' });
      }
      const book = books[0];

      if (book.available_copies <= 0) {
        return res.status(400).json({ success: false, message: 'Book is currently not available for issue' });
      }

      // Generate transaction code
      const transCode = `10000${Math.floor(10 + Math.random() * 90)}`;

      // Insert transaction
      const [insertResult] = await pool.query(
        `INSERT INTO transactions (transaction_code, student_id, book_id, issue_date, return_due_date, status, fine_amount, notes)
         VALUES (?, ?, ?, ?, ?, 'Issued', 0.00, ?)`,
        [transCode, student.id, book.id, todayStr, dueDateStr, notes || 'Standard checkout']
      );

      // Decrement book available copies
      const newAvailable = book.available_copies - 1;
      const newStatus = newAvailable <= 0 ? 'Issued' : 'Available';
      await pool.query('UPDATE books SET available_copies = ?, status = ? WHERE id = ?', [newAvailable, newStatus, book.id]);

      const [transRows] = await pool.query(
        `SELECT t.*, s.name as student_name, s.student_code, b.title as book_title, b.author as book_author, b.cover_url as book_cover
         FROM transactions t
         JOIN students s ON t.student_id = s.id
         JOIN books b ON t.book_id = b.id
         WHERE t.id = ?`,
        [insertResult.insertId]
      );

      return res.status(201).json({
        success: true,
        message: 'Book issued successfully',
        data: transRows[0]
      });
    } else {
      const store = getStore();

      // Find student
      const student = store.students.find(s =>
        (student_id && s.id === Number(student_id)) ||
        (student_code && s.student_code === String(student_code)) ||
        (req.body.student_name && s.name.toLowerCase() === req.body.student_name.toLowerCase())
      );

      if (!student) {
        return res.status(404).json({ success: false, message: 'Student record not found' });
      }

      // Find book
      const book = store.books.find(b =>
        (book_id && b.id === Number(book_id)) ||
        (isbn && b.isbn === isbn) ||
        (req.body.book_title && b.title.toLowerCase() === req.body.book_title.toLowerCase())
      );

      if (!book) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }

      if (book.available_copies <= 0) {
        return res.status(400).json({ success: false, message: 'No copies of this book are currently available' });
      }

      book.available_copies -= 1;
      if (book.available_copies <= 0) {
        book.status = 'Issued';
      }

      const transCode = `1000${Math.floor(100 + Math.random() * 900)}`;
      const newTransaction = {
        id: store.transactions.length + 1,
        transaction_code: transCode,
        student_id: student.id,
        student_name: student.name,
        student_code: student.student_code,
        student_avatar: student.avatar_url,
        book_id: book.id,
        book_title: book.title,
        book_author: book.author,
        book_cover: book.cover_url,
        issue_date: todayStr,
        return_due_date: dueDateStr,
        returned_at: null,
        status: 'Recent',
        fine_amount: 0.00,
        notes: notes || 'Standard checkout'
      };

      store.transactions.unshift(newTransaction);
      store.stats.issuedBooks += 1;

      return res.status(201).json({
        success: true,
        message: 'Book issued successfully',
        data: newTransaction
      });
    }
  } catch (error) {
    console.error('Error issuing book:', error);
    res.status(500).json({ success: false, message: 'Failed to issue book', error: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const todayStr = new Date().toISOString().split('T')[0];

    if (isMySQLActive()) {
      const pool = getPool();
      const [transRows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [id]);
      if (transRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Transaction record not found' });
      }
      const trans = transRows[0];

      // Calculate overdue fine if returned past due date ($1/day)
      let fine = 0.00;
      const dueDate = new Date(trans.return_due_date);
      const returnDate = new Date(todayStr);
      if (returnDate > dueDate) {
        const diffDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
        fine = Number((diffDays * 1.0).toFixed(2));
      }

      await pool.query(
        'UPDATE transactions SET status = "Returned", returned_at = ?, fine_amount = ? WHERE id = ?',
        [todayStr, fine, id]
      );

      // Increment book copies
      await pool.query(
        'UPDATE books SET available_copies = available_copies + 1, status = "Available" WHERE id = ?',
        [trans.book_id]
      );

      return res.json({
        success: true,
        message: 'Book returned successfully',
        fine_amount: fine
      });
    } else {
      const store = getStore();
      const trans = store.transactions.find(t => t.id === Number(id));
      if (!trans) {
        return res.status(404).json({ success: false, message: 'Transaction record not found' });
      }

      // Calculate overdue fine
      let fine = 0.00;
      const dueDate = new Date(trans.return_due_date);
      const returnDate = new Date(todayStr);
      if (returnDate > dueDate) {
        const diffDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
        fine = Number((diffDays * 1.0).toFixed(2));
      }

      trans.status = 'Returned';
      trans.returned_at = todayStr;
      trans.fine_amount = fine;

      // Update book copies
      const book = store.books.find(b => b.id === trans.book_id);
      if (book) {
        book.available_copies += 1;
        book.status = 'Available';
      }

      store.stats.issuedBooks = Math.max(0, store.stats.issuedBooks - 1);
      if (trans.status === 'Overdue') {
        store.stats.overdueBooks = Math.max(0, store.stats.overdueBooks - 1);
      }

      return res.json({
        success: true,
        message: 'Book returned successfully',
        fine_amount: fine,
        data: trans
      });
    }
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ success: false, message: 'Failed to return book', error: error.message });
  }
};

export const renewBook = async (req, res) => {
  try {
    const { id } = req.params;
    const additionalDays = Number(req.body.days) || 14;

    if (isMySQLActive()) {
      const pool = getPool();
      const [transRows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [id]);
      if (transRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }
      const trans = transRows[0];
      const newDueDate = new Date(new Date(trans.return_due_date).getTime() + additionalDays * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

      await pool.query(
        'UPDATE transactions SET return_due_date = ?, status = "Issued", fine_amount = 0.00 WHERE id = ?',
        [newDueDate, id]
      );

      return res.json({
        success: true,
        message: `Book renewed! New due date is ${newDueDate}`,
        new_due_date: newDueDate
      });
    } else {
      const store = getStore();
      const trans = store.transactions.find(t => t.id === Number(id));
      if (!trans) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      const currentDue = new Date(trans.return_due_date);
      const newDueDate = new Date(currentDue.getTime() + additionalDays * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

      trans.return_due_date = newDueDate;
      trans.status = 'Issued';
      trans.fine_amount = 0.00;

      return res.json({
        success: true,
        message: `Book renewed! Extended by ${additionalDays} days until ${newDueDate}`,
        data: trans
      });
    }
  } catch (error) {
    console.error('Error renewing book:', error);
    res.status(500).json({ success: false, message: 'Failed to renew book', error: error.message });
  }
};
