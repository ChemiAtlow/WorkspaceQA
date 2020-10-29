import { HttpException, InternalServerException, UnauthorizedException } from '../exceptions';
import { userFromProjectMiddleware, validationMiddleware } from '../middleware';
import { CreateProjectDto } from '../models/dtos';
import {
    appLogger,
    createProject,
    emitProjectCreated,
    emitProjectEdited,
    emitProjectRemoved,
    getDataProjectLevel,
    getProjectsOfUser,
    isUserProjectOwner,
    removeProject,
    updateProject,
} from '../services';
import { IConroller } from '../models/interfaces';

export const projectsControllers: IConroller = {
    getUsersProject: {
        path: '/',
        method: 'get',
        authSafe: true,
        controller: async (req, res) => {
            try {
                res.send(await getProjectsOfUser(req.user!));
            } catch (err) {
                appLogger.error(err.message);
                if (err instanceof HttpException) {
                    throw err;
                }
                throw new InternalServerException('Issue reading users projects!');
            }
        },
    },
    createProject: {
        path: '/',
        method: 'post',
        authSafe: true,
        middleware: [validationMiddleware(CreateProjectDto)],
        controller: async (req, res) => {
            const { body, user } = req;
            const { _id: id } = user!;
            try {
                const project = await createProject(body, user!);
                const { _id, name } = project;
                emitProjectCreated(id, { _id, name });
                res.status(201).send(project.toJSON());
            } catch (err) {
                appLogger.error(err.message);
                throw new InternalServerException('Issue creating project!');
            }
        },
    },
    getAProject: {
        path: '/:projectId',
        method: 'get',
        authSafe: true,
        middleware: [userFromProjectMiddleware],
        controller: async (req, res) => {
            const {
                params: { projectId },
            } = req;
            try {
                const projectData = await getDataProjectLevel(projectId);
                res.send(projectData);
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
            const {
                user,
                params: { projectId },
            } = req;
            try {
                const project = await isUserProjectOwner(projectId, user!);
                if (!project) {
                    throw new UnauthorizedException('You are not the owner of this project!');
                }
                await removeProject(project);
                emitProjectRemoved({ _id: project._id, name: project.name });
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
        middleware: [userFromProjectMiddleware, validationMiddleware(CreateProjectDto)],
        controller: async (req, res) => {
            const {
                body,
                user,
                params: { projectId },
            } = req;
            try {
                const project = await isUserProjectOwner(projectId, user!);
                if (!project) {
                    throw new UnauthorizedException('You are not the owner of this project!');
                }
                await updateProject(body, project);
                emitProjectEdited({ _id: projectId, name: body.name });
                res.send({ ...project.toObject(), name: body.namr });
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
