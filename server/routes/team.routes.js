import express from 'express';
import teamController from '../controllers/TeamController.js';
import validateRequest from '../middlewares/validateRequest.js';
import { createTeamSchema } from '../validations/team.validation.js';
import { updateProjectSchema } from '../validations/project.validation.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

router.get('/', authorizeRole('ADMIN', 'MANAGER', 'MEMBER'), teamController.getTeams);
router.post('/', validateRequest(createTeamSchema), authorizeRole("ADMIN"), teamController.create);
router.get('/:id', teamController.getById);
router.put('/:id', validateRequest(updateProjectSchema), authorizeRole("ADMIN", "MANAGER"), teamController.update);
router.delete('/:id', authorizeRole("ADMIN"), teamController.delete);


export default router;
