import { HTTPStatuses } from '../constants';
import { HttpException } from '../exceptions';
import { IConroller } from './controller.model';

export const usersController: IConroller = {
    inviteUser: {
        path: '/invite',
        method: 'post',
        authSafe: true,
        controller: (req, res) => {
            throw new HttpException(HTTPStatuses.notImplemented, 'Route not implemented!');
        },
    },
    acceptInvite: {
        path: '/invite/:inviteToken',
        method: 'get',
        authSafe: true,
        controller: (req, res) => {
            throw new HttpException(HTTPStatuses.notImplemented, 'Route not implemented!');
        },
    },
    removeUser: {
        path: '/:userId',
        method: 'get',
        authSafe: true,
        controller: (req, res) => {
            throw new HttpException(HTTPStatuses.notImplemented, 'Route not implemented!');
        },
    },
};
