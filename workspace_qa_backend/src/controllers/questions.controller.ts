import { HTTPStatuses } from '../constants';
import { HttpException, InternalServerException, UnauthorizedException } from '../exceptions';
import { validationMiddleware } from '../middleware';
import { CreateQuestionDto, ResponseDto } from '../models/dtos';
import { IConroller } from '../models/interfaces';
import {
    addAnswerToQuestion,
    appLogger,
    createQuestion,
    createResponse,
    emitQuestionCreated,
    emitQuestionEditedAtProjectLevel,
    getAnswer,
    getAnswers,
    getQuestion,
    isUserFromProject,
    isUserResponseOwner,
    updateQuestion,
    updateResponse,
} from '../services';

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
            if (!isUserFromProject(user, projectId)) {
                throw new UnauthorizedException('You are not a part of this project!');
            }
            try {
                const questionResponse = createResponse(body, user);
                const question = createQuestion(projectId, body, questionResponse);
                await Promise.all([questionResponse.save(), question.save()]);
                emitQuestionCreated(projectId, {
                    _id: question._id,
                    title: question.title,
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
            const {
                user,
                projectId,
                params: { questionId },
            } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            if (!isUserFromProject(user, projectId)) {
                throw new UnauthorizedException('You are not a part of this project!');
            }
            try {
                const question = await getQuestion(questionId);
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
            const {
                user,
                projectId,
                params: { questionId },
                body,
            } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            if (!isUserFromProject(user, projectId)) {
                throw new UnauthorizedException('You are not a part of this project!');
            }
            try {
                const questionDoc = await getQuestion(questionId);
                if (!isUserResponseOwner(questionDoc.question, user)) {
                    throw new UnauthorizedException('You did not write this question!');
                }
                await updateQuestion(body, questionDoc);
                const { filePath, message, title } = body as CreateQuestionDto;
                if (message || filePath) {
                    //TODO: Update at question level
                }
                if (title) {
                    emitQuestionEditedAtProjectLevel(projectId, questionDoc);
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
    getAnswers: {
        path: '/:questionId/answers',
        method: 'get',
        authSafe: true,
        controller: async (req, res) => {
            const {
                user,
                projectId,
                params: { questionId },
            } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            if (!isUserFromProject(user, projectId)) {
                throw new UnauthorizedException('You are not a part of this project!');
            }
            const answers = await getAnswers(questionId);
            res.send(answers);
        },
    },
    addAnswer: {
        path: '/:questionId/answers',
        method: 'post',
        authSafe: true,
        middleware: [validationMiddleware(ResponseDto)],
        controller: async (req, res) => {
            const {
                body,
                user,
                projectId,
                params: { questionId },
            } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            if (!isUserFromProject(user, projectId)) {
                throw new UnauthorizedException('You are not a part of this project!');
            }
            try {
                const answer = createResponse(body, user);
                await addAnswerToQuestion(questionId, answer);
                //TODO: Emit data at question level, and at project level (answeCount)
                res.send(answer);
            } catch (err) {
                appLogger.error(err.message);
                if (err instanceof HttpException) {
                    throw err;
                }
                throw new InternalServerException('Unknown issue when creating answer!');
            }
        },
    },
    editAnswer: {
        path: '/:questionId/answers/:answerId',
        method: 'patch',
        authSafe: true,
        middleware: [validationMiddleware(ResponseDto)],
        controller: async (req, res) => {
            const {
                body,
                user,
                projectId,
                params: { questionId, answerId },
            } = req;
            if (user === undefined) {
                throw new InternalServerException('An error happened with authentication');
            }
            if (!isUserFromProject(user, projectId)) {
                throw new UnauthorizedException('You are not a part of this project!');
            }
            try {
                const answer = await getAnswer(answerId);
                const edited = await updateResponse(answer, body);
                res.send(edited);
            } catch (err) {
                appLogger.error(err.message);
                if (err instanceof HttpException) {
                    throw err;
                }
                throw new InternalServerException('Unknown issue when editing answer!');
            }
        },
    },
    rateResponse: {
        path: '/rate/:responseId',
        method: 'post',
        authSafe: true,
        controller: (req, res) => {
            throw new HttpException(HTTPStatuses.notImplemented, 'Route not implemented!');
        },
    },
    acceptAnswer: {
        path: '/accept/:responseId',
        method: 'post',
        authSafe: true,
        controller: (req, res) => {
            throw new HttpException(HTTPStatuses.notImplemented, 'Route not implemented!');
        },
    },
};
