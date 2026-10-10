import app from '../backend/src/server.js';
import { initializeDatabase } from '../backend/src/config/db.js';

let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    try {
      await initializeDatabase();
    } catch (e) {
      console.warn('DB initialization error in serverless handler:', e);
    }
    initialized = true;
  }
  return app(req, res);
}
