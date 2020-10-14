import { HTTPStatuses } from '../constants';
import { HttpException } from '../exceptions';
import { userModel } from '../models/mongo';
import { appLogger, createUserFromRequest, isValidUser } from '../services';
import { IConroller } from './controller.model';

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
                    let user = await userModel.findOne({ email });
                    if (user) {
                        throw new HttpException(
                            HTTPStatuses.unauthorized,
                            'User with this email already exists!'
                        );
                    }
                    user = await userModel.findOne({ username });
                    if (user) {
                        throw new HttpException(
                            HTTPStatuses.unauthorized,
                            'User with this username already exists!'
                        );
                    }
                    const newUser = createUserFromRequest(req);
                    await newUser?.save();
                    res.status(HTTPStatuses.ok).send({
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
                throw new HttpException(HTTPStatuses.clientError, 'Some user data is lacking!');
            }
        },
    },
};
