import { IConroller } from '.';
import { InternalServerException } from '../exceptions';
import { userModel } from '../models/DB/schemas';

export const projectsControllers: IConroller = {
    getUsersProject: {
        path: '/',
        method: 'get',
        authSafe: true,
        controller: async (req, res) => {
            const { user } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            console.log(user.projects);
            const userProjects = await userModel.findById(user._id).populate('projects').exec();
            res.send(userProjects?.projects);
        },
    },
};
