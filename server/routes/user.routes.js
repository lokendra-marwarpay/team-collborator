import express from 'express';
import userController from '../controllers/UserController.js';
import validateRequest from '../middlewares/validateRequest.js';
import { createUserSchema } from '../validations/user.validation.js';
import firebaseAuth from '../middlewares/firebaseAuth.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

router.get('/', firebaseAuth, userController.getAll);
router.get('/me', firebaseAuth, userController.getUser);
router.post('/', validateRequest(createUserSchema), userController.create);
router.get('/role', firebaseAuth, userController.getRole)
router.patch('/:id', firebaseAuth, authorizeRole("ADMIN"), userController.updateUser);
router.delete('/:id/team', firebaseAuth, authorizeRole("ADMIN"), userController.removeFromTeam);

export default router;
