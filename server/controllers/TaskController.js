import taskService from '../services/TaskService.js';

class TaskController {
    async create(req, res, next) {
        try {
            const task = await taskService.createTask(req.body);
            res.status(201).json(task);
        } catch (err) {
            next(err);
        }
    }

    async getByProject(req, res, next) {
        try {
            const tasks = await taskService.getTasksByProject(req.params.projectId);
            res.json(tasks);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const updated = await taskService.updateTask(req.params.id, req.body);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            await taskService.deleteTask(req.params.id);
            res.json({ message: 'Task deleted' });
        } catch (err) {
            next(err);
        }
    }
}

export default new TaskController();
