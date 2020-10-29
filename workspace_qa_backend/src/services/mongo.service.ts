import { connect } from 'mongoose';
import { AnswerNotFoundException, QuestionNotFoundException } from '../exceptions';
import { IQuestionDocumnet, IResponseDocumnet } from '../models/DB/interfaces';
import { questionModel, responseModel } from '../models/DB/schemas';
import { CreateQuestionDto, ResponseDto } from '../models/dtos';
import { appLogger } from './appLogger.service';

export const mongoDBConnect = async () => {
    const { MONGO_USER, MONGO_PASS, MONGO_PATH } = process.env;
    try {
        await connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}${MONGO_PATH}`, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        appLogger.debug('Connected to mongo!!!');
    } catch (error) {
        appLogger.error('Could not connect to MongoDB', error);
    }
};

export const isUserFromProject = ({ projects }: Express.User, projectId: string) =>
    projects.some((prj) => prj._id.equals(projectId));

export const isUserResponseOwner = ({ user }: IResponseDocumnet, { _id }: Express.User) =>
    user._id.equals(_id) as boolean;

export const createResponse = ({ message }: ResponseDto, { _id, name, avatar }: Express.User) => {
    const response = new responseModel({
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
    return response;
};

export const createQuestion = (
    projectId: string,
    { title, filePath }: CreateQuestionDto,
    questionResponse: IResponseDocumnet
) => {
    const question = new questionModel({
        title,
        filePath,
        project: projectId,
        question: questionResponse,
        answers: [],
    });
    return question;
};

export const getQuestion = async (questionId: string) => {
    const questionDoc = await questionModel.findById(questionId).populate('question').exec();
    if (!questionDoc) {
        throw new QuestionNotFoundException(questionId);
    }
    return questionDoc;
};

export const getAnswer = async (answerId: string) => {
    const answer = await responseModel.findById(answerId).exec();
    if (!answer) {
        throw new AnswerNotFoundException(answerId);
    }
    return answer;
};

export const getAnswers = async (questionId: string) => {
    const questionDoc = await questionModel
        .findById(questionId)
        .select('answers')
        .populate('answers')
        .exec();
    if (!questionDoc) {
        throw new QuestionNotFoundException(questionId);
    }
    return questionDoc.answers;
};

export const updateResponse = async (response: IResponseDocumnet, { message }: ResponseDto) => {
    const oldMsg = response.message;
    return await responseModel
        .findOneAndUpdate(
            { ...response.toObject() },
            { message, $push: { revisions: oldMsg }, edited: true },
            { new: true }
        )
        .exec();
};

export const updateQuestion = async (
    { message, filePath, title }: CreateQuestionDto,
    questionDoc: IQuestionDocumnet
) => {
    if (message) {
        questionDoc.question = await updateResponse(questionDoc.question, { message });
    }
    if (title || filePath) {
        questionDoc.title = title;
        questionDoc.filePath = filePath || questionDoc.filePath;
        await questionDoc.updateOne({ ...questionDoc.toObject() }).exec();
    }
};

export const addAnswerToQuestion = async (questionId: string, answerDoc: IResponseDocumnet) => {
    const questionFetch = getQuestion(questionId);
    const [answer, question] = await Promise.all([answerDoc.save(), questionFetch]);
    await question.updateOne({ $push: { answers: answer } }).exec();
};
