import { Request } from 'express';
import { userModel } from '../models/mongo';

export const isValidUser = (request: Request) => {
    if (request) {
        const { email, username, password, firstName, lastName } = request.body;
        if (email && username && password && firstName && lastName) {
            return true;
        }
    }
    return false;
};

export const createUserFromRequest = (request: Request) =>
    isValidUser(request) ? new userModel(request.body) : null;
