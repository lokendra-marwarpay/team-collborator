import express from 'express';
import messageController from '../controllers/MessageController.js';

const router = express.Router();

router.get('/team/:teamId', messageController.getByTeam);

router.post('/', messageController.create);

export default router;
