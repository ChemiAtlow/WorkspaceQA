import { Request } from 'express';
import { HttpException, UserNotFoundException } from '../exceptions';
import { IConroller } from '.';
import { userModel } from '../models/DB/schemas';

export const userControllers: IConroller = {
    getAll: {
        path: '/',
        method: 'get',
        authSafe: true,
        controller: async (req, res) => {
            console.log(req.user);
            const users = await userModel.find().exec();
            res.send(users);
        },
    },
    getSpecific: {
        path: '/:userId',
        method: 'get',
        controller: async (req: Request<{ userId: string }>, res) => {
            let { userId } = req.params;
            userId = userId.trim();
            if (!userId) {
                throw new HttpException(400, 'No user ID provided');
            }
            const user = await userModel.findById(userId).exec();
            if (!user) {
                throw new UserNotFoundException(userId);
            }
            res.send(user);
        },
    },
};
