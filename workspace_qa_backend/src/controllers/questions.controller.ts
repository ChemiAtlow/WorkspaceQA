import { IConroller } from '.';
import { HTTPStatuses } from '../constants';
import {
    HttpException,
    InternalServerException,
    QuestionNotFoundException,
    UnauthorizedException,
} from '../exceptions';
import { validationMiddleware } from '../middleware';
import { questionModel, responseModel } from '../models/DB/schemas';
import { CreateQuestionDto } from '../models/dtos';
import { appLogger, emitQuestionCreated, emitQuestionEditedAtProjectLevel } from '../services';

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
                const questionResponse = new responseModel({
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
                });
                const question = new questionModel({
                    title,
                    filePath,
                    project: projectId,
                    question: questionResponse,
                    answers: [],
                });
                await Promise.all([questionResponse.save(), question.save()]);
                emitQuestionCreated(projectId, {
                    _id: question._id,
                    title: title || '',
                    state: question.state,
                    answerCount: question.answerCount,
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
                const question = await questionModel.findById(questionId).populate('question');
                if (!question) {
                    throw new QuestionNotFoundException(questionId);
                }
                res.send(question);
            } catch (err) {
                appLogger.error(err.message);
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
        middleware: [validationMiddleware(CreateQuestionDto, true)],
        controller: async (req, res) => {
            const { user, projectId, params, body } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            const isUserFromProject = user.projects.some((prj) => prj._id.equals(projectId));
            if (!isUserFromProject) {
                throw new UnauthorizedException('You are not a part of this project!');
            }
            const { questionId } = params;
            try {
                const questionDoc = await questionModel.findById(questionId).populate('question');
                if (!questionDoc) {
                    throw new QuestionNotFoundException(questionId);
                }
                const isQuestionOwner = questionDoc.question.user._id.equals(user._id);
                if (!isQuestionOwner) {
                    throw new UnauthorizedException('You did not write this question!');
                }
                const { filePath, message, title: newTitle } = body as CreateQuestionDto;
                if (message) {
                    questionDoc.question.message = message;
                    await responseModel
                        .updateOne({ _id: questionDoc.question }, { message })
                        .exec();
                }
                if (newTitle || filePath) {
                    questionDoc.title = newTitle || questionDoc.title;
                    questionDoc.filePath = filePath || questionDoc.filePath;
                    await questionDoc.updateOne({ ...questionDoc.toObject() }).exec();
                    const { _id, state, answerCount, title } = questionDoc;
                    emitQuestionEditedAtProjectLevel(projectId, { title, _id, answerCount, state });
                }
                res.send(questionDoc);
            } catch (err) {
                appLogger.error(err.message);
                if (err instanceof HttpException) {
                    throw err;
                }
                throw new InternalServerException('An issue happened while editing question!');
            }
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
