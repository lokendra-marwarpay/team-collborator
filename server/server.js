import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

global.io = io;
const PORT = process.env.PORT || 8000;

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('joinTeam', (teamId) => {
        socket.join(teamId);
        console.log(`User joined team room: ${teamId}`);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
