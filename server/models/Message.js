import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
