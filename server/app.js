import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import teamRoutes from './routes/team.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import firebaseAuth from './middlewares/firebaseAuth.js';
import messageRoutes from './routes/message.routes.js';

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api', firebaseAuth)
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);

// Global Error Handler (optional)
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

export default app;
