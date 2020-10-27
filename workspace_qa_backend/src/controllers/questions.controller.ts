import { IConroller } from '.';
import { HTTPStatuses } from '../constants';
import {
    HttpException,
    InternalServerException,
    QuestionNotFoundException,
    UnauthorizedException,
} from '../exceptions';
import { validationMiddleware } from '../middleware';
import { projectModel, questionModel } from '../models/DB/schemas';
import { CreateQuestionDto } from '../models/dtos';
import { appLogger, getSocketIO } from '../services';

export const questionsController: IConroller = {
    createQuestion: {
        path: '/',
        method: 'post',
        authSafe: true,
        middleware: [validationMiddleware(CreateQuestionDto)],
        controller: async (req, res) => {
            const { body, user, projectId } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            const isUserFromProject = user.projects.some((prj) => prj._id.equals(projectId));
            if (!isUserFromProject) {
                throw new UnauthorizedException('You are not a part of this project!');
            }
            const { name, avatar, _id } = user;
            const { title, filePath, message } = body as CreateQuestionDto;
            try {
                const question = new questionModel({
                    title,
                    filePath,
                    project: projectId,
                    question: {
                        message,
                        revisions: [],
                        ratings: {
                            votes: [],
                        },
                        user: {
                            _id,
                            name,
                            avatar,
                        },
                    },
                    answers: [],
                });
                await question.save();
                getSocketIO()
                    .sockets.to(`project${projectId}`)
                    .emit('questions', {
                        action: 'create',
                        question: {
                            _id: question._id,
                            title,
                            project: projectId,
                            state: question.state,
                            answerCount: question.answerCount,
                        },
                    });
                res.status(201).send({ question });
            } catch (err) {
                appLogger.error(err.message);
                throw new InternalServerException('Issue creating question!');
            }
        },
    },
    getAQuestion: {
        path: '/:questionId',
        method: 'get',
        authSafe: true,
        controller: async (req, res) => {
            const { user, projectId, params } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            const isUserFromProject = user.projects.some((prj) => prj._id.equals(projectId));
            if (!isUserFromProject) {
                throw new UnauthorizedException('You are not a part of this project!');
            }
            const { questionId } = params;
            try {
                const question = await questionModel.findById(questionId);
                if (!question) {
                    throw new QuestionNotFoundException(questionId);
                }
                res.send(question);
            } catch (err) {
                appLogger.error(err);
                if (err instanceof HttpException) {
                    throw err;
                }
                throw new InternalServerException('Issue getting question!');
            }
        },
    },
    editQuestion: {
        path: '/:questionId',
        method: 'patch',
        authSafe: true,
        controller: (req, res) => {
            throw new HttpException(HTTPStatuses.notImplemented, 'Route not implemented!');
        },
    },
    addAnswer: {
        path: '/:questionId',
        method: 'patch',
        authSafe: true,
        controller: (req, res) => {
            throw new HttpException(HTTPStatuses.notImplemented, 'Route not implemented!');
        },
    },
};
