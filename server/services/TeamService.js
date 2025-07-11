import Team from '../models/Team.js';

class TeamService {
    async createTeam(data) {
        return await Team.create(data);
    }

    async getAllTeams() {
        return await Team.find().populate('adminId', 'name email role');
    }

    async getTeamById(id) {
        return await Team.findById(id).populate('adminId', 'name email role');
    }

    async updateTeam(id, data) {
        return await Team.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteTeam(id) {
        return await Team.findByIdAndDelete(id);
    }
}

export default new TeamService();
