import User from '../models/User.js';

class UserService {
    async getUserByEmail(email) {
        return await User.findOne({ email });
    }

    async createUser({ email, role, name }) {
        return await User.create({ email, role, name });
    }

    async getAllUsers() {
        return await User.find().populate('teamId');
    }

    async getUserById(id) {
        return await User.findById(id).populate('teamId').lean();
    }

    async updateUser(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }

    async getUserRoleByEmail(email) {
        const user = await User.findOne({ email });
        return user?.role || null;
    }

    async assignUsersToTeam(teamId, userIds) {
        if (!teamId || !userIds || !Array.isArray(userIds)) return;

        await User.updateMany(
            { _id: { $in: userIds } },
            { $set: { teamId } }
        );
    }

    async removeUsersFromTeam(userIds) {
        if (!userIds || !Array.isArray(userIds)) return;

        await User.updateMany(
            { _id: { $in: userIds } },
            { $unset: { teamId: '' } }
        );
    }

    async getUsersByTeamId(team) {
        if (!team || !team._id) return [];

        return await User.find({
            teamId: team._id,
            _id: { $ne: team.adminId._id },
        }).populate('name email role');
    }

    async removeUsersFromTeamByTeamId(teamId) {
        await User.updateMany({ teamId }, { $unset: { teamId: '' } });
    }

}

export default new UserService();
