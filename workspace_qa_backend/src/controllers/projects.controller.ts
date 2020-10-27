import { IConroller } from '.';
import {
    HttpException,
    InternalServerException,
    ProjectNotFoundException,
    UnauthorizedException,
} from '../exceptions';
import { validationMiddleware } from '../middleware';
import { CreateProjectDto } from '../models/dtos';
import { userModel, projectModel, questionModel } from '../models/DB/schemas';
import { appLogger, getSocketIO } from '../services';

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
                .populate('projects')
                .exec();
            res.send(userProjects);
        },
    },
    createProject: {
        path: '/',
        method: 'post',
        authSafe: true,
        middleware: [validationMiddleware(CreateProjectDto)],
        controller: async (req, res) => {
            const { body, user } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            const { _id: id } = user;
            const projectData: CreateProjectDto = body;
            try {
                const project = new projectModel({
                    ...projectData,
                    owner: user,
                });
                await project.save();
                await user.updateOne({ $push: { projects: project } }).exec();
                getSocketIO()
                    .sockets.to(`user${id}`)
                    .emit('projects', {
                        action: 'create',
                        project: { ...project.toJSON(), owner: id },
                    });
                res.status(201).send(project.toJSON());
            } catch (error) {
                appLogger.error(error.message);
                throw new InternalServerException('Issue creating project!');
            }
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
            const hasProject = user.projects.some((prj) => prj.equals(projectId));
            if (!hasProject) {
                throw new UnauthorizedException(
                    'Your user is not connected to the requested project!'
                );
            }
            try {
                const project = await projectModel
                    .findOne({
                        _id: projectId,
                        archived: { $ne: true },
                    })
                    .exec();
                const questionsFetch = questionModel
                    .find({ project: { $eq: projectId } })
                    .select('_id title state answers ratings.total')
                    .exec();
                const usersFetch = userModel
                    .find({ projects: project })
                    .select('_id avatar name username')
                    .exec();
                const [questions, users] = await Promise.all([questionsFetch, usersFetch]);
                if (!project) {
                    throw new ProjectNotFoundException(projectId);
                }
                res.send({ ...project.toObject(), questions, users });
            } catch (error) {
                appLogger.error(error.message);
                if (error instanceof HttpException) {
                    throw error;
                }
                throw new InternalServerException('Could not get project from DB!');
            }
        },
    },
    removeProject: {
        path: '/:projectId',
        method: 'delete',
        authSafe: true,
        controller: async (req, res) => {
            const { user, params } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            const { projectId } = params;
            try {
                const project = await projectModel.findOne({
                    _id: projectId,
                    archived: { $ne: true },
                });
                if (!project) {
                    throw new ProjectNotFoundException(projectId);
                }
                const isUserOwnerOfProject = user._id.equals(project.owner);
                if (!isUserOwnerOfProject) {
                    throw new UnauthorizedException('You are not the owner of this project!');
                }
                const projectUpdate = project.updateOne({ archived: true });
                const usersUpdate = userModel
                    .updateMany({ projects: project }, { $pullAll: { projects: [project] } })
                    .exec();
                await Promise.all([projectUpdate, usersUpdate]);
                getSocketIO()
                    .sockets.to(`project${project._id}`)
                    .emit('projects', {
                        action: 'delete',
                        project: { _id: projectId, name: project.name },
                    });
                res.send({ ...project.toObject(), archived: undefined });
            } catch (err) {
                if (err instanceof HttpException) {
                    throw err;
                }
                appLogger.error(err.message);
                throw new InternalServerException('Issue removing project from DB');
            }
        },
    },
    renameProject: {
        path: '/:projectId',
        method: 'patch',
        authSafe: true,
        middleware: [validationMiddleware(CreateProjectDto)],
        controller: async (req, res) => {
            const { body, user, params } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            const projectData: CreateProjectDto = body;
            const { projectId } = params;
            try {
                const project = await projectModel.findOne({
                    _id: projectId,
                    archived: { $ne: true },
                });
                if (!project) {
                    throw new ProjectNotFoundException(projectId);
                }
                const isUserOwnerOfProject = user._id.equals(project.owner);
                if (!isUserOwnerOfProject) {
                    throw new UnauthorizedException('You are not thoe owner of this project');
                }
                await project.updateOne({ ...projectData }).exec();
                getSocketIO()
                    .sockets.to(`project${projectId}`)
                    .emit('projects', {
                        action: 'rename',
                        project: { _id: projectId, ...projectData },
                    });
                res.send({ ...project.toObject(), ...projectData });
            } catch (err) {
                if (err instanceof HttpException) {
                    throw err;
                }
                appLogger.error(err.message);
                throw new InternalServerException('Issue updating project in DB');
            }
        },
    },
};
