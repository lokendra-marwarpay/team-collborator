import Message from '../models/Message.js';

class MessageService {
    async createMessage(data) {
        return await Message.create(data);
    }

    async getMessagesByTeam(teamId) {
        return await Message.find({ teamId })
            .populate('senderId', 'name email')
            .sort({ timestamp: 1 });
    }
}

export default new MessageService();
