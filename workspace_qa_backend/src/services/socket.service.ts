import { Server as HttpServer } from 'http';
import socketIO, { Server } from 'socket.io';
import { QuestionProjectLevel } from '../models/interfaces';

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

const emitter = (
    room: string,
    event: string,
    payload: { action: string; [payload: string]: any }
) => {
    getSocketIO().sockets.to(room).emit(event, payload);
};

export const emitQuestionCreated = (
    projectId: string,
    { title, _id, state, answerCount }: QuestionProjectLevel
) => {
    emitter(`project${projectId}`, 'questions', {
        action: 'create',
        question: { title, _id, state, answerCount, project: projectId },
    });
};

export const emitQuestionEditedAtProjectLevel = (
    projectId: string,
    { title, _id, state, answerCount }: QuestionProjectLevel
) => {
    emitter(`project${projectId}`, 'questions', {
        action: 'edit',
        question: { title, _id, state, answerCount, project: projectId },
    });
};
