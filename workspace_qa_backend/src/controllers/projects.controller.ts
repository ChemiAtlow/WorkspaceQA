import { IConroller } from '.';
import { InternalServerException } from '../exceptions';
import { validationMiddleware } from '../middleware';
import { CreateProjectDto } from '../models/DB/dtos';
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
            const userProjects = await userModel
                .findById(user._id, 'name username')
                .populate('projects', 'name users.role users.id')
                .exec();
            res.send(userProjects);
        },
    },
    getAProject: {
        path: '/:projectId',
        method: 'get',
        authSafe: true,
        controller: async (req, res) => {
            const { user, params } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            const { projectId } = params;
            const hasProject = user.projects.some((prj) => prj == projectId);
            console.log(hasProject);
            const project = await projectModel.findById(projectId).exec();
            res.send(project);
        },
    },
    create: {
        path: '/',
        method: 'post',
        authSafe: true,
        middleware: [validationMiddleware(CreateProjectDto)],
        controller: async (req, res) => {
            const { body, user } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            const { name, avatar, _id: id } = user;
            const projectData: CreateProjectDto = body;
            try {
                const project = await projectModel.create({
                    ...projectData,
                    questions: [],
                    users: [{ name, avatar, id, role: 'Owner' }],
                });
                user.projects.push(project);
                await user.save();
                res.send(project.toJSON());
            } catch (error) {
                throw new InternalServerException('Issue creating project!');
            }
        },
    },
};
