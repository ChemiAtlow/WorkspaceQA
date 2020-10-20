import { IConroller } from '.';
import { InternalServerException } from '../exceptions';
import { validationMiddleware } from '../middleware';
import { ProjectDto } from '../models/DB/dtos';
import { userModel, projectModel } from '../models/DB/schemas';

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
            const userProjects = await userModel
                .findById(user._id, 'name username')
                .populate('projects', 'name users.role')
                .exec();
            res.send(userProjects);
        },
    },
    create: {
        path: '/',
        method: 'post',
        authSafe: true,
        middleware: [validationMiddleware(ProjectDto)],
        controller: async (req, res) => {
            const { body, user } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            const { name, avatar, _id: id } = user;
            const projectData: ProjectDto = body;
            try {
                const project = await projectModel.create({
                    ...projectData,
                    questions: [],
                    users: [{ name, avatar, id, role: 'Owner' }],
                });
                user.projects.push(project);
                await user.save();
                res.send({ ...project });
            } catch (error) {
                throw new InternalServerException('Issue creating project!');
            }
        },
    },
};
