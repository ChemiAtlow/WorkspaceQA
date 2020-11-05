import { HTTPStatuses } from '../constants';
import { HttpException, InternalServerException, UnauthorizedException } from '../exceptions';
import { userFromProjectMiddleware, validationMiddleware } from '../middleware';
import { CreateQuestionDto, RateDto, ResponseDto } from '../models/dtos';
import { IConroller } from '../models/interfaces';
import {
    addAnswerToQuestion,
    appLogger,
    createQuestion,
    createResponse,
    emitQuestionCreated,
    emitQuestionEditedAtProjectLevel,
    getResponse,
    getAnswers,
    getQuestion,
    isUserResponseOwner,
    updateQuestion,
    updateResponse,
    rateResponse,
    acceptAnswer,
} from '../services';

export const questionsController: IConroller = {
    createQuestion: {
        path: '/',
        method: 'post',
        authSafe: true,
        middleware: [userFromProjectMiddleware, validationMiddleware(CreateQuestionDto)],
        controller: async (req, res) => {
            const { body, user, projectId } = req;
            try {
                const questionResponse = createResponse(body, user!);
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
        middleware: [userFromProjectMiddleware],
        controller: async (req, res) => {
            const {
                params: { questionId },
            } = req;
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
        middleware: [userFromProjectMiddleware, validationMiddleware(CreateQuestionDto, true)],
        controller: async (req, res) => {
            const {
                user,
                projectId,
                params: { questionId },
                body,
            } = req;
            try {
                const questionDoc = await getQuestion(questionId);
                if (!isUserResponseOwner(questionDoc.question, user!)) {
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
        middleware: [userFromProjectMiddleware],
        controller: async (req, res) => {
            const {
                params: { questionId },
            } = req;
            try {
                const answers = await getAnswers(questionId);
                res.send(answers);
            } catch (err) {
                appLogger.error(err.message);
                if (err instanceof HttpException) {
                    throw err;
                }
                throw new InternalServerException('Unknown issue finding answers!');
            }
        },
    },
    addAnswer: {
        path: '/:questionId/answers',
        method: 'post',
        authSafe: true,
        middleware: [userFromProjectMiddleware, validationMiddleware(ResponseDto)],
        controller: async (req, res) => {
            const {
                body,
                user,
                params: { questionId },
            } = req;
            try {
                const answer = createResponse(body, user!);
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
        middleware: [userFromProjectMiddleware, validationMiddleware(ResponseDto)],
        controller: async (req, res) => {
            const {
                body,
                user,
                params: { answerId },
            } = req;
            try {
                const answer = await getResponse(answerId);
                if (!isUserResponseOwner(answer, user!)) {
                    throw new UnauthorizedException('This is not your answer!');
                }
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
        middleware: [userFromProjectMiddleware, validationMiddleware(RateDto)],
        controller: async (req, res) => {
            const {
                body,
                user,
                params: { responseId },
            } = req;
            try {
                const responseDoc = await getResponse(responseId);
                if (isUserResponseOwner(responseDoc, user!)) {
                    throw new UnauthorizedException(
                        'You cannot rate your own question / answer :)'
                    );
                }
                await rateResponse(responseDoc, body, user!);
                res.send({ msg: 'Rating success' });
            } catch (err) {
                appLogger.error(err.message);
                if (err instanceof HttpException) {
                    throw err;
                }
                throw new InternalServerException('Unknown issue when rating question/answer!');
            }
        },
    },
    acceptAnswer: {
        path: '/:questionId/answers/accept/:responseId',
        method: 'post',
        authSafe: true,
        middleware: [userFromProjectMiddleware],
        controller: async (req, res) => {
            const {
                user,
                params: { questionId, responseId },
            } = req;
            try {
                const questionDoc = await getQuestion(questionId);
                if (!isUserResponseOwner(questionDoc.question, user!)) {
                    throw new UnauthorizedException('You did not write this question!');
                }
                const responseDoc = await getResponse(responseId);
                await acceptAnswer(questionDoc, responseDoc);
                res.send('Answer was accepted!');
            } catch (err) {
                appLogger.error(err.message);
                if (err instanceof HttpException) {
                    throw err;
                }
                throw new InternalServerException('Unknown issue with marking accepted answer!');
            }
        },
    },
};
