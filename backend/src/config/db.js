import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { initialUsers, initialStudents, initialBooks, initialTransactions, initialStats } from '../seedData.js';

dotenv.config();

let pool = null;
let isUsingMySQL = false;

// Fallback in-memory state if MySQL server is not active
const memoryStore = {
  users: [...initialUsers],
  students: [...initialStudents],
  books: [...initialBooks],
  transactions: [...initialTransactions],
  stats: { ...initialStats },
  reports: [
    {
      id: 1,
      report_type: 'circulation',
      title: 'Circulation & Return Statistics',
      data: {
        totalRecords: 12105,
        overdueCount: 319,
        returnRate: '98%',
        topGenres: [
          { genre: 'Fiction', count: 480 },
          { genre: 'Science', count: 350 },
          { genre: 'History', count: 280 },
          { genre: 'Non-Fiction', count: 420 }
        ],
        monthlyTrends: [
          { month: 'Jan', issued: 820, returned: 790, overdue: 30 },
          { month: 'Feb', issued: 950, returned: 910, overdue: 40 },
          { month: 'Mar', issued: 1100, returned: 1040, overdue: 60 },
          { month: 'Apr', issued: 980, returned: 960, overdue: 20 },
          { month: 'May', issued: 1250, returned: 1210, overdue: 40 },
          { month: 'Jun', issued: 1050, returned: 1020, overdue: 30 }
        ]
      },
      created_at: new Date().toISOString()
    }
  ]
};

// Attempt MySQL connection on startup
export const initializeDatabase = async () => {
  try {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'academic_hub_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000
    };

    pool = mysql.createPool(config);
    // Test connection with a quick query
    const connection = await pool.getConnection();
    console.log(`[Database] Successfully connected to MySQL at ${config.host}:${config.port}/${config.database}`);
    isUsingMySQL = true;
    connection.release();
  } catch (error) {
    console.warn(`[Database] MySQL not reachable on port ${process.env.DB_PORT || 3306} (${error.message}).`);
    console.info(`[Database] Falling back to the integrated in-memory data store with complete academic seed records.`);
    isUsingMySQL = false;
    pool = null;
  }
};

export const getStore = () => memoryStore;
export const isMySQLActive = () => isUsingMySQL;
export const getPool = () => pool;
