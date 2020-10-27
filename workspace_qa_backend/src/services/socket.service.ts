import { Server as HttpServer } from 'http';
import socketIO, { Server } from 'socket.io';
import {
    ProjectUserLevel,
    QuestionProjectLevel,
    SocketSubscription,
    SocketSubscriptionAddRemove,
} from '../models/interfaces';

let io: Server;

export const initSocketIO = (server: HttpServer) => {
    io = socketIO(server);
    io.on('connection', (socket) => {
        socket.on('subscribe', (roomData: SocketSubscription) => {
            socket.leaveAll();
            const { user, projects } = roomData;
            socket.join(`user${user}`);
            projects.forEach((prj) => socket.join(`project${prj._id}`));
        });
        socket.on('subscribeMore', (roomData: SocketSubscriptionAddRemove) => {
            socket.join(`${roomData.type}${roomData.id}`);
        });
        socket.on('subscribeLess', (roomData: SocketSubscriptionAddRemove) => {
            socket.leave(`${roomData.type}${roomData.id}`);
        });
    });
    return io;
};

const getSocketIO = () => {
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

export const emitProjectCreated = (userId: string, { name, _id }: ProjectUserLevel) => {
    emitter(`user${userId}`, 'projects', {
        action: 'create',
        project: { _id, name, owner: userId },
    });
};

export const emitProjectRemoved = ({ _id, name }: ProjectUserLevel) => {
    emitter(`project${_id}`, 'projects', {
        action: 'delete',
        project: { _id, name },
    });
};

export const emitProjectEdited = ({ _id, name }: ProjectUserLevel) => {
    emitter(`project${_id}`, 'projects', {
        action: 'rename',
        project: { _id, name },
    });
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
