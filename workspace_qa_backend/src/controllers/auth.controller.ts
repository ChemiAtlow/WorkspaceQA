import { sign } from 'jsonwebtoken';

import { HTTPStatuses } from '../constants';
import {
    BadRequestException,
    HttpException,
    UserExistsException,
    UserNotFoundException,
} from '../exceptions';
import { userModel } from '../models/mongo';
import { appLogger, createUserFromRequest, isValidUser } from '../services';
import { IConroller } from '.';

export const authController: IConroller = {
    register: {
        path: '/resgister',
        method: 'post',
        controller: async (req, res) => {
            // insert only if we have required data
            if (isValidUser(req)) {
                // we can find by username or email because they are unique
                const { email, username } = req.body;
                try {
                    const userByEmail = await userModel.findOne({ email });
                    if (userByEmail) {
                        throw new UserExistsException('email');
                    }
                    const userByName = await userModel.findOne({ username });
                    if (userByName) {
                        throw new UserExistsException('username');
                    }
                    const newUser = createUserFromRequest(req);
                    await newUser?.save();
                    res.send({
                        success: true,
                        user: userModel,
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
            } else {
                appLogger.error('Did not get data for register!');
                throw new BadRequestException('Some user data is lacking!');
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
                    throw new UserNotFoundException(email);
                }
                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    throw new HttpException(
                        HTTPStatuses.unauthorized,
                        'This is the wrong password!'
                    );
                }
                //If we are here, user exists and this is correct password
                const { secret = '', expire = 18000000 } = process.env;
                const token = sign(user.toJSON(), secret, { expiresIn: expire });
                res.send({
                    success: true,
                    user: user,
                    token: `JWT ${token}`,
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
