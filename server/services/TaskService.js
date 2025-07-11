import Task from '../models/Task.js';

class TaskService {
    async createTask(data) {
        return await Task.create(data);
    }

    async getTasksByProject(projectId) {
        return await Task.find({ projectId }).populate('assignedTo', 'name email');
    }

    async updateTask(id, data) {
        return await Task.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteTask(id) {
        return await Task.findByIdAndDelete(id);
    }
}

export default new TaskService();
