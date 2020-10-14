import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { userModel } from '../models/mongo';
import { appLogger } from './appLogger.service';

export const isValidJWTToken = (token: string) => {
    try {
        verify(token, process.env.JWT_SECRET_OR_KEY || '');
        return true;
    } catch (error) {
        appLogger.warning("Invalid token", error);
        return false;
    }
};

// const retrieveToken = (headers:any) => {
//     if (headers && headers.authorization) {
//         const tokens = headers.authorization.split(' ');
//         if (tokens && tokens.length === 2) {
//             return tokens[1];
//         } else {
//             return null;
//         }
//     } else {
//         return null;
//     }
// };

export const isValidUser = (request: Request) => {
    if (request) {
        const email = request.body.email || '';
        const username = request.body.username || '';
        const password = request.body.password || '';
        const firstName = request.body.firstName || '';
        const lastName = request.body.lastName || '';
        if (email && username && password && firstName && lastName) {
            return true;
        }
    }
    return false;
};

export const createUserFromRequest = (request: Request) => {
    if (isValidUser(request)) {
        return new userModel(request.body);
    }
    return null;
};
