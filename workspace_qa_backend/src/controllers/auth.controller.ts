import { sign } from 'jsonwebtoken';

import { HTTPStatuses } from '../constants';
import {
    BadRequestException,
    HttpException,
    UserExistsException,
    WrongCredentialsException,
} from '../exceptions';
import { userModel } from '../models/mongo';
import { appLogger, createJWTToken, createUserFromRequest, isValidUser } from '../services';
import { IConroller } from '.';

export const authController: IConroller = {
    register: {
        path: '/resgister',
        method: 'post',
        controller: async (req, res) => {
            // Register only if we have required data
            if (!isValidUser(req)) {
                appLogger.error('Did not get data for register!');
                throw new BadRequestException('Some user data is lacking!');
            }
            // we can find by username or email because they are unique
            const { email, username } = req.body;
            try {
                if (await userModel.findOne({ email })) {
                    throw new UserExistsException('email');
                }
                if (await userModel.findOne({ username })) {
                    throw new UserExistsException('username');
                }
                const user = await createUserFromRequest(req)?.save();
                if (!user) {
                    throw new HttpException(
                        HTTPStatuses.internalServerError,
                        'Issue creating user!'
                    );
                }
                const tokenData = createJWTToken(user);
                res.setHeader('Set-Cookie', [tokenData]);
                res.send({
                    success: true,
                    user: { ...user, password: '' },
                });
            } catch (error) {
                if (error instanceof HttpException) {
                    throw error;
                }
                appLogger.error('could not register', error);
                throw new HttpException(
                    HTTPStatuses.internalServerError,
                    'Could not register user!'
                );
            }
        },
    },
    login: {
        path: '/login',
        method: 'post',
        controller: async (req, res) => {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new BadRequestException('Login data not passed!');
            }
            try {
                const user = await userModel.findOne({ email });
                if (!user) {
                    throw new WrongCredentialsException();
                }
                const isPasswordMatching = await user.comparePassword(password);
                if (!isPasswordMatching) {
                    throw new WrongCredentialsException();
                }
                //If we are here, user exists and this is correct password
                const tokenData = createJWTToken(user);
                res.setHeader('Set-Cookie', [tokenData]);
                res.send({
                    success: true,
                    user: { ...user, password: undefined },
                });
            } catch (error) {
                if (error instanceof HttpException) {
                    throw error;
                }
                appLogger.error('could not login', error);
                throw new HttpException(HTTPStatuses.internalServerError, 'Could not login user!');
            }
        },
    },
};
