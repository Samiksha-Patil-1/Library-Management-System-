import express from 'express';
import { getStats, getReports, exportCSV } from '../controllers/reportController.js';

const router = express.Router();

router.get('/stats', getStats);
router.get('/analytics', getReports);
router.get('/export-csv', exportCSV);

export default router;
