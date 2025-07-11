import projectService from '../services/ProjectService.js';

class ProjectController {
    async create(req, res, next) {
        try {
            const project = await projectService.createProject(req.body);
            res.status(201).json(project);
        } catch (err) {
            next(err);
        }
    }

    async getByTeam(req, res, next) {
        try {
            const projects = await projectService.getProjectsByTeam(req.params.teamId);
            res.json(projects);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            await projectService.deleteProject(req.params.id);
            res.json({ message: 'Project deleted' });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const updated = await projectService.updateProject(req.params.id, req.body);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const project = await projectService.getProjectById(req.params.id);
            if (!project) return res.status(404).json({ message: 'Project not found' });
            res.json(project);
        } catch (err) {
            next(err);
        }
    }

}

export default new ProjectController();
