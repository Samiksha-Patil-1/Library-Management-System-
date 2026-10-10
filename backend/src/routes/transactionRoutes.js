import express from 'express';
import { getTransactions, issueBook, returnBook, renewBook } from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getTransactions);
router.post('/issue', issueBook);
router.post('/:id/return', returnBook);
router.post('/:id/renew', renewBook);

export default router;
