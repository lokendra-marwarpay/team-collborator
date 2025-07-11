import messageService from '../services/MessageService.js';

class MessageController {
    async create(req, res, next) {
        try {
            const { content, teamId } = req.body;

            console.log("🚀 ~ :8 ~ MessageController ~ create ~ teamId:", teamId);

            const senderId = req.user.id;

            const message = await messageService.createMessage({
                content,
                senderId,
                teamId,
                timestamp: new Date(),
            });

            global.io.to(teamId).emit('newMessage', {
                ...message._doc,
                senderId: { _id: req.user._id, name: req.user.name, email: req.user.email },
            });

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    async getByTeam(req, res, next) {
        try {
            const { teamId } = req.params;
            const messages = await messageService.getMessagesByTeam(teamId);
            res.json(messages);
        } catch (err) {
            next(err);
        }
    }
}

export default new MessageController();
