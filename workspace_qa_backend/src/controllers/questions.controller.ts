import { IConroller } from '.';
import { HttpException, InternalServerException, UnauthorizedException } from '../exceptions';
import { projectModel } from '../models/DB/schemas';
import { appLogger } from '../services';

export const questionsController: IConroller = {
    getQuestion: {
        path: '/',
        method: 'get',
        authSafe: true,
        controller: async (req, res) => {
            const { user, projectId } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            try {
                const project = await projectModel
                    .findOne({
                        _id: projectId,
                        users: { $elemMatch: { id: { $eq: user.id }, role: { $ne: 'Removed' } } },
                    })
                    .select('-users -archived -name');
                if (!project) {
                    throw new UnauthorizedException('You are not a part of this project!');
                }
                res.send(project);
            } catch (error) {
                if (error instanceof HttpException) {
                    throw error;
                }
                appLogger.error(error.message);
                throw new InternalServerException('Issue getting question');
            }
        },
    },
};
