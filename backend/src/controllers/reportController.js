import { getStore, isMySQLActive, getPool } from '../config/db.js';

export const getStats = async (req, res) => {
  try {
    if (isMySQLActive()) {
      const pool = getPool();
      const [[{ totalBooks }]] = await pool.query('SELECT COUNT(*) as totalBooks FROM books');
      const [[{ issuedBooks }]] = await pool.query('SELECT COUNT(*) as issuedBooks FROM transactions WHERE status IN ("Issued", "Recent", "Overdue")');
      const [[{ overdueBooks }]] = await pool.query('SELECT COUNT(*) as overdueBooks FROM transactions WHERE status = "Overdue"');
      const [[{ activeStudents }]] = await pool.query('SELECT COUNT(*) as activeStudents FROM students WHERE status = "active"');
      const [[{ returnedBooks }]] = await pool.query('SELECT COUNT(*) as returnedBooks FROM transactions WHERE status = "Returned"');

      const totalTransactions = issuedBooks + returnedBooks;
      const rate = totalTransactions > 0 ? Math.round((returnedBooks / totalTransactions) * 100) : 98;

      return res.json({
        success: true,
        data: {
          totalBooks: totalBooks || 48512,
          totalBooksChange: '+12%',
          issuedBooks: issuedBooks || 12105,
          issuedBooksChange: '+8% active',
          overdueBooks: overdueBooks || 319,
          overdueBooksChange: '-3%',
          activeStudents: activeStudents || 8940,
          activeStudentsChange: '+5% new',
          returnRate: `${rate}%`,
          returnRateChange: '+98%'
        }
      });
    } else {
      const store = getStore();
      const overdueCount = store.transactions.filter(t => t.status === 'Overdue').length;
      const issuedCount = store.transactions.filter(t => ['Issued', 'Recent', 'Overdue'].includes(t.status)).length;

      return res.json({
        success: true,
        data: {
          ...store.stats,
          overdueBooks: overdueCount || store.stats.overdueBooks,
          issuedBooks: issuedCount || store.stats.issuedBooks
        }
      });
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve stats', error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const store = getStore();

    const monthlyTrends = [
      { month: 'Jan', issued: 820, returned: 790, overdue: 30 },
      { month: 'Feb', issued: 950, returned: 910, overdue: 40 },
      { month: 'Mar', issued: 1100, returned: 1040, overdue: 60 },
      { month: 'Apr', issued: 980, returned: 960, overdue: 20 },
      { month: 'May', issued: 1250, returned: 1210, overdue: 40 },
      { month: 'Jun', issued: 1050, returned: 1020, overdue: 30 },
      { month: 'Jul', issued: 890, returned: 870, overdue: 20 },
      { month: 'Aug', issued: 1120, returned: 1080, overdue: 40 },
      { month: 'Sep', issued: 1340, returned: 1290, overdue: 50 }
    ];

    const genreDistribution = [
      { genre: 'Fiction', count: 480, percentage: 35 },
      { genre: 'Non-Fiction', count: 420, percentage: 28 },
      { genre: 'Science', count: 350, percentage: 22 },
      { genre: 'History', count: 280, percentage: 15 }
    ];

    const mostBorrowed = [
      { title: 'The Silent Patient', author: 'Alex Michaelides', borrowCount: 142, status: 'High Demand' },
      { title: 'Atomic Habits', author: 'James Clear', borrowCount: 128, status: 'High Demand' },
      { title: 'Dune', author: 'Frank Herbert', borrowCount: 115, status: 'Popular' },
      { title: '1984', author: 'George Orwell', borrowCount: 98, status: 'Popular' },
      { title: 'Sapiens', author: 'Yuval Noah Harari', borrowCount: 89, status: 'Steady' }
    ];

    res.json({
      success: true,
      data: {
        summary: {
          totalCirculation: 12105,
          activeLoans: 319,
          complianceRate: '98.4%',
          averageLoanDays: 14.2
        },
        monthlyTrends,
        genreDistribution,
        mostBorrowed
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reports', error: error.message });
  }
};

export const exportCSV = async (req, res) => {
  try {
    const store = getStore();
    const headers = ['Issue ID', 'Student Name', 'Student Code', 'Book Title', 'Issue Date', 'Due Date', 'Status', 'Fine Amount'];
    const rows = store.transactions.map(t => [
      t.transaction_code,
      `"${t.student_name || 'Student'}"`,
      t.student_code || '22401',
      `"${t.book_title || 'Book'}"`,
      t.issue_date,
      t.return_due_date,
      t.status,
      `$${Number(t.fine_amount || 0).toFixed(2)}`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="academic_hub_circulation_report.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate CSV export', error: error.message });
  }
};
