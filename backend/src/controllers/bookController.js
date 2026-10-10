import { getStore, isMySQLActive, getPool } from '../config/db.js';

export const getBooks = async (req, res) => {
  try {
    const { search = '', genre = '', status = '', page = 1, limit = 50 } = req.query;

    if (isMySQLActive()) {
      const pool = getPool();
      let query = 'SELECT * FROM books WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (genre && genre !== 'All Subjects' && genre !== 'All') {
        query += ' AND genre = ?';
        params.push(genre);
      }

      if (status && status !== 'All Statuses' && status !== 'All') {
        query += ' AND status = ?';
        params.push(status);
      }

      query += ' ORDER BY id ASC';
      const [rows] = await pool.query(query, params);

      return res.json({
        success: true,
        data: rows,
        total: rows.length
      });
    } else {
      const store = getStore();
      let filtered = [...store.books];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          b => b.title.toLowerCase().includes(q) ||
               b.author.toLowerCase().includes(q) ||
               b.isbn.toLowerCase().includes(q)
        );
      }

      if (genre && genre !== 'All Subjects' && genre !== 'All') {
        filtered = filtered.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
      }

      if (status && status !== 'All Statuses' && status !== 'All') {
        filtered = filtered.filter(b => b.status.toLowerCase() === status.toLowerCase());
      }

      return res.json({
        success: true,
        data: filtered,
        total: filtered.length
      });
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve books', error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMySQLActive()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }
      return res.json({ success: true, data: rows[0] });
    } else {
      const store = getStore();
      const book = store.books.find(b => b.id === Number(id));
      if (!book) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }
      return res.json({ success: true, data: book });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve book', error: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, author, genre, isbn, total_copies = 5, shelf_location = 'Section A-01', description = '', cover_url, published_year = 2024 } = req.body;

    if (!title || !author || !isbn) {
      return res.status(400).json({ success: false, message: 'Title, Author, and ISBN are required' });
    }

    const finalCover = cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop&q=80';
    const copies = Number(total_copies) || 1;

    if (isMySQLActive()) {
      const pool = getPool();
      const [result] = await pool.query(
        `INSERT INTO books (isbn, title, author, genre, status, cover_url, rating, total_copies, available_copies, shelf_location, description, published_year)
         VALUES (?, ?, ?, ?, 'Available', ?, 4.5, ?, ?, ?, ?, ?)`,
        [isbn, title, author, genre || 'General', finalCover, copies, copies, shelf_location, description, published_year]
      );
      const [created] = await pool.query('SELECT * FROM books WHERE id = ?', [result.insertId]);
      return res.status(201).json({ success: true, message: 'Book added successfully', data: created[0] });
    } else {
      const store = getStore();
      const newBook = {
        id: store.books.length + 1,
        isbn,
        title,
        author,
        genre: genre || 'General',
        status: 'Available',
        cover_url: finalCover,
        rating: 4.5,
        total_copies: copies,
        available_copies: copies,
        shelf_location,
        description,
        published_year
      };
      store.books.unshift(newBook);
      store.stats.totalBooks += 1;
      return res.status(201).json({ success: true, message: 'Book added successfully', data: newBook });
    }
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ success: false, message: 'Failed to create book', error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMySQLActive()) {
      const pool = getPool();
      const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
      const values = [...Object.values(updates), id];
      await pool.query(`UPDATE books SET ${fields} WHERE id = ?`, values);
      const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Book updated successfully', data: rows[0] });
    } else {
      const store = getStore();
      const index = store.books.findIndex(b => b.id === Number(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Book not found' });
      }
      store.books[index] = { ...store.books[index], ...updates };
      return res.json({ success: true, message: 'Book updated successfully', data: store.books[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update book', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMySQLActive()) {
      const pool = getPool();
      await pool.query('DELETE FROM books WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Book deleted successfully' });
    } else {
      const store = getStore();
      store.books = store.books.filter(b => b.id !== Number(id));
      store.stats.totalBooks = Math.max(0, store.stats.totalBooks - 1);
      return res.json({ success: true, message: 'Book deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete book', error: error.message });
  }
};
