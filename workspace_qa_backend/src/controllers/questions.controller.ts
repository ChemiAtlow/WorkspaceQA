import { IConroller } from '.';
import { HttpException, InternalServerException, UnauthorizedException } from '../exceptions';
import { validationMiddleware } from '../middleware';
import { projectModel, questionModel } from '../models/DB/schemas';
import { CreateQuestionDto } from '../models/dtos';
import { appLogger, getSocketIO } from '../services';

export const questionsController: IConroller = {
    getQuestions: {
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
            const { name, avatar, _id } = user;
            const questionData: CreateQuestionDto = body;
            try {
                const project = await projectModel.findOne({
                    _id: projectId,
                    users: { $elemMatch: { id: { $eq: user.id }, role: { $ne: 'Removed' } } },
                });
                if (!project) {
                    throw new UnauthorizedException(
                        'You are not authorized to ask in this project!'
                    );
                }
                const question = new questionModel({
                    title: questionData.title,
                    filePath: questionData.filePath,
                    project,
                    question: {
                        message: questionData.message,
                        revisions: [],
                        user: {
                            _id,
                            name,
                            avatar,
                        },
                    },
                    answers: [],
                });
                project.questions.push({ _id: question, title: questionData.title });
                await Promise.all([question.save(), project.save()]);
                project.users.forEach((usr) => {
                    getSocketIO()
                        .sockets.to(`user${usr.id}`)
                        .emit('questions', {
                            action: 'create',
                            question: {
                                ...question.toObject(),
                            },
                        });
                });
                res.status(201).send(question);
            } catch (err) {
                appLogger.error(err.message);
                if (err instanceof HttpException) {
                    throw err;
                }
                throw new InternalServerException('Issue creating the question!');
            }
        },
    },
};
