import teamService from '../services/TeamService.js';
import userService from '../services/UserService.js';

class TeamController {
    async create(req, res, next) {
        try {
            const { name, description, adminId, memberIds = [] } = req.body;

            const team = await teamService.createTeam({ name, description, adminId });

            await userService.assignUsersToTeam(team._id, [adminId, ...memberIds]);

            res.status(201).json(team);
        } catch (err) {
            next(err);
        }
    }

    async getTeams(req, res, next) {
        try {
            const { role, id } = req.user;

            let teams;
            if (role === 'ADMIN') {
                teams = await teamService.getAllTeams();
            } else {
                const teamId = (await userService.getUserById(id))?.teamId?._id;

                if (!teamId) return res.json([]);
                teams = await teamService.getTeamById([teamId]);
                teams = [teams]
            }

            res.json(teams);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const team = await teamService.getTeamById(req.params.id);
            const members = await userService.getUsersByTeamId(team);

            res.json({
                ...team.toObject(),
                members,
            });
        } catch (err) {
            next(err);
        }
    }


    async update(req, res, next) {
        try {
            const team = await teamService.updateTeam(req.params.id, req.body);
            res.json(team);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const teamId = req.params.id;

            await teamService.deleteTeam(teamId);

            await userService.removeUsersFromTeamByTeamId(teamId);

            res.json({ message: 'Team deleted' });
        } catch (err) {
            next(err);
        }
    }

}

export default new TeamController();
