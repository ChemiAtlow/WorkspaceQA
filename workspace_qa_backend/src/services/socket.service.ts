import { Server as HttpServer } from 'http';
import socketIO, { Server } from 'socket.io';

let io: Server;

export const init = (server: HttpServer) => {
    io = socketIO(server);
    return io;
};

export const getSocketIO = () => {
    if (!io) {
        throw new Error('Socket not defined!');
    }
    return io;
};
