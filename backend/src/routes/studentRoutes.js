import express from 'express';
import { getStudents, getStudentById, createStudent } from '../controllers/studentController.js';

const router = express.Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);

export default router;
