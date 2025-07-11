import express from 'express';
import taskController from '../controllers/TaskController.js';
import validateRequest from '../middlewares/validateRequest.js';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

router.post('/', authorizeRole('ADMIN', 'MANAGER'), validateRequest(createTaskSchema), taskController.create);

router.get('/project/:projectId', taskController.getByProject);

router.put('/:id', authorizeRole('ADMIN', 'MANAGER', 'MEMBER'), validateRequest(updateTaskSchema), taskController.update);

router.delete('/:id', authorizeRole('ADMIN'), taskController.delete);

export default router;
