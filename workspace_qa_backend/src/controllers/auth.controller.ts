import { userModel } from '../models/DB/schemas';
import { createJWTToken, getUserDataFromCallback } from '../services';
import { IConroller } from '.';

export const authController: IConroller = {
    githubOauth: {
        path: '/git',
        method: 'post',
        controller: async (req, res) => {
            const { code } = req.body;
            const userData = await getUserDataFromCallback(code);
            const {
                avatar_url: avatar,
                email,
                id: githubId,
                login: username,
                name,
                accessToken,
            } = userData;
            const newUser = await userModel.findOrCreate({
                accessToken,
                avatar,
                email,
                githubId,
                name,
                username,
                projects: [],
            });
            const token = createJWTToken(newUser);
            res.send(token);
        },
    },
};
