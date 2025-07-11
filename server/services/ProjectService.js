import Project from '../models/Project.js';

class ProjectService {
    async createProject(data) {
        return await Project.create(data);
    }

    async getProjectsByTeam(teamId) {
        return await Project.find({ teamId });
    }

    async deleteProject(id) {
        return await Project.findByIdAndDelete(id);
    }

    async updateProject(id, data) {
        return await Project.findByIdAndUpdate(id, data, { new: true });
    }

    async getProjectById(projectId) {
        return await Project.findById(projectId);
    }

}

export default new ProjectService();
