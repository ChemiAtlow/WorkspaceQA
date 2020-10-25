import { Request, RequestHandler } from 'express';
import { Types } from 'mongoose';
import { IConroller } from '.';
import {
    HttpException,
    InternalServerException,
    ProjectNotFoundException,
    UnauthorizedException,
} from '../exceptions';
import { validationMiddleware } from '../middleware';
import { CreateProjectDto } from '../models/DB/dtos';
import { IUserDocumnet } from '../models/DB/interfaces';
import { userModel, projectModel } from '../models/DB/schemas';
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
                .populate('projects', 'name users.role users.id')
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
                appLogger.info(`user${id}`);
                getSocketIO()
                    .sockets.to(`user${id}`)
                    .emit('projects', {
                        action: 'create',
                        project: {
                            _id: project._id,
                            name: project.name,
                            users: [{ id, role: 'Owner' }],
                        },
                    });
                res.status(201).send(project.toJSON());
            } catch (error) {
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
                    // .findOne({ _id: projectId, users: { $elemMatch: { role: 'Removed' } } })
                    .aggregate([
                        {
                            $match: {
                                _id: Types.ObjectId(projectId),
                                archived: { $ne: true },
                                users: {
                                    $elemMatch: {
                                        $and: [{ role: { $ne: 'Removed' } }],
                                    },
                                },
                            },
                        },
                        { $limit: 1 },
                        {
                            $project: {
                                questions: 1,
                                name: 1,
                                users: {
                                    $filter: {
                                        input: '$users',
                                        as: 'users',
                                        cond: {
                                            $and: [{ $ne: ['$$users.role', 'Removed'] }],
                                        },
                                    },
                                },
                            },
                        },
                    ])
                    .exec();
                res.send(project?.[0]);
            } catch (error) {
                appLogger.error(error.message);
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
                const isOwner = project.users.some(
                    (usr) => user._id.equals(usr.id) && usr.role === 'Owner'
                );
                if (!isOwner) {
                    throw new UnauthorizedException('You are not the owner of this project!');
                }
                const users = await project.archive();
                users.forEach((usr) => {
                    getSocketIO()
                        .sockets.to(`user${usr}`)
                        .emit('projects', {
                            action: 'delete',
                            project: { id: projectId, name: project.name },
                        });
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
            const { _id: id } = user;
            const { projectId } = params;
            try {
                const project = await projectModel
                    .findOne({ _id: projectId, archived: { $ne: true } })
                    .exec();
                if (!project) {
                    throw new ProjectNotFoundException(projectId);
                }
                const isOwnerOrAdmin = project.users.some(
                    (usr) => id.equals(usr.id) && (usr.role === 'Owner' || usr.role === 'Admin')
                );
                if (!isOwnerOrAdmin) {
                    throw new UnauthorizedException('You are not an admin of this project');
                }
                await project.updateOne({ ...projectData }).exec();
                project.users.forEach((usr) => {
                    getSocketIO()
                        .sockets.to(`user${usr.id}`)
                        .emit('projects', {
                            action: 'rename',
                            project: { id: projectId, ...projectData },
                        });
                });
                res.send({ ...project.toObject(), archived: undefined, ...projectData });
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
