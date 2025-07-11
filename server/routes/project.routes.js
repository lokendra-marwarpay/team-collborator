import express from 'express';
import projectController from '../controllers/ProjectController.js';
import validateRequest from '../middlewares/validateRequest.js';
import { createProjectSchema, updateProjectSchema } from '../validations/project.validation.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

router.post('/', validateRequest(createProjectSchema), authorizeRole("ADMIN", "MANAGER"), projectController.create);
router.get('/team/:teamId', validateRequest(updateProjectSchema), projectController.getByTeam);
router.get('/:id', projectController.getById);
router.put('/:id', validateRequest(updateProjectSchema), authorizeRole("ADMIN", "MANAGER"), projectController.update);
router.delete('/:id', validateRequest(updateProjectSchema), authorizeRole("ADMIN", "MANAGER"), projectController.delete);

export default router;
